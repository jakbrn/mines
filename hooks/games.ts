import { games, gamesSessions } from "~/db/schema";
import { useDrizzle } from "./drizzle";
import { and, eq, isNull } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

export const useGame = (gameId: number) => {
  const db = useDrizzle();
  return useLiveQuery(
    db.query.games.findFirst({
      where: eq(games.id, gameId),
    }),
    [gameId]
  );
};

export const useGameActiveSession = (gameId: number) => {
  const db = useDrizzle();
  return useLiveQuery(
    db.query.gamesSessions.findFirst({
      where: and(eq(gamesSessions.game, gameId), isNull(gamesSessions.ended_at)),
    }),
    [gameId]
  );
};
