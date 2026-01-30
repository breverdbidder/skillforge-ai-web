CREATE TABLE "aggregated_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"metricType" varchar(64) NOT NULL,
	"metricValue" integer NOT NULL,
	"dimension1" varchar(128),
	"dimension2" varchar(128),
	"periodStart" timestamp NOT NULL,
	"periodEnd" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skill_usage_patterns" (
	"id" serial PRIMARY KEY NOT NULL,
	"skillId" integer NOT NULL,
	"userId" integer NOT NULL,
	"searchQuery" text,
	"previousSkills" text,
	"parameters" text,
	"success" integer NOT NULL,
	"executionTime" integer,
	"errorType" varchar(128),
	"userRating" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ui_interaction_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"eventType" varchar(64) NOT NULL,
	"component" varchar(128) NOT NULL,
	"action" varchar(128) NOT NULL,
	"pageUrl" varchar(512),
	"metadata" text,
	"sessionId" varchar(128),
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_activity_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"activityType" varchar(64) NOT NULL,
	"resourceType" varchar(64),
	"resourceId" varchar(255),
	"metadata" text,
	"ipAddress" varchar(45),
	"userAgent" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
