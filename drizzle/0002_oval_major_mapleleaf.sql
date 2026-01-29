CREATE TABLE `executionHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`skillId` varchar(128) NOT NULL,
	`skillName` varchar(255) NOT NULL,
	`userId` int NOT NULL,
	`parameters` text,
	`result` text,
	`status` enum('success','failed','pending') NOT NULL,
	`duration` int,
	`errorMessage` text,
	`executedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `executionHistory_id` PRIMARY KEY(`id`)
);
