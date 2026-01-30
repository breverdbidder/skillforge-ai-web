import { integer, pgEnum, pgTable, text, timestamp, varchar, serial } from "drizzle-orm/pg-core";

/**
 * Core user table backing auth flow.
 * Column names use snake_case in DB, camelCase in TypeScript.
 */
export const roleEnum = pgEnum("role", ["user", "admin"]);

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
 * Skills table - stores all ClawdBot skills
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
 * GitHub activity table
 */
export const githubActivity = pgTable("skillforge_github_activity", {
  id: serial("id").primaryKey(),
  repo: varchar("repo", { length: 255 }).notNull(),
  commitSha: varchar("commit_sha", { length: 40 }),
  commitMessage: text("commit_message"),
  branch: varchar("branch", { length: 255 }),
  eventType: varchar("event_type", { length: 64 }),
  payload: text("payload"),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type GitHubActivity = typeof githubActivity.$inferSelect;
export type InsertGitHubActivity = typeof githubActivity.$inferInsert;

/**
 * Notifications table
 */
export const notificationTypeEnum = pgEnum("notification_type", [
  "skill_sync",
  "github_webhook",
  "execution",
  "system",
]);
export const notificationStatusEnum = pgEnum("notification_status", ["unread", "read", "archived"]);

export const notifications = pgTable("skillforge_notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  type: notificationTypeEnum("type").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message"),
  status: notificationStatusEnum("status").default("unread").notNull(),
  metadata: text("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  readAt: timestamp("read_at"),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * Teams table
 */
export const teams = pgTable("skillforge_teams", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  ownerId: integer("owner_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Team = typeof teams.$inferSelect;
export type InsertTeam = typeof teams.$inferInsert;

/**
 * Team members junction table
 */
export const teamRoleEnum = pgEnum("team_role", ["owner", "admin", "member"]);

export const teamMembers = pgTable("skillforge_team_members", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").references(() => teams.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  role: teamRoleEnum("role").default("member").notNull(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = typeof teamMembers.$inferInsert;

/**
 * Execution history table
 */
export const executionStatusEnum = pgEnum("execution_status", [
  "pending",
  "running",
  "completed",
  "failed",
  "cancelled",
]);

export const executions = pgTable("skillforge_executions", {
  id: serial("id").primaryKey(),
  skillId: varchar("skill_id", { length: 128 }).notNull(),
  userId: integer("user_id").references(() => users.id),
  status: executionStatusEnum("status").default("pending").notNull(),
  input: text("input"),
  output: text("output"),
  error: text("error"),
  duration: integer("duration"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Execution = typeof executions.$inferSelect;
export type InsertExecution = typeof executions.$inferInsert;

/**
 * Scheduled tasks table
 */
export const scheduleFrequencyEnum = pgEnum("schedule_frequency", [
  "once",
  "hourly",
  "daily",
  "weekly",
  "monthly",
]);

export const scheduledTasks = pgTable("skillforge_scheduled_tasks", {
  id: serial("id").primaryKey(),
  skillId: varchar("skill_id", { length: 128 }).notNull(),
  userId: integer("user_id").references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  frequency: scheduleFrequencyEnum("frequency").notNull(),
  cronExpression: varchar("cron_expression", { length: 100 }),
  nextRunAt: timestamp("next_run_at"),
  lastRunAt: timestamp("last_run_at"),
  enabled: integer("enabled").default(1).notNull(),
  input: text("input"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type ScheduledTask = typeof scheduledTasks.$inferSelect;
export type InsertScheduledTask = typeof scheduledTasks.$inferInsert;

