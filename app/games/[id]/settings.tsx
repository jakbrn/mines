import { eq } from "drizzle-orm";
import { Link, router, Stack, useLocalSearchParams } from "expo-router";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-nativewind";
import { Cuboid, Pickaxe, Users } from "lucide-react-native";
import * as React from "react";
import { SafeAreaView, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { games } from "~/db/schema";
import { useDrizzle } from "~/hooks/drizzle";

export default function GameSettingsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const db = useDrizzle();

  const deleteGame = () => {
    if (!id) return;
    db.delete(games)
      .where(eq(games.id, Number(id)))
      .then(() => {
        router.dismissTo("/");
      });
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
                <Text className="text-2xl font-semibold flex-1">Ustawienia</Text>
              </View>
            </SafeAreaView>
          ),
        }}
      />
      <Link href={`/games/${id}/teams`} className="w-full">
        <View className="bg-secondary p-4 px-5 rounded-lg shadow-md w-full flex-row items-center gap-4">
          <Users size={18} color="lightblue" />
          <Text className="text-lg font-semibold">Drużyny</Text>
          <ChevronRightIcon size={18} className="text-gray-500 ml-auto" />
        </View>
      </Link>
      <Link href={`/games/${id}/mines`} className="w-full">
        <View className="bg-secondary p-4 px-5 rounded-lg shadow-md w-full flex-row items-center gap-4">
          <Pickaxe size={18} color="orange" />
          <Text className="text-lg font-semibold">Kopalnie</Text>
          <ChevronRightIcon size={18} className="text-gray-500 ml-auto" />
        </View>
      </Link>
      <Link href={`/games/${id}/resources`} className="w-full">
        <View className="bg-secondary p-4 px-5 rounded-lg shadow-md w-full flex-row items-center gap-4">
          <Cuboid size={18} color="brown" />
          <Text className="text-lg font-semibold">Zasoby</Text>
          <ChevronRightIcon size={18} className="text-gray-500 ml-auto" />
        </View>
      </Link>
      <Button variant="destructive" className="w-full mt-auto mb-safe" onPress={() => deleteGame()}>
        <Text className="text-sm font-semibold">Usuń grę</Text>
      </Button>
    </View>
  );
}
