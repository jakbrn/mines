import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useDrizzle } from "./drizzle";
import { mines, teams, teamsMines } from "~/db/schema";
import { and, desc, eq, max } from "drizzle-orm";

export const useMines = (gameId: number) => {
  const db = useDrizzle();
  return useLiveQuery(
    db.query.mines.findMany({
      where: eq(mines.game, gameId),
    })
  );
};

export const useMine = (mineId: number) => {
  const db = useDrizzle();
  return useLiveQuery(
    db.query.mines.findFirst({
      where: eq(mines.id, mineId),
    })
  );
};

export const useTeamMines = (teamId: number) => {
  const db = useDrizzle();

  const subquery = db
    .select({ mine: teamsMines.mine, latest: max(teamsMines.claimed_at).as("latest") })
    .from(teamsMines)
    .groupBy(teamsMines.mine)
    .as("latest");

  return useLiveQuery(
    db
      .select()
      .from(teamsMines)
      .innerJoin(subquery, and(eq(teamsMines.mine, subquery.mine), eq(teamsMines.claimed_at, subquery.latest)))
      .innerJoin(mines, eq(teamsMines.mine, mines.id))
      .where(eq(teamsMines.team, teamId))
  );
};

export const useMineOwner = (mineId: number) => {
  const db = useDrizzle();

  return useLiveQuery(
    db.query.teamsMines.findFirst({
      where: eq(teamsMines.mine, mineId),
      orderBy: desc(teamsMines.claimed_at),
      with: {
        teamm: true,
      },
    })
  );
};
