import { drizzle } from "drizzle-orm/expo-sqlite/driver";
import { useSQLiteContext } from "expo-sqlite";
import * as schema from "../db/schema";

export const useDrizzle = () => {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });
  return drizzleDb;
};
