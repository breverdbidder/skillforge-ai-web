import { scheduledTasks, type ScheduledTask } from "../drizzle/schema";
import { getDb } from "./db";
import { eq } from "drizzle-orm";

/**
 * Cron Expression Parser
 * Supports standard cron format: minute hour day month weekday
 * Example: "0 9 * * 1-5" = 9 AM on weekdays
 */
export class CronParser {
  /**
   * Validate cron expression format
   */
  static validate(expression: string): boolean {
    const parts = expression.trim().split(/\s+/);
    if (parts.length !== 5) return false;

    const [minute, hour, day, month, weekday] = parts;

    // Validate minute (0-59)
    if (!this.validateField(minute, 0, 59)) return false;
    // Validate hour (0-23)
    if (!this.validateField(hour, 0, 23)) return false;
    // Validate day (1-31)
    if (!this.validateField(day, 1, 31)) return false;
    // Validate month (1-12)
    if (!this.validateField(month, 1, 12)) return false;
    // Validate weekday (0-6, 0=Sunday)
    if (!this.validateField(weekday, 0, 6)) return false;

    return true;
  }

  private static validateField(field: string, min: number, max: number): boolean {
    // Allow * (any)
    if (field === "*") return true;

    // Allow ranges (e.g., 1-5)
    if (field.includes("-")) {
      const [start, end] = field.split("-").map(Number);
      return start >= min && end <= max && start <= end;
    }

    // Allow steps (e.g., */5)
    if (field.includes("/")) {
      const [range, step] = field.split("/");
      if (range !== "*" && !this.validateField(range, min, max)) return false;
      const stepNum = Number(step);
      return stepNum > 0 && stepNum <= max;
    }

    // Allow lists (e.g., 1,3,5)
    if (field.includes(",")) {
      return field.split(",").every((part) => this.validateField(part.trim(), min, max));
    }

    // Single number
    const num = Number(field);
    return !isNaN(num) && num >= min && num <= max;
  }

  /**
   * Calculate next run time from cron expression
   */
  static getNextRun(expression: string, fromDate: Date = new Date()): Date {
    if (!this.validate(expression)) {
      throw new Error("Invalid cron expression");
    }

    const [minuteExpr, hourExpr, dayExpr, monthExpr, weekdayExpr] = expression.split(/\s+/);

    const next = new Date(fromDate);
    next.setSeconds(0);
    next.setMilliseconds(0);

    // Start from next minute
    next.setMinutes(next.getMinutes() + 1);

    // Find next matching time (max 1 year ahead)
    const maxIterations = 525600; // minutes in a year
    let iterations = 0;

    while (iterations < maxIterations) {
      const minute = next.getMinutes();
      const hour = next.getHours();
      const day = next.getDate();
      const month = next.getMonth() + 1; // 1-12
      const weekday = next.getDay(); // 0-6

      if (
        this.matchesField(minute, minuteExpr, 0, 59) &&
        this.matchesField(hour, hourExpr, 0, 23) &&
        this.matchesField(day, dayExpr, 1, 31) &&
        this.matchesField(month, monthExpr, 1, 12) &&
        this.matchesField(weekday, weekdayExpr, 0, 6)
      ) {
        return next;
      }

      next.setMinutes(next.getMinutes() + 1);
      iterations++;
    }

    throw new Error("Could not calculate next run time");
  }

  private static matchesField(value: number, expression: string, min: number, max: number): boolean {
    if (expression === "*") return true;

    if (expression.includes(",")) {
      return expression.split(",").some((part) => this.matchesField(value, part.trim(), min, max));
    }

    if (expression.includes("/")) {
      const [range, step] = expression.split("/");
      const stepNum = Number(step);
      if (range === "*") {
        return value % stepNum === 0;
      }
      // Handle range with step (e.g., 1-10/2)
      const [rangeStart, rangeEnd] = range.split("-").map(Number);
      return value >= rangeStart && value <= rangeEnd && (value - rangeStart) % stepNum === 0;
    }

    if (expression.includes("-")) {
      const [start, end] = expression.split("-").map(Number);
      return value >= start && value <= end;
    }

    return value === Number(expression);
  }

  /**
   * Get human-readable description of cron expression
   */
  static describe(expression: string): string {
    if (!this.validate(expression)) return "Invalid cron expression";

    const [minute, hour, day, month, weekday] = expression.split(/\s+/);

    const parts: string[] = [];

    // Time
    if (minute === "*" && hour === "*") {
      parts.push("Every minute");
    } else if (minute !== "*" && hour !== "*") {
      parts.push(`At ${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`);
    } else if (hour !== "*") {
      parts.push(`Every minute during hour ${hour}`);
    } else if (minute !== "*") {
      parts.push(`At minute ${minute} of every hour`);
    }

    // Day of month
    if (day !== "*") {
      parts.push(`on day ${day}`);
    }

    // Month
    if (month !== "*") {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthName = monthNames[Number(month) - 1];
      parts.push(`in ${monthName}`);
    }

    // Day of week
    if (weekday !== "*") {
      const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      if (weekday.includes("-")) {
        const [start, end] = weekday.split("-").map(Number);
        parts.push(`on ${dayNames[start]}-${dayNames[end]}`);
      } else if (weekday === "1-5") {
        parts.push("on weekdays");
      } else {
        parts.push(`on ${dayNames[Number(weekday)]}`);
      }
    }

    return parts.join(" ");
  }
}

/**
 * Task Scheduler Service
 * Manages scheduled skill executions
 */
export class TaskScheduler {
  /**
   * Create a new scheduled task
   */
  static async createTask(task: {
    skillId: string;
    skillName: string;
    cronExpression: string;
    parameters?: string;
    createdBy?: number;
  }): Promise<ScheduledTask> {
    if (!CronParser.validate(task.cronExpression)) {
      throw new Error("Invalid cron expression");
    }

    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const nextRun = CronParser.getNextRun(task.cronExpression);

    const [result] = await db.insert(scheduledTasks).values({
      skillId: task.skillId,
      skillName: task.skillName,
      cronExpression: task.cronExpression,
      parameters: task.parameters || null,
      nextRun,
      createdBy: task.createdBy || null,
    });

    const [created] = await db
      .select()
      .from(scheduledTasks)
      .where(eq(scheduledTasks.id, Number(result.insertId)));

    return created!;
  }

  /**
   * Update scheduled task
   */
  static async updateTask(
    id: number,
    updates: {
      cronExpression?: string;
      parameters?: string;
      enabled?: boolean;
    }
  ): Promise<void> {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const updateData: any = {};

    if (updates.cronExpression) {
      if (!CronParser.validate(updates.cronExpression)) {
        throw new Error("Invalid cron expression");
      }
      updateData.cronExpression = updates.cronExpression;
      updateData.nextRun = CronParser.getNextRun(updates.cronExpression);
    }

    if (updates.parameters !== undefined) {
      updateData.parameters = updates.parameters;
    }

    if (updates.enabled !== undefined) {
      updateData.enabled = updates.enabled ? 1 : 0;
    }

    await db.update(scheduledTasks).set(updateData).where(eq(scheduledTasks.id, id));
  }

  /**
   * Delete scheduled task
   */
  static async deleteTask(id: number): Promise<void> {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    await db.delete(scheduledTasks).where(eq(scheduledTasks.id, id));
  }

  /**
   * Get all scheduled tasks
   */
  static async getAllTasks(): Promise<ScheduledTask[]> {
    const db = await getDb();
    if (!db) return [];

    return db.select().from(scheduledTasks);
  }

  /**
   * Get upcoming tasks (next 7 days)
   */
  static async getUpcomingTasks(days: number = 7): Promise<
    Array<{
      task: ScheduledTask;
      nextRuns: Date[];
    }>
  > {
    const tasks = await this.getAllTasks();
    const now = new Date();
    const endDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    return tasks
      .filter((task) => task.enabled === 1)
      .map((task) => {
        const nextRuns: Date[] = [];
        let currentDate = task.nextRun || now;

        // Calculate next runs within the time window
        while (currentDate <= endDate && nextRuns.length < 50) {
          try {
            const nextRun = CronParser.getNextRun(task.cronExpression, currentDate);
            if (nextRun <= endDate) {
              nextRuns.push(nextRun);
              currentDate = new Date(nextRun.getTime() + 60000); // +1 minute
            } else {
              break;
            }
          } catch {
            break;
          }
        }

        return { task, nextRuns };
      });
  }

  /**
   * Mark task as executed and calculate next run
   */
  static async markExecuted(id: number): Promise<void> {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const [task] = await db.select().from(scheduledTasks).where(eq(scheduledTasks.id, id));

    if (!task) throw new Error("Task not found");

    const nextRun = CronParser.getNextRun(task.cronExpression);

    await db
      .update(scheduledTasks)
      .set({
        lastRun: new Date(),
        nextRun,
        runCount: task.runCount + 1,
      })
      .where(eq(scheduledTasks.id, id));
  }
}
