import { eq, inArray } from "drizzle-orm";
import { useEffect, useMemo, useState } from "react";
import { Game, games, GameSession, Mine, Resource, Team, teams, teamsMines } from "~/db/schema";
import { useDrizzle } from "./drizzle";

const getTeamResources = async (
  db: ReturnType<typeof useDrizzle>,
  gameData: Game & {
    teams: Team[];
    sessions: GameSession[];
  },
  teamId: number
) => {
  const newResources: Record<number, { amount: number; resource: Resource }> = {};

  const teamsMinesData = await db.query.teamsMines.findMany({
    where: inArray(
      teamsMines.team,
      gameData.teams.map((t) => t.id)
    ),
    with: {
      minee: {
        with: {
          resources: {
            with: {
              resourcee: true,
            },
          },
        },
      },
    },
  });

  if (!teamsMinesData) return;

  const teamMines = teamsMinesData.filter((tm) => tm.team === teamId);

  for (const mine of teamMines) {
    const mineId = mine.mine;
    const claimed_at = new Date(mine.claimed_at).getTime();

    // Find when this mine was claimed by another team after this claim
    const nextMine = teamsMinesData
      .map((m) => ({ ...m, claimed_at: new Date(m.claimed_at).getTime() }))
      .filter((m) => m.mine === mineId && m.claimed_at > claimed_at)
      .sort((a, b) => a.claimed_at - b.claimed_at)[0];
    const mineEnd = nextMine ? nextMine.claimed_at : undefined;

    // For each session, calculate overlap with claim
    for (const session of gameData.sessions) {
      const sessionStart = new Date(session.started_at).getTime();
      const sessionEnd = session.ended_at ? new Date(session.ended_at).getTime() : Date.now();
      const overlapStart = Math.max(sessionStart, claimed_at);
      const overlapEnd = mineEnd ? Math.min(sessionEnd, mineEnd) : sessionEnd;
      if (overlapEnd > overlapStart) {
        for (const mineResource of mine.minee.resources) {
          const interval = mineResource.interval; // ms per resource
          const resourceId = mineResource.resourcee.id;
          const resource = mineResource.resourcee;
          const duration = overlapEnd - overlapStart;
          const amount = Math.floor(duration / interval);
          if (!newResources[resourceId]) {
            newResources[resourceId] = { amount: 0, resource };
          }
          newResources[resourceId].amount += amount * mineResource.amount;
        }
      }
    }
  }

  return Object.values(newResources);
};

export const useTeamResources = (teamId: number) => {
  const db = useDrizzle();
  const [resources, setResources] = useState<{ amount: number; resource: Resource }[]>([]);

  const updateTeamResources = async () => {
    const teamData = await db.query.teams.findFirst({
      where: eq(teams.id, teamId),
    });

    if (!teamData) return;

    const gameData = await db.query.games.findFirst({
      where: eq(games.id, teamData.game),
      with: {
        sessions: true,
        teams: true,
      },
    });

    if (!gameData) return;

    const resourcesData = await getTeamResources(db, gameData, teamId);

    if (!resourcesData) return;

    setResources(Object.values(resourcesData));
  };

  useEffect(() => {
    updateTeamResources();
    const interval = setInterval(() => {
      updateTeamResources();
    }, 1000 * 10); // Update every minute

    return () => clearInterval(interval);
  }, [teamId]);

  return useMemo(() => resources, [resources]);
};

export const useTeamsResources = (gameId: number) => {
  const db = useDrizzle();
  const [teamsResources, setTeamsResources] = useState<
    { team: Team; resources: { amount: number; resource: Resource }[] }[]
  >([]);

  const updateTeamsResources = async () => {
    const gameData = await db.query.games.findFirst({
      where: eq(games.id, gameId),
      with: {
        teams: true,
        sessions: true,
      },
    });

    if (!gameData) return;

    const newTeamsResources: Record<number, { team: Team; resources: { amount: number; resource: Resource }[] }> = {};

    for (const team of gameData.teams) {
      const resourcesData = await getTeamResources(db, gameData, team.id);
      if (resourcesData) {
        newTeamsResources[team.id] = {
          team,
          resources: resourcesData,
        };
      }
    }

    setTeamsResources(Object.values(newTeamsResources));
  };

  useEffect(() => {
    updateTeamsResources();
    const interval = setInterval(() => {
      updateTeamsResources();
    }, 1000 * 10); // Update every minute

    return () => clearInterval(interval);
  }, [gameId]);

  return useMemo(() => teamsResources, [teamsResources]);
};
