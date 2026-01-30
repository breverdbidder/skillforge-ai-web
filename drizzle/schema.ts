import { integer, pgEnum, pgTable, text, timestamp, varchar, serial } from "drizzle-orm/pg-core";

/**
 * Core user table backing auth flow.
 * Using skillforge_users to avoid conflict with existing users table.
 */
export const roleEnum = pgEnum("skillforge_role", ["user", "admin"]);

export const users = pgTable("skillforge_users", {
  id: serial("id").primaryKey(),
  openId: varchar("open_id", { length: 255 }),
  name: text("name"),
  email: varchar("email", { length: 320 }).unique(),
  passwordHash: varchar("password_hash", { length: 255 }),
  loginMethod: varchar("login_method", { length: 64 }),
  googleId: varchar("google_id", { length: 255 }),
  githubId: varchar("github_id", { length: 255 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastSignedIn: timestamp("last_signed_in").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Skills table
 */
export const sourceEnum = pgEnum("source", ["clawdbot", "kilo", "custom"]);

export const skills = pgTable("skillforge_skills", {
  id: serial("id").primaryKey(),
  skillId: varchar("skill_id", { length: 128 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 64 }).notNull(),
  source: sourceEnum("source").default("clawdbot").notNull(),
  enabled: integer("enabled").default(1).notNull(),
  parameters: text("parameters"),
  usageExample: text("usage_example"),
  tags: text("tags"),
  usageCount: integer("usage_count").default(0).notNull(),
  lastUsed: timestamp("last_used"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Skill = typeof skills.$inferSelect;
export type InsertSkill = typeof skills.$inferInsert;

/**
 * Sync history table
 */
export const syncTypeEnum = pgEnum("sync_type", ["manual", "automatic"]);
export const syncStatusEnum = pgEnum("sync_status", ["success", "failed", "in_progress"]);

export const syncHistory = pgTable("skillforge_sync_history", {
  id: serial("id").primaryKey(),
  syncType: syncTypeEnum("sync_type").notNull(),
  status: syncStatusEnum("status").notNull(),
  skillsAdded: integer("skills_added").default(0).notNull(),
  skillsUpdated: integer("skills_updated").default(0).notNull(),
  skillsRemoved: integer("skills_removed").default(0).notNull(),
  errorMessage: text("error_message"),
  duration: integer("duration"),
  startedAt: timestamp("started_at").notNull(),
  completedAt: timestamp("completed_at"),
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
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type SystemSetting = typeof systemSettings.$inferSelect;
export type InsertSystemSetting = typeof systemSettings.$inferInsert;

/**
 * GitHub Activity table
 */
export const activityTypeEnum = pgEnum("activity_type", ["commit", "pr", "issue", "review", "comment"]);

export const githubActivity = pgTable("skillforge_github_activity", {
  id: serial("id").primaryKey(),
  eventId: varchar("event_id", { length: 128 }).notNull().unique(),
  type: activityTypeEnum("type").notNull(),
  repo: varchar("repo", { length: 255 }).notNull(),
  title: text("title"),
  description: text("description"),
  url: text("url"),
  author: varchar("author", { length: 128 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  processedAt: timestamp("processed_at"),
});

export type GitHubActivity = typeof githubActivity.$inferSelect;
export type InsertGitHubActivity = typeof githubActivity.$inferInsert;

/**
 * Execution History table
 */
export const executionStatusEnum = pgEnum("execution_status", ["success", "failed", "pending"]);

export const executionHistory = pgTable("skillforge_execution_history", {
  id: serial("id").primaryKey(),
  skillId: varchar("skill_id", { length: 128 }).notNull(),
  skillName: varchar("skill_name", { length: 255 }),
  userId: integer("user_id"),
  status: executionStatusEnum("status").notNull(),
  input: text("input"),
  output: text("output"),
  errorMessage: text("error_message"),
  duration: integer("duration"),
  executedAt: timestamp("executed_at").defaultNow().notNull(),
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
  ownerId: integer("owner_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Team = typeof teams.$inferSelect;
export type InsertTeam = typeof teams.$inferInsert;

/**
 * Team Members table
 */
export const teamMemberRoleEnum = pgEnum("team_member_role", ["owner", "admin", "member"]);

export const teamMembers = pgTable("skillforge_team_members", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").notNull(),
  userId: integer("user_id").notNull(),
  role: teamMemberRoleEnum("role").default("member").notNull(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = typeof teamMembers.$inferInsert;

/**
 * Notifications table
 */
export const notificationTypeEnum = pgEnum("notification_type", ["info", "success", "warning", "error"]);

export const notifications = pgTable("skillforge_notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: notificationTypeEnum("type").default("info").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message"),
  read: integer("read").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * Scheduled Tasks table
 */
export const scheduledTaskStatusEnum = pgEnum("scheduled_task_status", ["pending", "running", "completed", "failed", "cancelled"]);

export const scheduledTasks = pgTable("skillforge_scheduled_tasks", {
  id: serial("id").primaryKey(),
  skillId: varchar("skill_id", { length: 128 }).notNull(),
  userId: integer("user_id").notNull(),
  cronExpression: varchar("cron_expression", { length: 128 }),
  scheduledTime: timestamp("scheduled_time"),
  status: scheduledTaskStatusEnum("status").default("pending").notNull(),
  input: text("input"),
  lastRun: timestamp("last_run"),
  nextRun: timestamp("next_run"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type ScheduledTask = typeof scheduledTasks.$inferSelect;
export type InsertScheduledTask = typeof scheduledTasks.$inferInsert;
