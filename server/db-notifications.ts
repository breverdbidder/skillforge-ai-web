import { eq, desc, and } from "drizzle-orm";
import { notifications, InsertNotification, Notification } from "../drizzle/schema";
import { getDb } from "./db";

/**
 * Notifications Management
 */

export async function getUserNotifications(userId: number, limit = 50): Promise<Notification[]> {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);
}

export async function getUnreadNotifications(userId: number): Promise<Notification[]> {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(notifications)
    .where(and(eq(notifications.userId, userId), eq(notifications.read, 0)))
    .orderBy(desc(notifications.createdAt));
}

export async function getUnreadCount(userId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const result = await db
    .select()
    .from(notifications)
    .where(and(eq(notifications.userId, userId), eq(notifications.read, 0)));

  return result.length;
}

export async function createNotification(notification: InsertNotification): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(notifications).values(notification);
  return result[0].insertId;
}

export async function markAsRead(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(notifications).set({ read: 1 }).where(eq(notifications.id, id));
}

export async function markAllAsRead(userId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(notifications)
    .set({ read: 1 })
    .where(and(eq(notifications.userId, userId), eq(notifications.read, 0)));
}

export async function deleteNotification(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(notifications).where(eq(notifications.id, id));
}

export async function deleteAllNotifications(userId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(notifications).where(eq(notifications.userId, userId));
}

/**
 * Helper functions to create specific notification types
 */

export async function notifyTaskCompleted(userId: number, taskName: string, link?: string): Promise<number> {
  return createNotification({
    userId,
    type: "task_completed",
    title: "Task Completed",
    message: `Your scheduled task "${taskName}" has completed successfully.`,
    link,
  });
}

export async function notifyTaskFailed(userId: number, taskName: string, error: string, link?: string): Promise<number> {
  return createNotification({
    userId,
    type: "task_failed",
    title: "Task Failed",
    message: `Your scheduled task "${taskName}" failed: ${error}`,
    link,
  });
}

export async function notifyTeamInvitation(userId: number, teamName: string, inviterName: string, link?: string): Promise<number> {
  return createNotification({
    userId,
    type: "team_invitation",
    title: "Team Invitation",
    message: `${inviterName} invited you to join the team "${teamName}".`,
    link,
  });
}

export async function notifySkillPublished(userId: number, skillName: string, link?: string): Promise<number> {
  return createNotification({
    userId,
    type: "skill_published",
    title: "Skill Published",
    message: `Your skill "${skillName}" has been published to the marketplace.`,
    link,
  });
}

export async function notifyReviewReceived(userId: number, skillName: string, rating: number, link?: string): Promise<number> {
  return createNotification({
    userId,
    type: "review_received",
    title: "New Review",
    message: `Your skill "${skillName}" received a ${rating}-star review.`,
    link,
  });
}

export async function notifySystemAlert(userId: number, title: string, message: string, link?: string): Promise<number> {
  return createNotification({
    userId,
    type: "system_alert",
    title,
    message,
    link,
  });
}
