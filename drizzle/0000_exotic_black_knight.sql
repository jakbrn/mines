CREATE TABLE `games` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `games_sessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`game` integer NOT NULL,
	`started_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`ended_at` text,
	FOREIGN KEY (`game`) REFERENCES `games`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `mines` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`game` integer NOT NULL,
	FOREIGN KEY (`game`) REFERENCES `games`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `mines_resources` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`mine` integer NOT NULL,
	`resource` integer NOT NULL,
	`interval` integer NOT NULL,
	`amount` integer NOT NULL,
	FOREIGN KEY (`mine`) REFERENCES `mines`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`resource`) REFERENCES `resources`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `resources` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`game` integer NOT NULL,
	FOREIGN KEY (`game`) REFERENCES `games`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `teams` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`game` integer NOT NULL,
	FOREIGN KEY (`game`) REFERENCES `games`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `teams_mines` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`team` integer NOT NULL,
	`mine` integer NOT NULL,
	`amount` integer NOT NULL,
	FOREIGN KEY (`team`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`mine`) REFERENCES `mines`(`id`) ON UPDATE no action ON DELETE no action
);
