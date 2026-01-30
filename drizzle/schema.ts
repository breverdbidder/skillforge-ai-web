import { integer, pgEnum, pgTable, text, timestamp, varchar, serial } from "drizzle-orm/pg-core";

/**
 * Core user table backing auth flow.
 * Using skillforge_ prefix to avoid conflicts with existing tables.
 */
export const roleEnum = pgEnum("skillforge_role", ["user", "admin"]);

export const users = pgTable("skillforge_users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 255 }),
  name: text("name"),
  email: varchar("email", { length: 320 }).unique(),
  passwordHash: varchar("passwordHash", { length: 255 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  googleId: varchar("googleId", { length: 255 }),
  githubId: varchar("githubId", { length: 255 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Skills table
 */
export const sourceEnum = pgEnum("source", ["clawdbot", "kilo", "custom"]);

export const skills = pgTable("skillforge_skills", {
  id: serial("id").primaryKey(),
  skillId: varchar("skillId", { length: 128 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 64 }).notNull(),
  source: sourceEnum("source").default("clawdbot").notNull(),
  enabled: integer("enabled").default(1).notNull(),
  parameters: text("parameters"),
  usageExample: text("usageExample"),
  tags: text("tags"),
  usageCount: integer("usageCount").default(0).notNull(),
  lastUsed: timestamp("lastUsed"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Skill = typeof skills.$inferSelect;
export type InsertSkill = typeof skills.$inferInsert;

/**
 * Sync history table
 */
export const syncTypeEnum = pgEnum("syncType", ["manual", "automatic"]);
export const syncStatusEnum = pgEnum("syncStatus", ["success", "failed", "in_progress"]);

export const syncHistory = pgTable("skillforge_sync_history", {
  id: serial("id").primaryKey(),
  syncType: syncTypeEnum("syncType").notNull(),
  status: syncStatusEnum("status").notNull(),
  skillsAdded: integer("skillsAdded").default(0).notNull(),
  skillsUpdated: integer("skillsUpdated").default(0).notNull(),
  skillsRemoved: integer("skillsRemoved").default(0).notNull(),
  errorMessage: text("errorMessage"),
  duration: integer("duration"),
  startedAt: timestamp("startedAt").notNull(),
  completedAt: timestamp("completedAt"),
});

export type SyncHistory = typeof syncHistory.$inferSelect;
export type InsertSyncHistory = typeof syncHistory.$inferInsert;

/**
 * System settings table
 */
export const systemSettings = pgTable("skillforge_system_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 128 }).notNull().unique(),
  value: text("value"),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type SystemSetting = typeof systemSettings.$inferSelect;
export type InsertSystemSetting = typeof systemSettings.$inferInsert;

/**
 * GitHub Activity table
 */
export const activityTypeEnum = pgEnum("activityType", ["commit", "pr", "issue", "review", "comment"]);

export const githubActivity = pgTable("skillforge_github_activity", {
  id: serial("id").primaryKey(),
  eventId: varchar("eventId", { length: 128 }).notNull().unique(),
  type: activityTypeEnum("type").notNull(),
  repo: varchar("repo", { length: 255 }).notNull(),
  title: text("title"),
  description: text("description"),
  url: text("url"),
  author: varchar("author", { length: 128 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  processedAt: timestamp("processedAt"),
});

export type GitHubActivity = typeof githubActivity.$inferSelect;
export type InsertGitHubActivity = typeof githubActivity.$inferInsert;

/**
 * Execution History table
 */
export const executionStatusEnum = pgEnum("executionStatus", ["success", "failed", "pending"]);

export const executionHistory = pgTable("skillforge_execution_history", {
  id: serial("id").primaryKey(),
  skillId: varchar("skillId", { length: 128 }).notNull(),
  skillName: varchar("skillName", { length: 255 }),
  userId: integer("userId"),
  status: executionStatusEnum("status").notNull(),
  input: text("input"),
  output: text("output"),
  errorMessage: text("errorMessage"),
  duration: integer("duration"),
  executedAt: timestamp("executedAt").defaultNow().notNull(),
});

export type ExecutionHistory = typeof executionHistory.$inferSelect;
export type InsertExecutionHistory = typeof executionHistory.$inferInsert;

/**
 * Teams table
 */
export const teams = pgTable("skillforge_teams", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  ownerId: integer("ownerId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Team = typeof teams.$inferSelect;
export type InsertTeam = typeof teams.$inferInsert;

/**
 * Team Members table
 */
export const teamMemberRoleEnum = pgEnum("teamMemberRole", ["owner", "admin", "member"]);

export const teamMembers = pgTable("skillforge_team_members", {
  id: serial("id").primaryKey(),
  teamId: integer("teamId").notNull(),
  userId: integer("userId").notNull(),
  role: teamMemberRoleEnum("role").default("member").notNull(),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
});

export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = typeof teamMembers.$inferInsert;

/**
 * Notifications table
 */
export const notificationTypeEnum = pgEnum("notificationType", ["info", "success", "warning", "error"]);

export const notifications = pgTable("skillforge_notifications", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  type: notificationTypeEnum("type").default("info").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message"),
  read: integer("read").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * Scheduled Tasks table
 */
export const scheduledTaskStatusEnum = pgEnum("scheduledTaskStatus", ["pending", "running", "completed", "failed", "cancelled"]);

export const scheduledTasks = pgTable("skillforge_scheduled_tasks", {
  id: serial("id").primaryKey(),
  skillId: varchar("skillId", { length: 128 }).notNull(),
  userId: integer("userId").notNull(),
  cronExpression: varchar("cronExpression", { length: 128 }),
  scheduledTime: timestamp("scheduledTime"),
  status: scheduledTaskStatusEnum("status").default("pending").notNull(),
  input: text("input"),
  lastRun: timestamp("lastRun"),
  nextRun: timestamp("nextRun"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type ScheduledTask = typeof scheduledTasks.$inferSelect;
export type InsertScheduledTask = typeof scheduledTasks.$inferInsert;
