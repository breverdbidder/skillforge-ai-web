import { desc, eq, like, and, gte, lte } from "drizzle-orm";
import { executionHistory, InsertExecutionHistory } from "../drizzle/schema";
import { getDb } from "./db";

export async function createExecutionRecord(data: InsertExecutionHistory) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create execution record: database not available");
    return null;
  }

  const result = await db.insert(executionHistory).values(data);
  return result;
}

export async function getExecutionHistory(options: {
  limit?: number;
  offset?: number;
  userId?: number;
  skillId?: string;
  status?: "success" | "failed" | "pending";
  startDate?: Date;
  endDate?: Date;
  search?: string;
}) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get execution history: database not available");
    return [];
  }

  const conditions = [];
  
  if (options.userId) {
    conditions.push(eq(executionHistory.userId, options.userId));
  }
  
  if (options.skillId) {
    conditions.push(eq(executionHistory.skillId, options.skillId));
  }
  
  if (options.status) {
    conditions.push(eq(executionHistory.status, options.status));
  }
  
  if (options.startDate) {
    conditions.push(gte(executionHistory.executedAt, options.startDate));
  }
  
  if (options.endDate) {
    conditions.push(lte(executionHistory.executedAt, options.endDate));
  }
  
  if (options.search) {
    conditions.push(like(executionHistory.skillName, `%${options.search}%`));
  }

  let query = db
    .select()
    .from(executionHistory)
    .orderBy(desc(executionHistory.executedAt));

  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }

  if (options.limit) {
    query = query.limit(options.limit) as any;
  }

  if (options.offset) {
    query = query.offset(options.offset) as any;
  }

  return await query;
}

export async function getExecutionById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get execution: database not available");
    return null;
  }

  const result = await db
    .select()
    .from(executionHistory)
    .where(eq(executionHistory.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function getExecutionStatistics(userId?: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get execution statistics: database not available");
    return {
      total: 0,
      successful: 0,
      failed: 0,
      pending: 0,
      averageDuration: 0,
    };
  }

  const conditions = userId ? [eq(executionHistory.userId, userId)] : [];
  
  let query = db.select().from(executionHistory);
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }

  const allExecutions = await query;

  const successful = allExecutions.filter(e => e.status === "success").length;
  const failed = allExecutions.filter(e => e.status === "failed").length;
  const pending = allExecutions.filter(e => e.status === "pending").length;
  
  const durationsWithValues = allExecutions
    .filter(e => e.duration !== null)
    .map(e => e.duration as number);
  
  const averageDuration = durationsWithValues.length > 0
    ? durationsWithValues.reduce((sum, d) => sum + d, 0) / durationsWithValues.length
    : 0;

  return {
    total: allExecutions.length,
    successful,
    failed,
    pending,
    averageDuration: Math.round(averageDuration),
  };
}
