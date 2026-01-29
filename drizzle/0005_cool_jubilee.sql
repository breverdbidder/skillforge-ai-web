CREATE TABLE `installedSkills` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`skillId` int NOT NULL,
	`marketplaceSkillId` int,
	`installedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `installedSkills_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `marketplaceSkills` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`category` varchar(64) NOT NULL,
	`tags` text,
	`authorId` int NOT NULL,
	`authorName` varchar(128),
	`version` varchar(32) NOT NULL DEFAULT '1.0.0',
	`downloads` int NOT NULL DEFAULT 0,
	`rating` int NOT NULL DEFAULT 0,
	`reviewCount` int NOT NULL DEFAULT 0,
	`visibility` enum('public','private') NOT NULL DEFAULT 'public',
	`code` text,
	`parameters` text,
	`examples` text,
	`readme` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `marketplaceSkills_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `skillReviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`skillId` int NOT NULL,
	`userId` int NOT NULL,
	`userName` varchar(128),
	`rating` int NOT NULL,
	`comment` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `skillReviews_id` PRIMARY KEY(`id`)
);
