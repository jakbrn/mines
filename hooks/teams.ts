import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useDrizzle } from "./drizzle";
import { eq } from "drizzle-orm";
import { teams } from "~/db/schema";

export const useTeams = (gameId: number) => {
  const db = useDrizzle();
  return useLiveQuery(
    db.query.teams.findMany({
      where: eq(teams.game, gameId),
    })
  );
};

export const useTeam = (teamId: number) => {
  const db = useDrizzle();
  return useLiveQuery(
    db.query.teams.findFirst({
      where: eq(teams.id, teamId),
    })
  );
};
