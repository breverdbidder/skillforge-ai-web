import { z } from "zod";
import { router, protectedProcedure } from "./_core/trpc";
import { getDb } from "./db";
import { notifications } from "../drizzle/schema";
import { eq, desc, and } from "drizzle-orm";

export const notificationsRouter = router({
  /**
   * Get all notifications for the current user
   */
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      throw new Error("Database not available");
    }

    const userNotifications = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, ctx.user.id))
      .orderBy(desc(notifications.createdAt))
      .limit(100);

    return userNotifications;
  }),

  /**
   * Get unread notification count
   */
  getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      throw new Error("Database not available");
    }

    const unreadNotifications = await db
      .select()
      .from(notifications)
      .where(and(eq(notifications.userId, ctx.user.id), eq(notifications.read, 0)));

    return { count: unreadNotifications.length };
  }),

  /**
   * Mark notification as read
   */
  markAsRead: protectedProcedure
    .input(z.object({ notificationId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      await db
        .update(notifications)
        .set({ read: 1 })
        .where(
          and(eq(notifications.id, input.notificationId), eq(notifications.userId, ctx.user.id))
        );

      return { success: true };
    }),

  /**
   * Mark all notifications as read
   */
  markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      throw new Error("Database not available");
    }

    await db
      .update(notifications)
      .set({ read: 1 })
      .where(eq(notifications.userId, ctx.user.id));

    return { success: true };
  }),

  /**
   * Delete notification
   */
  delete: protectedProcedure
    .input(z.object({ notificationId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      await db
        .delete(notifications)
        .where(
          and(eq(notifications.id, input.notificationId), eq(notifications.userId, ctx.user.id))
        );

      return { success: true };
    }),

  /**
   * Create notification (for internal use)
   */
  create: protectedProcedure
    .input(
      z.object({
        userId: z.number(),
        type: z.enum([
          "task_completed",
          "task_failed",
          "team_invitation",
          "skill_published",
          "review_received",
          "system_alert",
        ]),
        title: z.string(),
        message: z.string().optional(),
        link: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      const [notification] = await db
        .insert(notifications)
        .values({
          userId: input.userId,
          type: input.type,
          title: input.title,
          message: input.message,
          link: input.link,
        })
        .$returningId();

      return { success: true, notificationId: notification.id };
    }),
});
