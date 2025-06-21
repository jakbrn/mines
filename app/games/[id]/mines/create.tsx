import { router, Stack, useLocalSearchParams } from "expo-router";
import { ChevronLeftIcon } from "lucide-nativewind";
import { useState } from "react";
import { SafeAreaView, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { mines } from "~/db/schema";
import { useDrizzle } from "~/hooks/drizzle";

export default function CreateMineScreen() {
  const db = useDrizzle();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [name, setName] = useState("");

  const createMine = () => {
    if (!name.trim()) {
      return;
    }
    db.insert(mines)
      .values({
        name: name.trim(),
        game: Number(id),
      })
      .then(() => {
        router.back();
      });
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
                <Text className="text-2xl font-semibold flex-1">Nowa kopalnia</Text>
              </View>
            </SafeAreaView>
          ),
        }}
      />
      <Input
        className="w-full mb-4"
        placeholder="Wpisz nazwę kopalni"
        autoCapitalize="words"
        autoCorrect={false}
        autoFocus
        returnKeyType="done"
        value={name}
        onChangeText={setName}
        onSubmitEditing={() => createMine()}
      />
      <Button className="w-full" onPress={() => createMine()}>
        <Text>Utwórz kopalnie</Text>
      </Button>
    </View>
  );
}
