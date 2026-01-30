import { integer, pgEnum, pgTable, text, timestamp, varchar, serial } from "drizzle-orm/pg-core";

// ============================================================================
// ENUMS
// ============================================================================
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const sourceEnum = pgEnum("source", ["clawdbot", "kilo", "custom"]);
export const syncTypeEnum = pgEnum("syncType", ["manual", "automatic"]);
export const syncStatusEnum = pgEnum("syncStatus", ["success", "failed", "in_progress"]);
export const ghActivityStatusEnum = pgEnum("ghActivityStatus", ["success", "failed"]);
export const executionStatusEnum = pgEnum("executionStatus", ["success", "failed", "pending"]);
export const visibilityEnum = pgEnum("visibility", ["public", "private"]);
export const notificationTypeEnum = pgEnum("notificationType", [
  "task_completed", "task_failed", "team_invitation", 
  "skill_published", "review_received", "system_alert"
]);
export const teamRoleEnum = pgEnum("teamRole", ["owner", "admin", "member", "viewer"]);
export const shareTypeEnum = pgEnum("shareType", ["public", "team", "private"]);

// ============================================================================
// CORE TABLES
// ============================================================================
export const users = pgTable("users", {
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

export const skills = pgTable("skills", {
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

export const syncHistory = pgTable("sync_history", {
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

export const githubActivity = pgTable("github_activity", {
  id: serial("id").primaryKey(),
  repository: varchar("repository", { length: 255 }).notNull(),
  commitHash: varchar("commitHash", { length: 64 }),
  commitMessage: text("commitMessage"),
  filesChanged: integer("filesChanged").default(0).notNull(),
  author: varchar("author", { length: 128 }),
  branch: varchar("branch", { length: 128 }).default("main").notNull(),
  status: ghActivityStatusEnum("status").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GitHubActivity = typeof githubActivity.$inferSelect;
export type InsertGitHubActivity = typeof githubActivity.$inferInsert;

export const systemSettings = pgTable("system_settings", {
  id: serial("id").primaryKey(),
  settingKey: varchar("settingKey", { length: 128 }).notNull().unique(),
  settingValue: text("settingValue").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type SystemSetting = typeof systemSettings.$inferSelect;
export type InsertSystemSetting = typeof systemSettings.$inferInsert;

export const executionHistory = pgTable("execution_history", {
  id: serial("id").primaryKey(),
  skillId: varchar("skillId", { length: 128 }).notNull(),
  skillName: varchar("skillName", { length: 255 }).notNull(),
  userId: integer("userId").notNull(),
  parameters: text("parameters"),
  result: text("result"),
  status: executionStatusEnum("status").notNull(),
  duration: integer("duration"),
  errorMessage: text("errorMessage"),
  executedAt: timestamp("executedAt").defaultNow().notNull(),
});

export type ExecutionHistory = typeof executionHistory.$inferSelect;
export type InsertExecutionHistory = typeof executionHistory.$inferInsert;

export const scheduledTasks = pgTable("scheduled_tasks", {
  id: serial("id").primaryKey(),
  skillId: varchar("skillId", { length: 255 }).notNull(),
  skillName: varchar("skillName", { length: 255 }).notNull(),
  cronExpression: varchar("cronExpression", { length: 100 }).notNull(),
  parameters: text("parameters"),
  enabled: integer("enabled").default(1).notNull(),
  lastRun: timestamp("lastRun"),
  nextRun: timestamp("nextRun"),
  runCount: integer("runCount").default(0).notNull(),
  createdBy: integer("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type ScheduledTask = typeof scheduledTasks.$inferSelect;
export type InsertScheduledTask = typeof scheduledTasks.$inferInsert;

// ============================================================================
// MARKETPLACE TABLES
// ============================================================================
export const marketplaceSkills = pgTable("marketplace_skills", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 64 }).notNull(),
  tags: text("tags"),
  authorId: integer("authorId").notNull(),
  authorName: varchar("authorName", { length: 128 }),
  version: varchar("version", { length: 32 }).default("1.0.0").notNull(),
  downloads: integer("downloads").default(0).notNull(),
  rating: integer("rating").default(0).notNull(),
  reviewCount: integer("reviewCount").default(0).notNull(),
  visibility: visibilityEnum("visibility").default("public").notNull(),
  code: text("code"),
  parameters: text("parameters"),
  examples: text("examples"),
  readme: text("readme"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type MarketplaceSkill = typeof marketplaceSkills.$inferSelect;
export type InsertMarketplaceSkill = typeof marketplaceSkills.$inferInsert;

export const skillReviews = pgTable("skill_reviews", {
  id: serial("id").primaryKey(),
  skillId: integer("skillId").notNull(),
  userId: integer("userId").notNull(),
  userName: varchar("userName", { length: 128 }),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type SkillReview = typeof skillReviews.$inferSelect;
export type InsertSkillReview = typeof skillReviews.$inferInsert;

export const installedSkills = pgTable("installed_skills", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  skillId: integer("skillId").notNull(),
  marketplaceSkillId: integer("marketplaceSkillId"),
  installedAt: timestamp("installedAt").defaultNow().notNull(),
});

export type InstalledSkill = typeof installedSkills.$inferSelect;
export type InsertInstalledSkill = typeof installedSkills.$inferInsert;

// ============================================================================
// NOTIFICATIONS
// ============================================================================
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  type: notificationTypeEnum("type").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message"),
  link: varchar("link", { length: 512 }),
  read: integer("read").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

// ============================================================================
// TEAMS
// ============================================================================
export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  ownerId: integer("ownerId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Team = typeof teams.$inferSelect;
export type InsertTeam = typeof teams.$inferInsert;

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  teamId: integer("teamId").notNull(),
  userId: integer("userId").notNull(),
  role: teamRoleEnum("role").default("member").notNull(),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
});

export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = typeof teamMembers.$inferInsert;

export const skillShares = pgTable("skill_shares", {
  id: serial("id").primaryKey(),
  skillId: varchar("skillId", { length: 255 }).notNull(),
  sharedWith: shareTypeEnum("sharedWith").default("private").notNull(),
  teamId: integer("teamId"),
  ownerId: integer("ownerId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SkillShare = typeof skillShares.$inferSelect;
export type InsertSkillShare = typeof skillShares.$inferInsert;

