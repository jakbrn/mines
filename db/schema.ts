import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const games = sqliteTable("games", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  created_at: text()
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export const gamesRelations = relations(games, ({ many }) => ({
  sessions: many(gamesSessions),
  teams: many(teams),
  mines: many(mines),
  resources: many(resources),
}));

export const gamesSessions = sqliteTable("games_sessions", {
  id: int().primaryKey({ autoIncrement: true }),
  game: int()
    .notNull()
    .references(() => games.id),
  started_at: text()
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  ended_at: text(),
});

export const gamesSessionsRelations = relations(gamesSessions, ({ one }) => ({
  gamee: one(games, {
    fields: [gamesSessions.game],
    references: [games.id],
  }),
}));

export const teams = sqliteTable("teams", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  game: int()
    .notNull()
    .references(() => games.id),
});

export const teamsRelations = relations(teams, ({ one }) => ({
  gamee: one(games, {
    fields: [teams.game],
    references: [games.id],
  }),
}));

export const mines = sqliteTable("mines", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  game: int()
    .notNull()
    .references(() => games.id),
});

export const minesRelations = relations(mines, ({ many, one }) => ({
  gamee: one(games, {
    fields: [mines.game],
    references: [games.id],
  }),
  resources: many(minesResources),
}));

export const resources = sqliteTable("resources", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  game: int()
    .notNull()
    .references(() => games.id),
});

export const resourcesRelations = relations(resources, ({ many, one }) => ({
  game: one(games, {
    fields: [resources.game],
    references: [games.id],
  }),
  mines: many(minesResources),
}));

export const minesResources = sqliteTable("mines_resources", {
  id: int().primaryKey({ autoIncrement: true }),
  mine: int()
    .notNull()
    .references(() => mines.id),
  resource: int()
    .notNull()
    .references(() => resources.id),
  interval: int()
    .notNull()
    .default(1000 * 60),
  amount: int().notNull().default(1),
});

export const minesResourcesRelations = relations(minesResources, ({ one }) => ({
  minee: one(mines, {
    fields: [minesResources.mine],
    references: [mines.id],
  }),
  resourcee: one(resources, {
    fields: [minesResources.resource],
    references: [resources.id],
  }),
}));

export const teamsMines = sqliteTable("teams_mines", {
  id: int().primaryKey({ autoIncrement: true }),
  team: int()
    .notNull()
    .references(() => teams.id),
  mine: int()
    .notNull()
    .references(() => mines.id),
  claimed_at: text()
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export const teamsMinesRelations = relations(teamsMines, ({ one }) => ({
  minee: one(mines, {
    fields: [teamsMines.mine],
    references: [mines.id],
  }),
  teamm: one(teams, {
    fields: [teamsMines.team],
    references: [teams.id],
  }),
}));

export type Game = typeof games.$inferSelect;
export type GameSession = typeof gamesSessions.$inferSelect;
export type Team = typeof teams.$inferSelect;
export type Mine = typeof mines.$inferSelect;
export type Resource = typeof resources.$inferSelect;
export type MineResource = typeof minesResources.$inferSelect;
export type TeamMine = typeof teamsMines.$inferSelect;
