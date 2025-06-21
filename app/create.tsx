import { router, Stack } from "expo-router";
import { ChevronLeftIcon } from "lucide-nativewind";
import { useState } from "react";
import { SafeAreaView, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { games } from "~/db/schema";
import { useDrizzle } from "~/hooks/drizzle";

export default function CreateGameScreen() {
  const db = useDrizzle();
  const [name, setName] = useState("");

  const createGame = async () => {
    if (!name.trim()) {
      return;
    }
    await db.insert(games).values({
      name: name.trim(),
    });
    router.dismissTo("/");
  };

  return (
    <View className="flex-1 items-center p-4">
      <Stack.Screen
        options={{
          header: () => (
            <SafeAreaView>
              <View className="flex-row items-center gap-2 px-4">
                <Button variant="ghost" size="icon" onPress={() => router.back()}>
                  <ChevronLeftIcon size={24} className="text-primary" />
                </Button>
                <Text className="text-2xl font-semibold flex-1">Nowa gra</Text>
              </View>
            </SafeAreaView>
          ),
        }}
      />
      <Input
        className="w-full mb-4"
        placeholder="Wpisz nazwę gry"
        autoCapitalize="words"
        autoCorrect={false}
        autoFocus
        returnKeyType="done"
        value={name}
        onChangeText={setName}
        onSubmitEditing={() => createGame()}
      />
      <Button className="w-full" onPress={() => createGame()}>
        <Text>Utwórz grę</Text>
      </Button>
    </View>
  );
}
