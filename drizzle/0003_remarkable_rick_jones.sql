CREATE TABLE `scheduled_tasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`skill_id` varchar(255) NOT NULL,
	`skill_name` varchar(255) NOT NULL,
	`cron_expression` varchar(100) NOT NULL,
	`parameters` text,
	`enabled` int NOT NULL DEFAULT 1,
	`last_run` timestamp,
	`next_run` timestamp,
	`run_count` int NOT NULL DEFAULT 0,
	`created_by` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `scheduled_tasks_id` PRIMARY KEY(`id`)
);
