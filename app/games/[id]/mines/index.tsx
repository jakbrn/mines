import { eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Link, router, Stack, useLocalSearchParams } from "expo-router";
import { ChevronLeftIcon, PlusIcon } from "lucide-nativewind";
import { Ellipsis, Pen, Trash } from "lucide-react-native";
import * as React from "react";
import { SafeAreaView, View } from "react-native";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Text } from "~/components/ui/text";
import { mines } from "~/db/schema";
import { useDrizzle } from "~/hooks/drizzle";

export default function GameMinesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const db = useDrizzle();

  const { data } = useLiveQuery(
    db
      .select()
      .from(mines)
      .where(eq(mines.game, Number(id))),
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
                <Text className="text-2xl font-semibold flex-1">Kopalnie</Text>
                <Button onPress={() => router.push(`/games/${id}/mines/create`)} variant="ghost" size="icon">
                  <PlusIcon size={24} className="text-primary" />
                </Button>
              </View>
            </SafeAreaView>
          ),
        }}
      />
      {data.length === 0 && (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">Brak kopalni. Stwórz nową kopalnie, aby rozpocząć.</Text>
        </View>
      )}
      {data.map((mine) => (
        <Link key={mine.id} href={`/games/${id}/mines/${mine.id}`} className="w-full">
          <View className="bg-secondary p-4 px-5 rounded-lg shadow-md w-full flex-row items-center gap-4 justify-between">
            <Text className="text-lg font-semibold">{mine.name}</Text>
          </View>
        </Link>
      ))}
    </View>
  );
}
