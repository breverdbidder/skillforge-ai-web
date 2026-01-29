CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('task_completed','task_failed','team_invitation','skill_published','review_received','system_alert') NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text,
	`link` varchar(512),
	`read` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
