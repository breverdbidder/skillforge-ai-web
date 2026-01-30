CREATE TYPE "public"."bonusStatus" AS ENUM('pending', 'approved', 'paid');--> statement-breakpoint
CREATE TYPE "public"."bonusType" AS ENUM('first_skill', 'milestone', 'referral');--> statement-breakpoint
CREATE TYPE "public"."executionStatus" AS ENUM('success', 'failed', 'pending');--> statement-breakpoint
CREATE TYPE "public"."ghActivityStatus" AS ENUM('success', 'failed');--> statement-breakpoint
CREATE TYPE "public"."notificationType" AS ENUM('task_completed', 'task_failed', 'team_invitation', 'skill_published', 'review_received', 'system_alert');--> statement-breakpoint
CREATE TYPE "public"."payoutStatus" AS ENUM('pending', 'processing', 'paid');--> statement-breakpoint
CREATE TYPE "public"."pricingModel" AS ENUM('free', 'rental', 'pay-per-execution');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TYPE "public"."shareType" AS ENUM('public', 'team', 'private');--> statement-breakpoint
CREATE TYPE "public"."source" AS ENUM('clawdbot', 'kilo', 'custom');--> statement-breakpoint
CREATE TYPE "public"."subscriptionTier" AS ENUM('free', 'creator', 'professional', 'enterprise');--> statement-breakpoint
CREATE TYPE "public"."syncStatus" AS ENUM('success', 'failed', 'in_progress');--> statement-breakpoint
CREATE TYPE "public"."syncType" AS ENUM('manual', 'automatic');--> statement-breakpoint
CREATE TYPE "public"."teamRole" AS ENUM('owner', 'admin', 'member', 'viewer');--> statement-breakpoint
CREATE TYPE "public"."visibility" AS ENUM('public', 'private');--> statement-breakpoint
CREATE TABLE "creator_bonuses" (
	"id" serial PRIMARY KEY NOT NULL,
	"creatorId" integer NOT NULL,
	"bonusType" "bonusType" NOT NULL,
	"amount" integer NOT NULL,
	"status" "bonusStatus" DEFAULT 'pending' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"paidAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "creator_earnings" (
	"id" serial PRIMARY KEY NOT NULL,
	"creatorId" integer NOT NULL,
	"skillId" integer NOT NULL,
	"executionId" integer NOT NULL,
	"grossRevenue" integer NOT NULL,
	"platformCommission" integer NOT NULL,
	"netRevenue" integer NOT NULL,
	"payoutStatus" "payoutStatus" DEFAULT 'pending' NOT NULL,
	"payoutDate" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "creator_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"isCreator" integer DEFAULT 0 NOT NULL,
	"creatorBonusClaimed" integer DEFAULT 0 NOT NULL,
	"stripeAccountId" varchar(255),
	"totalEarnings" integer DEFAULT 0 NOT NULL,
	"totalSkills" integer DEFAULT 0 NOT NULL,
	"totalExecutions" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "creator_profiles_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "execution_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"skillId" varchar(128) NOT NULL,
	"skillName" varchar(255) NOT NULL,
	"userId" integer NOT NULL,
	"parameters" text,
	"result" text,
	"status" "executionStatus" NOT NULL,
	"duration" integer,
	"errorMessage" text,
	"executedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "github_activity" (
	"id" serial PRIMARY KEY NOT NULL,
	"repository" varchar(255) NOT NULL,
	"commitHash" varchar(64),
	"commitMessage" text,
	"filesChanged" integer DEFAULT 0 NOT NULL,
	"author" varchar(128),
	"branch" varchar(128) DEFAULT 'main' NOT NULL,
	"status" "ghActivityStatus" NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "installed_skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"skillId" integer NOT NULL,
	"marketplaceSkillId" integer,
	"installedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "marketplace_skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(64) NOT NULL,
	"tags" text,
	"authorId" integer NOT NULL,
	"authorName" varchar(128),
	"version" varchar(32) DEFAULT '1.0.0' NOT NULL,
	"downloads" integer DEFAULT 0 NOT NULL,
	"rating" integer DEFAULT 0 NOT NULL,
	"reviewCount" integer DEFAULT 0 NOT NULL,
	"visibility" "visibility" DEFAULT 'public' NOT NULL,
	"code" text,
	"parameters" text,
	"examples" text,
	"readme" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "marketplace_skills_pricing" (
	"id" serial PRIMARY KEY NOT NULL,
	"skillId" integer NOT NULL,
	"pricingModel" "pricingModel" DEFAULT 'free' NOT NULL,
	"price" integer DEFAULT 0 NOT NULL,
	"executionUnitCost" integer DEFAULT 0 NOT NULL,
	"skillForgeScore" integer DEFAULT 0 NOT NULL,
	"isValidated" integer DEFAULT 0 NOT NULL,
	"isFeatured" integer DEFAULT 0 NOT NULL,
	"mcpRequirements" text,
	"githubUrl" varchar(500),
	"totalExecutions" integer DEFAULT 0 NOT NULL,
	"totalRevenue" integer DEFAULT 0 NOT NULL,
	"averageRating" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "marketplace_skills_pricing_skillId_unique" UNIQUE("skillId")
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"type" "notificationType" NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" text,
	"link" varchar(512),
	"read" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scheduled_tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"skillId" varchar(255) NOT NULL,
	"skillName" varchar(255) NOT NULL,
	"cronExpression" varchar(100) NOT NULL,
	"parameters" text,
	"enabled" integer DEFAULT 1 NOT NULL,
	"lastRun" timestamp,
	"nextRun" timestamp,
	"runCount" integer DEFAULT 0 NOT NULL,
	"createdBy" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skill_executions" (
	"id" serial PRIMARY KEY NOT NULL,
	"skillId" integer NOT NULL,
	"userId" integer NOT NULL,
	"status" "executionStatus" NOT NULL,
	"executionTime" integer,
	"executionUnits" integer DEFAULT 0 NOT NULL,
	"cost" integer DEFAULT 0 NOT NULL,
	"errorMessage" text,
	"executedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skill_reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"skillId" integer NOT NULL,
	"userId" integer NOT NULL,
	"userName" varchar(128),
	"rating" integer NOT NULL,
	"comment" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skill_shares" (
	"id" serial PRIMARY KEY NOT NULL,
	"skillId" varchar(255) NOT NULL,
	"sharedWith" "shareType" DEFAULT 'private' NOT NULL,
	"teamId" integer,
	"ownerId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"skillId" varchar(128) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(64) NOT NULL,
	"source" "source" DEFAULT 'clawdbot' NOT NULL,
	"enabled" integer DEFAULT 1 NOT NULL,
	"parameters" text,
	"usageExample" text,
	"tags" text,
	"usageCount" integer DEFAULT 0 NOT NULL,
	"lastUsed" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "skills_skillId_unique" UNIQUE("skillId")
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"tier" "subscriptionTier" DEFAULT 'free' NOT NULL,
	"monthlyExecutions" integer DEFAULT 0 NOT NULL,
	"executionLimit" integer NOT NULL,
	"stripeSubscriptionId" varchar(255),
	"currentPeriodStart" timestamp,
	"currentPeriodEnd" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subscriptions_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "sync_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"syncType" "syncType" NOT NULL,
	"status" "syncStatus" NOT NULL,
	"skillsAdded" integer DEFAULT 0 NOT NULL,
	"skillsUpdated" integer DEFAULT 0 NOT NULL,
	"skillsRemoved" integer DEFAULT 0 NOT NULL,
	"errorMessage" text,
	"duration" integer,
	"startedAt" timestamp NOT NULL,
	"completedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "system_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"settingKey" varchar(128) NOT NULL,
	"settingValue" text NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "system_settings_settingKey_unique" UNIQUE("settingKey")
);
--> statement-breakpoint
CREATE TABLE "team_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"teamId" integer NOT NULL,
	"userId" integer NOT NULL,
	"role" "teamRole" DEFAULT 'member' NOT NULL,
	"joinedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"ownerId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skillforge_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(255),
	"name" text,
	"email" varchar(320),
	"passwordHash" varchar(255),
	"loginMethod" varchar(64),
	"googleId" varchar(255),
	"githubId" varchar(255),
	"role" "role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "skillforge_users_email_unique" UNIQUE("email")
);
