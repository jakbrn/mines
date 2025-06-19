import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useDrizzle } from "./drizzle";
import { and, eq, gt, inArray, lte } from "drizzle-orm";
import { useEffect, useMemo, useState } from "react";
import { games, gamesSessions, minesResources, Resource, resources, teams, teamsMines } from "~/db/schema";

export const useGameResources = (gameId: number) => {
  const db = useDrizzle();
  return useLiveQuery(
    db.query.resources.findMany({
      where: eq(resources.game, gameId),
    })
  );
};

export const useMineResources = (mineId: number) => {
  const db = useDrizzle();
  return useLiveQuery(
    db.query.minesResources.findMany({
      where: eq(minesResources.mine, mineId),
      with: {
        resourcee: true,
      },
    })
  );
};

export const useMineResource = (mineResourceId: number) => {
  const db = useDrizzle();
  return useLiveQuery(
    db.query.minesResources.findFirst({
      where: eq(minesResources.id, mineResourceId),
      with: {
        resourcee: true,
      },
    })
  );
};
