PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_games` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_games`("id", "name", "created_at") SELECT "id", "name", "created_at" FROM `games`;--> statement-breakpoint
DROP TABLE `games`;--> statement-breakpoint
ALTER TABLE `__new_games` RENAME TO `games`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_games_sessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`game` integer NOT NULL,
	`started_at` text NOT NULL,
	`ended_at` text,
	FOREIGN KEY (`game`) REFERENCES `games`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_games_sessions`("id", "game", "started_at", "ended_at") SELECT "id", "game", "started_at", "ended_at" FROM `games_sessions`;--> statement-breakpoint
DROP TABLE `games_sessions`;--> statement-breakpoint
ALTER TABLE `__new_games_sessions` RENAME TO `games_sessions`;--> statement-breakpoint
CREATE TABLE `__new_teams_mines` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`team` integer NOT NULL,
	`mine` integer NOT NULL,
	`claimed_at` text NOT NULL,
	FOREIGN KEY (`team`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`mine`) REFERENCES `mines`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_teams_mines`("id", "team", "mine", "claimed_at") SELECT "id", "team", "mine", "claimed_at" FROM `teams_mines`;--> statement-breakpoint
DROP TABLE `teams_mines`;--> statement-breakpoint
ALTER TABLE `__new_teams_mines` RENAME TO `teams_mines`;