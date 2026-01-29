import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { CronParser, TaskScheduler } from "./scheduler";

/**
 * Scheduling Router - Manages skill scheduling and cron jobs
 */
export const schedulingRouter = router({
  // Validate cron expression
  validateCron: publicProcedure
    .input(z.object({ expression: z.string() }))
    .query(({ input }) => {
      const isValid = CronParser.validate(input.expression);
      let description = "";
      let nextRun: Date | null = null;

      if (isValid) {
        description = CronParser.describe(input.expression);
        try {
          nextRun = CronParser.getNextRun(input.expression);
        } catch (error) {
          // Ignore
        }
      }

      return {
        valid: isValid,
        description,
        nextRun: nextRun?.toISOString() || null,
      };
    }),

  // Create scheduled task
  create: protectedProcedure
    .input(
      z.object({
        skillId: z.string(),
        skillName: z.string(),
        cronExpression: z.string(),
        parameters: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const task = await TaskScheduler.createTask({
        ...input,
        createdBy: ctx.user.id,
      });
      return task;
    }),

  // Update scheduled task
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        cronExpression: z.string().optional(),
        parameters: z.string().optional(),
        enabled: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;
      await TaskScheduler.updateTask(id, updates);
      return { success: true };
    }),

  // Delete scheduled task
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await TaskScheduler.deleteTask(input.id);
      return { success: true };
    }),

  // Get all scheduled tasks
  list: publicProcedure.query(async () => {
    return await TaskScheduler.getAllTasks();
  }),

  // Get upcoming executions
  upcoming: publicProcedure
    .input(z.object({ days: z.number().default(7) }))
    .query(async ({ input }) => {
      return await TaskScheduler.getUpcomingTasks(input.days);
    }),

  // Get calendar events for scheduled tasks
  calendar: publicProcedure
    .input(
      z.object({
        start: z.string(), // ISO date
        end: z.string(), // ISO date
      })
    )
    .query(async ({ input }) => {
      const tasks = await TaskScheduler.getAllTasks();
      const startDate = new Date(input.start);
      const endDate = new Date(input.end);

      const events: Array<{
        id: string;
        title: string;
        start: string;
        skillId: string;
        taskId: number;
      }> = [];

      for (const task of tasks) {
        if (task.enabled !== 1) continue;

        let currentDate = task.nextRun || startDate;

        // Generate events within date range
        while (currentDate <= endDate && events.length < 1000) {
          try {
            const nextRun = CronParser.getNextRun(task.cronExpression, currentDate);

            if (nextRun >= startDate && nextRun <= endDate) {
              events.push({
                id: `${task.id}-${nextRun.getTime()}`,
                title: task.skillName,
                start: nextRun.toISOString(),
                skillId: task.skillId,
                taskId: task.id,
              });
            }

            if (nextRun > endDate) break;

            currentDate = new Date(nextRun.getTime() + 60000); // +1 minute
          } catch {
            break;
          }
        }
      }

      return events;
    }),

  // Mark task as executed (for testing/manual execution)
  markExecuted: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await TaskScheduler.markExecuted(input.id);
      return { success: true };
    }),
});
