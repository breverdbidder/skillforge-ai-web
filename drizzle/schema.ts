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
  /** OAuth identifier (openId for Manus, or provider-specific ID). Unique per user. */
  openId: varchar("openId", { length: 255 }),
  name: text("name"),
  email: varchar("email", { length: 320 }).unique(),
  /** Password hash for email/password authentication */
  passwordHash: varchar("passwordHash", { length: 255 }),
  /** OAuth provider: manus, google, github, local */
  loginMethod: varchar("loginMethod", { length: 64 }),
  /** Google OAuth ID */
  googleId: varchar("googleId", { length: 255 }),
  /** GitHub OAuth ID */
  githubId: varchar("githubId", { length: 255 }),
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
 * Skill Marketplace
 */
export const marketplaceSkills = mysqlTable("marketplaceSkills", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 64 }).notNull(),
  tags: text("tags"),
  authorId: int("authorId").notNull(),
  authorName: varchar("authorName", { length: 128 }),
  version: varchar("version", { length: 32 }).default("1.0.0").notNull(),
  downloads: int("downloads").default(0).notNull(),
  rating: int("rating").default(0).notNull(), // Average rating * 100 (e.g., 450 = 4.5 stars)
  reviewCount: int("reviewCount").default(0).notNull(),
  visibility: mysqlEnum("visibility", ["public", "private"]).default("public").notNull(),
  code: text("code"), // Skill implementation code
  parameters: text("parameters"), // JSON schema for parameters
  examples: text("examples"), // Usage examples
  readme: text("readme"), // Markdown documentation
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MarketplaceSkill = typeof marketplaceSkills.$inferSelect;
export type InsertMarketplaceSkill = typeof marketplaceSkills.$inferInsert;

export const skillReviews = mysqlTable("skillReviews", {
  id: int("id").autoincrement().primaryKey(),
  skillId: int("skillId").notNull(),
  userId: int("userId").notNull(),
  userName: varchar("userName", { length: 128 }),
  rating: int("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SkillReview = typeof skillReviews.$inferSelect;
export type InsertSkillReview = typeof skillReviews.$inferInsert;

export const installedSkills = mysqlTable("installedSkills", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  skillId: int("skillId").notNull(),
  marketplaceSkillId: int("marketplaceSkillId"),
  installedAt: timestamp("installedAt").defaultNow().notNull(),
});

export type InstalledSkill = typeof installedSkills.$inferSelect;
export type InsertInstalledSkill = typeof installedSkills.$inferInsert;

/**
 * Notifications System
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", [
    "task_completed",
    "task_failed",
    "team_invitation",
    "skill_published",
    "review_received",
    "system_alert",
  ]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message"),
  link: varchar("link", { length: 512 }),
  read: int("read").default(0).notNull(), // 0 = unread, 1 = read
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

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