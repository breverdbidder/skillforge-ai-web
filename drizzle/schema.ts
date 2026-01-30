import { integer, pgEnum, pgTable, text, timestamp, varchar, serial } from "drizzle-orm/pg-core";

/**
 * Core user table backing auth flow.
 * Columns use camelCase to match both database fields and generated types.
 * Table name prefixed with skillforge_ to avoid conflicts with existing users table.
 */
export const roleEnum = pgEnum("role", ["user", "admin"]);

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
 * Skills table - stores all ClawdBot skills
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
 * GitHub activity table
 */
export const githubActivity = pgTable("skillforge_github_activity", {
  id: serial("id").primaryKey(),
  repo: varchar("repo", { length: 255 }).notNull(),
  commitSha: varchar("commitSha", { length: 40 }),
  commitMessage: text("commitMessage"),
  branch: varchar("branch", { length: 255 }),
  eventType: varchar("eventType", { length: 64 }),
  payload: text("payload"),
  processedAt: timestamp("processedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GitHubActivity = typeof githubActivity.$inferSelect;
export type InsertGitHubActivity = typeof githubActivity.$inferInsert;

/**
 * Notifications table
 */
export const notificationTypeEnum = pgEnum("notificationType", [
  "skill_sync",
  "github_webhook",
  "execution",
  "system",
]);
export const notificationStatusEnum = pgEnum("notificationStatus", ["unread", "read", "archived"]);

export const notifications = pgTable("skillforge_notifications", {
  id: serial("id").primaryKey(),
  userId: integer("userId").references(() => users.id),
  type: notificationTypeEnum("type").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message"),
  status: notificationStatusEnum("status").default("unread").notNull(),
  metadata: text("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  readAt: timestamp("readAt"),
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
  ownerId: integer("ownerId").references(() => users.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Team = typeof teams.$inferSelect;
export type InsertTeam = typeof teams.$inferInsert;

/**
 * Team members junction table
 */
export const teamRoleEnum = pgEnum("teamRole", ["owner", "admin", "member"]);

export const teamMembers = pgTable("skillforge_team_members", {
  id: serial("id").primaryKey(),
  teamId: integer("teamId").references(() => teams.id).notNull(),
  userId: integer("userId").references(() => users.id).notNull(),
  role: teamRoleEnum("role").default("member").notNull(),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
});

export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = typeof teamMembers.$inferInsert;

/**
 * Execution history table
 */
export const executionStatusEnum = pgEnum("executionStatus", [
  "pending",
  "running",
  "completed",
  "failed",
  "cancelled",
]);

export const executions = pgTable("skillforge_executions", {
  id: serial("id").primaryKey(),
  skillId: varchar("skillId", { length: 128 }).notNull(),
  userId: integer("userId").references(() => users.id),
  status: executionStatusEnum("status").default("pending").notNull(),
  input: text("input"),
  output: text("output"),
  error: text("error"),
  duration: integer("duration"),
  startedAt: timestamp("startedAt"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Execution = typeof executions.$inferSelect;
export type InsertExecution = typeof executions.$inferInsert;

/**
 * Scheduled tasks table
 */
export const scheduleFrequencyEnum = pgEnum("scheduleFrequency", [
  "once",
  "hourly",
  "daily",
  "weekly",
  "monthly",
]);

export const scheduledTasks = pgTable("skillforge_scheduled_tasks", {
  id: serial("id").primaryKey(),
  skillId: varchar("skillId", { length: 128 }).notNull(),
  userId: integer("userId").references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  frequency: scheduleFrequencyEnum("frequency").notNull(),
  cronExpression: varchar("cronExpression", { length: 100 }),
  nextRunAt: timestamp("nextRunAt"),
  lastRunAt: timestamp("lastRunAt"),
  enabled: integer("enabled").default(1).notNull(),
  input: text("input"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type ScheduledTask = typeof scheduledTasks.$inferSelect;
export type InsertScheduledTask = typeof scheduledTasks.$inferInsert;

