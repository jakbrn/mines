import { and, eq, isNull } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Link, router, Stack, useLocalSearchParams } from "expo-router";
import { ChevronLeftIcon, SettingsIcon } from "lucide-nativewind";
import { Cuboid, Pause, Pickaxe, Play, Settings, Users } from "lucide-react-native";
import * as React from "react";
import { ActivityIndicator, SafeAreaView, View } from "react-native";
import GameMineComponent from "~/components/GameMine";
import GameTeamComponent from "~/components/GameTeam";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
import { games, gamesSessions } from "~/db/schema";
import { useDrizzle } from "~/hooks/drizzle";
import { useGame, useGameActiveSession } from "~/hooks/games";
import { useMines } from "~/hooks/mines";
import { useTeamsResources } from "~/hooks/teamsResources";

export default function GamesScreen() {
  const db = useDrizzle();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data } = useGame(Number(id));
  const { data: session } = useGameActiveSession(Number(id));
  const { data: mines } = useMines(Number(id));
  const teamsResources = useTeamsResources(Number(id));
  const [activeTab, setActiveTab] = React.useState("teams");

  const startSession = async () => {
    if (session) return;
    await db.insert(gamesSessions).values({
      game: Number(id),
    });
  };

  const stopSession = async () => {
    if (!session) return;
    await db.update(gamesSessions).set({ ended_at: new Date().toISOString() }).where(eq(gamesSessions.id, session.id));
  };

  return (
    <View className="flex-1 items-center gap-4 p-4">
      <Stack.Screen
        options={{
          header: () => (
            <SafeAreaView>
              <View className="flex-row items-center gap-2 px-4">
                <Button variant="ghost" size="icon" onPress={() => router.back()}>
                  <ChevronLeftIcon size={24} className="text-primary" />
                </Button>
                <Text className="text-2xl font-semibold flex-1 text-center">{data?.name}</Text>
                <Button variant="ghost" size="icon" onPress={() => router.push(`/games/${id}/settings`)}>
                  <SettingsIcon size={24} className="text-primary" />
                </Button>
              </View>
            </SafeAreaView>
          ),
        }}
      />
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1">
        <TabsList className="flex-row w-full mb-4">
          <TabsTrigger value="teams" className="flex-1">
            <Text>Drużyny</Text>
          </TabsTrigger>
          <TabsTrigger value="mines" className="flex-1">
            <Text>Kopalnie</Text>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="teams" className="gap-4">
          {teamsResources
            .sort(
              (a, b) =>
                b.resources.reduce((acc, resource) => acc + resource.amount, 0) -
                a.resources.reduce((acc, resource) => acc + resource.amount, 0)
            )
            .map((e) => (
              <GameTeamComponent key={e.team.id} team={e.team} />
            ))}
        </TabsContent>
        <TabsContent value="mines" className="gap-4">
          {mines.map((mine) => (
            <GameMineComponent key={mine.id} mine={mine} />
          ))}
        </TabsContent>
      </Tabs>
      <View className="w-full flex-row items-center justify-between gap-4">
        {session ? (
          <Button className="bg-red-600 flex-1 flex-row items-center gap-1" onPress={() => stopSession()}>
            <Text className="text-white font-semibold">Stop</Text>
          </Button>
        ) : (
          <Button className="bg-green-600 flex-1 flex-row items-center gap-1" onPress={() => startSession()}>
            <Text className="text-white font-semibold">Start</Text>
          </Button>
        )}
      </View>
      <Button onPress={() => router.push(`/games/${id}/claim`)} className="w-full">
        <Text className="text-forground font-semibold">Przejmij</Text>
      </Button>
      <SafeAreaView />
    </View>
  );
}
