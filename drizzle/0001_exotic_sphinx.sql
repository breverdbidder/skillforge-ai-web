CREATE TABLE `githubActivity` (
	`id` int AUTO_INCREMENT NOT NULL,
	`repository` varchar(255) NOT NULL,
	`commitHash` varchar(64),
	`commitMessage` text,
	`filesChanged` int NOT NULL DEFAULT 0,
	`author` varchar(128),
	`branch` varchar(128) NOT NULL DEFAULT 'main',
	`status` enum('success','failed') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `githubActivity_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `skills` (
	`id` int AUTO_INCREMENT NOT NULL,
	`skillId` varchar(128) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`category` varchar(64) NOT NULL,
	`source` enum('clawdbot','kilo','custom') NOT NULL DEFAULT 'clawdbot',
	`enabled` int NOT NULL DEFAULT 1,
	`parameters` text,
	`usageExample` text,
	`tags` text,
	`usageCount` int NOT NULL DEFAULT 0,
	`lastUsed` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `skills_id` PRIMARY KEY(`id`),
	CONSTRAINT `skills_skillId_unique` UNIQUE(`skillId`)
);
--> statement-breakpoint
CREATE TABLE `syncHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`syncType` enum('manual','automatic') NOT NULL,
	`status` enum('success','failed','in_progress') NOT NULL,
	`skillsAdded` int NOT NULL DEFAULT 0,
	`skillsUpdated` int NOT NULL DEFAULT 0,
	`skillsRemoved` int NOT NULL DEFAULT 0,
	`errorMessage` text,
	`duration` int,
	`startedAt` timestamp NOT NULL,
	`completedAt` timestamp,
	CONSTRAINT `syncHistory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `systemSettings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`settingKey` varchar(128) NOT NULL,
	`settingValue` text NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `systemSettings_id` PRIMARY KEY(`id`),
	CONSTRAINT `systemSettings_settingKey_unique` UNIQUE(`settingKey`)
);
