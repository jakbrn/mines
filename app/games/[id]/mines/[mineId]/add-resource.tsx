import { router, Stack, useLocalSearchParams } from "expo-router";
import { ChevronLeftIcon } from "lucide-nativewind";
import { useState } from "react";
import { SafeAreaView, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Option,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Text } from "~/components/ui/text";
import { games, mines, minesResources, resources, teams } from "~/db/schema";
import { useDrizzle } from "~/hooks/drizzle";
import { useGameResources, useMineResources } from "~/hooks/resources";

export default function AddMineResourceScreen() {
  const db = useDrizzle();
  const { id, mineId } = useLocalSearchParams<{ id: string; mineId: string }>();
  const { data: resources } = useGameResources(Number(id));
  const { data: mineResources } = useMineResources(Number(mineId));
  const [resource, setResource] = useState<Option>();
  const [frequency, setFrequency] = useState("1");
  const [amount, setAmount] = useState("1");

  const createMine = () => {
    if (!resource || !frequency || !amount) {
      return;
    }
    db.insert(minesResources)
      .values({
        mine: Number(mineId),
        resource: Number(resource.value),
        interval: Number(frequency) * 60 * 1000,
        amount: Number(amount),
      })
      .then(() => {
        router.back();
      });
  };

  return (
    <View className="flex-1 items-center p-4 gap-2">
      <Stack.Screen
        options={{
          header: () => (
            <SafeAreaView>
              <View className="flex-row items-center gap-2 px-4">
                <Button variant="ghost" size="icon" onPress={() => router.back()}>
                  <ChevronLeftIcon size={24} className="text-primary" />
                </Button>
                <Text className="text-2xl font-semibold flex-1">Dodaj zasób</Text>
              </View>
            </SafeAreaView>
          ),
        }}
      />
      <Select value={resource} onValueChange={(value) => setResource(value)}>
        <SelectTrigger className="w-full mb-2">
          <SelectValue className="text-foreground text-sm native:text-lg" placeholder="Wybierz zasób" />
        </SelectTrigger>
        <SelectContent className="w-[250px]">
          <SelectGroup>
            {resources
              ?.filter((resource) => !mineResources?.some((mr) => mr.resource === resource.id))
              .map((resource) => (
                <SelectItem
                  key={resource.id}
                  label={resource.name}
                  value={resource.id.toString()}
                  className="text-sm native:text-lg"
                >
                  {resource.name}
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Text className="w-full mx-2">Częstotliwość wydobycia: (w minutach)</Text>
      <Input
        className="w-full mb-2"
        placeholder="Wpisz częstotliwość wydobycia"
        keyboardType="numeric"
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus
        returnKeyType="done"
        value={frequency}
        onChangeText={setFrequency}
      />

      <Text className="w-full mx-2">Ilość wydobywanego zasobu:</Text>
      <Input
        className="w-full mb-4"
        placeholder="Wpisz ilość wydobywanego zasobu"
        keyboardType="numeric"
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus
        returnKeyType="done"
        value={amount}
        onChangeText={setAmount}
      />
      <Button className="w-full" onPress={() => createMine()}>
        <Text>Dodaj zasób</Text>
      </Button>
    </View>
  );
}
