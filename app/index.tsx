import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Link, router, Stack } from "expo-router";
import { PickaxeIcon, PlusIcon } from "lucide-nativewind";
import * as React from "react";
import { SafeAreaView, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { games } from "~/db/schema";
import { useDrizzle } from "~/hooks/drizzle";

export default function GamesScreen() {
  const db = useDrizzle();
  const { data } = useLiveQuery(db.select().from(games).orderBy(games.created_at));

  return (
    <View className="flex-1 items-center gap-4 p-4">
      <Stack.Screen
        options={{
          header: () => (
            <SafeAreaView>
              <View className="flex-row items-center gap-2 px-4">
                <PickaxeIcon size={20} className="text-primary ml-1" />
                <Text className="text-2xl font-semibold flex-1">Kopalnie</Text>
                <Button onPress={() => router.push("/create")} variant="ghost" size="icon">
                  <PlusIcon size={24} className="text-primary" />
                </Button>
              </View>
            </SafeAreaView>
          ),
        }}
      />
      {data.length === 0 && (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">Brak gier. Stwórz nową grę, aby rozpocząć.</Text>
        </View>
      )}
      {data.map((game) => (
        <Link key={game.id} href={`/games/${game.id}`} className="w-full">
          <View className="bg-secondary p-4 rounded-lg shadow-md w-full">
            <Text className="text-lg font-semibold">{game.name}</Text>
            <Text className="text-sm text-gray-500">
              Utworzona: {new Date(game.created_at).toLocaleDateString("pl-PL")}
            </Text>
          </View>
        </Link>
      ))}
    </View>
  );
}
