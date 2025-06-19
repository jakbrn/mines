PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_games` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`created_at` text DEFAULT '2025-06-19T19:13:42.349Z' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_games`("id", "name", "created_at") SELECT "id", "name", "created_at" FROM `games`;--> statement-breakpoint
DROP TABLE `games`;--> statement-breakpoint
ALTER TABLE `__new_games` RENAME TO `games`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_games_sessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`game` integer NOT NULL,
	`started_at` text DEFAULT '2025-06-19T19:13:42.349Z' NOT NULL,
	`ended_at` text,
	FOREIGN KEY (`game`) REFERENCES `games`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_games_sessions`("id", "game", "started_at", "ended_at") SELECT "id", "game", "started_at", "ended_at" FROM `games_sessions`;--> statement-breakpoint
DROP TABLE `games_sessions`;--> statement-breakpoint
ALTER TABLE `__new_games_sessions` RENAME TO `games_sessions`;--> statement-breakpoint
CREATE TABLE `__new_mines_resources` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`mine` integer NOT NULL,
	`resource` integer NOT NULL,
	`interval` integer DEFAULT 60000 NOT NULL,
	`amount` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`mine`) REFERENCES `mines`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`resource`) REFERENCES `resources`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_mines_resources`("id", "mine", "resource", "interval", "amount") SELECT "id", "mine", "resource", "interval", "amount" FROM `mines_resources`;--> statement-breakpoint
DROP TABLE `mines_resources`;--> statement-breakpoint
ALTER TABLE `__new_mines_resources` RENAME TO `mines_resources`;--> statement-breakpoint
ALTER TABLE `teams_mines` ADD `claimed_at` text DEFAULT '2025-06-19T19:13:42.350Z' NOT NULL;--> statement-breakpoint
ALTER TABLE `teams_mines` DROP COLUMN `amount`;