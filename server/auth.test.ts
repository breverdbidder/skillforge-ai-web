import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import { getDb } from "./db";
import { users, notifications } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

describe("Authentication System", () => {
  let testUserId: number;
  let testUserEmail: string;

  beforeAll(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Clean up test user if exists
    testUserEmail = `test-${Date.now()}@skillforge.test`;
    await db.delete(users).where(eq(users.email, testUserEmail));
  });

  it("should register a new user with email/password", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    const result = await caller.auth.register({
      email: testUserEmail,
      password: "testpassword123",
      name: "Test User",
    });

    expect(result.success).toBe(true);
    expect(result.user).toBeDefined();
    expect(result.user.email).toBe(testUserEmail);
    expect(result.user.name).toBe("Test User");
    expect(result.user.loginMethod).toBe("email");

    testUserId = result.user.id;
  });

  it("should not allow duplicate email registration", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    await expect(
      caller.auth.register({
        email: testUserEmail,
        password: "anotherpassword",
        name: "Another User",
      })
    ).rejects.toThrow("Email already registered");
  });

  it("should login with correct credentials", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    const result = await caller.auth.login({
      email: testUserEmail,
      password: "testpassword123",
    });

    expect(result.success).toBe(true);
    expect(result.user).toBeDefined();
    expect(result.user.email).toBe(testUserEmail);
  });

  it("should not login with incorrect password", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    await expect(
      caller.auth.login({
        email: testUserEmail,
        password: "wrongpassword",
      })
    ).rejects.toThrow("Invalid email or password");
  });

  it("should hash passwords securely", async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const userRecords = await db
      .select()
      .from(users)
      .where(eq(users.email, testUserEmail))
      .limit(1);

    const user = userRecords[0];
    expect(user.passwordHash).toBeDefined();
    expect(user.passwordHash).not.toBe("testpassword123");

    // Verify bcrypt hash
    const isValid = await bcrypt.compare("testpassword123", user.passwordHash!);
    expect(isValid).toBe(true);
  });
});

describe("Notification System", () => {
  let testUserId: number;
  let testNotificationId: number;

  beforeAll(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Create test user
    const testEmail = `notif-test-${Date.now()}@skillforge.test`;
    await db.delete(users).where(eq(users.email, testEmail));

    const [newUser] = await db
      .insert(users)
      .values({
        email: testEmail,
        name: "Notification Test User",
        loginMethod: "email",
      })
      .$returningId();

    testUserId = newUser.id;
  });

  it("should create a notification", async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const mockUser = {
      id: testUserId,
      email: "notif-test@skillforge.test",
      name: "Notification Test User",
      role: "user" as const,
      openId: null,
      passwordHash: null,
      loginMethod: "email",
      googleId: null,
      githubId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };

    const caller = appRouter.createCaller({
      user: mockUser,
      req: {} as any,
      res: {} as any,
    });

    const result = await caller.notifications.create({
      userId: testUserId,
      type: "task_completed",
      title: "Test Notification",
      message: "This is a test notification",
    });

    expect(result.success).toBe(true);
    expect(result.notificationId).toBeDefined();
    testNotificationId = result.notificationId!;
  });

  it("should retrieve all notifications for user", async () => {
    const mockUser = {
      id: testUserId,
      email: "notif-test@skillforge.test",
      name: "Notification Test User",
      role: "user" as const,
      openId: null,
      passwordHash: null,
      loginMethod: "email",
      googleId: null,
      githubId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };

    const caller = appRouter.createCaller({
      user: mockUser,
      req: {} as any,
      res: {} as any,
    });

    const notifications = await caller.notifications.getAll();

    expect(notifications).toBeDefined();
    expect(notifications.length).toBeGreaterThan(0);
    expect(notifications[0].userId).toBe(testUserId);
  });

  it("should get unread notification count", async () => {
    const mockUser = {
      id: testUserId,
      email: "notif-test@skillforge.test",
      name: "Notification Test User",
      role: "user" as const,
      openId: null,
      passwordHash: null,
      loginMethod: "email",
      googleId: null,
      githubId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };

    const caller = appRouter.createCaller({
      user: mockUser,
      req: {} as any,
      res: {} as any,
    });

    const result = await caller.notifications.getUnreadCount();

    expect(result.count).toBeGreaterThan(0);
  });

  it("should mark notification as read", async () => {
    const mockUser = {
      id: testUserId,
      email: "notif-test@skillforge.test",
      name: "Notification Test User",
      role: "user" as const,
      openId: null,
      passwordHash: null,
      loginMethod: "email",
      googleId: null,
      githubId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };

    const caller = appRouter.createCaller({
      user: mockUser,
      req: {} as any,
      res: {} as any,
    });

    const result = await caller.notifications.markAsRead({
      notificationId: testNotificationId,
    });

    expect(result.success).toBe(true);

    // Verify it's marked as read
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const notificationRecords = await db
      .select()
      .from(notifications)
      .where(eq(notifications.id, testNotificationId))
      .limit(1);

    expect(notificationRecords[0].read).toBe(1);
  });

  it("should delete notification", async () => {
    const mockUser = {
      id: testUserId,
      email: "notif-test@skillforge.test",
      name: "Notification Test User",
      role: "user" as const,
      openId: null,
      passwordHash: null,
      loginMethod: "email",
      googleId: null,
      githubId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };

    const caller = appRouter.createCaller({
      user: mockUser,
      req: {} as any,
      res: {} as any,
    });

    const result = await caller.notifications.delete({
      notificationId: testNotificationId,
    });

    expect(result.success).toBe(true);

    // Verify it's deleted
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const notificationRecords = await db
      .select()
      .from(notifications)
      .where(eq(notifications.id, testNotificationId))
      .limit(1);

    expect(notificationRecords.length).toBe(0);
  });
});
