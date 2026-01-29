import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Skills table - stores all ClawdBot skills
 */
export const skills = mysqlTable("skills", {
  id: int("id").autoincrement().primaryKey(),
  skillId: varchar("skillId", { length: 128 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 64 }).notNull(),
  source: mysqlEnum("source", ["clawdbot", "kilo", "custom"]).default("clawdbot").notNull(),
  enabled: int("enabled").default(1).notNull(),
  parameters: text("parameters"), // JSON string
  usageExample: text("usageExample"),
  tags: text("tags"), // JSON array string
  usageCount: int("usageCount").default(0).notNull(),
  lastUsed: timestamp("lastUsed"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Skill = typeof skills.$inferSelect;
export type InsertSkill = typeof skills.$inferInsert;

/**
 * Sync history table - tracks all sync operations
 */
export const syncHistory = mysqlTable("syncHistory", {
  id: int("id").autoincrement().primaryKey(),
  syncType: mysqlEnum("syncType", ["manual", "automatic"]).notNull(),
  status: mysqlEnum("status", ["success", "failed", "in_progress"]).notNull(),
  skillsAdded: int("skillsAdded").default(0).notNull(),
  skillsUpdated: int("skillsUpdated").default(0).notNull(),
  skillsRemoved: int("skillsRemoved").default(0).notNull(),
  errorMessage: text("errorMessage"),
  duration: int("duration"), // milliseconds
  startedAt: timestamp("startedAt").notNull(),
  completedAt: timestamp("completedAt"),
});

export type SyncHistory = typeof syncHistory.$inferSelect;
export type InsertSyncHistory = typeof syncHistory.$inferInsert;

/**
 * GitHub activity table - tracks commits and repository updates
 */
export const githubActivity = mysqlTable("githubActivity", {
  id: int("id").autoincrement().primaryKey(),
  repository: varchar("repository", { length: 255 }).notNull(),
  commitHash: varchar("commitHash", { length: 64 }),
  commitMessage: text("commitMessage"),
  filesChanged: int("filesChanged").default(0).notNull(),
  author: varchar("author", { length: 128 }),
  branch: varchar("branch", { length: 128 }).default("main").notNull(),
  status: mysqlEnum("status", ["success", "failed"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GitHubActivity = typeof githubActivity.$inferSelect;
export type InsertGitHubActivity = typeof githubActivity.$inferInsert;

/**
 * System settings table - stores configuration
 */
export const systemSettings = mysqlTable("systemSettings", {
  id: int("id").autoincrement().primaryKey(),
  settingKey: varchar("settingKey", { length: 128 }).notNull().unique(),
  settingValue: text("settingValue").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SystemSetting = typeof systemSettings.$inferSelect;
export type InsertSystemSetting = typeof systemSettings.$inferInsert;

/**
 * Execution history table - tracks all skill executions
 */
export const executionHistory = mysqlTable("executionHistory", {
  id: int("id").autoincrement().primaryKey(),
  skillId: varchar("skillId", { length: 128 }).notNull(),
  skillName: varchar("skillName", { length: 255 }).notNull(),
  userId: int("userId").notNull(),
  parameters: text("parameters"), // JSON string
  result: text("result"), // JSON string
  status: mysqlEnum("status", ["success", "failed", "pending"]).notNull(),
  duration: int("duration"), // in milliseconds
  errorMessage: text("errorMessage"),
  executedAt: timestamp("executedAt").defaultNow().notNull(),
});

export type ExecutionHistory = typeof executionHistory.$inferSelect;
export type InsertExecutionHistory = typeof executionHistory.$inferInsert;

/**
 * Scheduled Tasks table - stores skill execution schedules
 */
export const scheduledTasks = mysqlTable("scheduled_tasks", {
  id: int("id").autoincrement().primaryKey(),
  skillId: varchar("skill_id", { length: 255 }).notNull(),
  skillName: varchar("skill_name", { length: 255 }).notNull(),
  cronExpression: varchar("cron_expression", { length: 100 }).notNull(),
  parameters: text("parameters"), // JSON string
  enabled: int("enabled").default(1).notNull(), // 1 = enabled, 0 = disabled
  lastRun: timestamp("last_run"),
  nextRun: timestamp("next_run"),
  runCount: int("run_count").default(0).notNull(),
  createdBy: int("created_by"), // user id
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type ScheduledTask = typeof scheduledTasks.$inferSelect;
export type InsertScheduledTask = typeof scheduledTasks.$inferInsert;

/**
 * Teams table - for multi-user collaboration
 */
export const teams = mysqlTable("teams", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  ownerId: int("owner_id").notNull(), // user id of team owner
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Team = typeof teams.$inferSelect;
export type InsertTeam = typeof teams.$inferInsert;

/**
 * Team Members table - many-to-many relationship between users and teams
 */
export const teamMembers = mysqlTable("team_members", {
  id: int("id").autoincrement().primaryKey(),
  teamId: int("team_id").notNull(),
  userId: int("user_id").notNull(),
  role: mysqlEnum("role", ["owner", "admin", "member", "viewer"]).default("member").notNull(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = typeof teamMembers.$inferInsert;

/**
 * Skill Shares table - controls who can access which skills
 */
export const skillShares = mysqlTable("skill_shares", {
  id: int("id").autoincrement().primaryKey(),
  skillId: varchar("skill_id", { length: 255 }).notNull(),
  sharedWith: mysqlEnum("shared_with", ["public", "team", "private"]).default("private").notNull(),
  teamId: int("team_id"), // null if public or private
  ownerId: int("owner_id").notNull(), // user who owns/created the skill
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type SkillShare = typeof skillShares.$inferSelect;
export type InsertSkillShare = typeof skillShares.$inferInsert;