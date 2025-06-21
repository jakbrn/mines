import { eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Link, router, Stack, useLocalSearchParams } from "expo-router";
import { ChevronLeftIcon, PlusIcon } from "lucide-nativewind";
import * as React from "react";
import { SafeAreaView, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { resources } from "~/db/schema";
import { useDrizzle } from "~/hooks/drizzle";

export default function GameTeamsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const db = useDrizzle();

  const { data } = useLiveQuery(
    db
      .select()
      .from(resources)
      .where(eq(resources.game, Number(id))),
    [id]
  );

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
                <Text className="text-2xl font-semibold flex-1">Zasoby</Text>
                <Button onPress={() => router.push(`/games/${id}/resources/create`)} variant="ghost" size="icon">
                  <PlusIcon size={24} className="text-primary" />
                </Button>
              </View>
            </SafeAreaView>
          ),
        }}
      />
      {data.length === 0 && (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">Brak zasobów. Stwórz nowy zasób, aby rozpocząć.</Text>
        </View>
      )}
      {data.map((resource) => (
        <Link key={resource.id} href={`/games/${id}/resources/${resource.id}`} className="w-full">
          <View className="bg-secondary p-4 px-5 rounded-lg shadow-md w-full flex-row items-center gap-4 justify-between">
            <Text className="text-lg font-semibold">{resource.name}</Text>
          </View>
        </Link>
      ))}
    </View>
  );
}
