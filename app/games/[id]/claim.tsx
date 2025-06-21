import { router, Stack, useLocalSearchParams } from "expo-router";
import { ChevronLeftIcon } from "lucide-nativewind";
import { useState } from "react";
import { SafeAreaView, View } from "react-native";
import { Button } from "~/components/ui/button";
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
import { teamsMines } from "~/db/schema";
import { useDrizzle } from "~/hooks/drizzle";
import { useMines } from "~/hooks/mines";
import { useTeams } from "~/hooks/teams";

export default function ClaimScreen() {
  const db = useDrizzle();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: teams } = useTeams(Number(id));
  const { data: mines } = useMines(Number(id));
  const [team, setTeam] = useState<Option>();
  const [mine, setMine] = useState<Option>();

  const claim = () => {
    if (!team || !mine) {
      return;
    }
    db.insert(teamsMines)
      .values({
        team: Number(team.value),
        mine: Number(mine.value),
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
                <Text className="text-2xl font-semibold flex-1">Przejmowanie</Text>
              </View>
            </SafeAreaView>
          ),
        }}
      />
      <Text className="w-full mx-2">Drużyna</Text>
      <Select value={team} onValueChange={(value) => setTeam(value)}>
        <SelectTrigger className="w-full mb-2">
          <SelectValue className="text-foreground text-sm native:text-lg" placeholder="Wybierz drużyne" />
        </SelectTrigger>
        <SelectContent className="w-[250px]">
          <SelectGroup>
            {teams.map((team) => (
              <SelectItem key={team.id} label={team.name} value={team.id.toString()} className="text-sm native:text-lg">
                {team.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Text className="w-full mx-2">Kopalnia</Text>
      <Select value={mine} onValueChange={(value) => setMine(value)}>
        <SelectTrigger className="w-full mb-2">
          <SelectValue className="text-foreground text-sm native:text-lg" placeholder="Wybierz kopalnie" />
        </SelectTrigger>
        <SelectContent className="w-[250px]">
          <SelectGroup>
            {mines.map((mine) => (
              <SelectItem key={mine.id} label={mine.name} value={mine.id.toString()} className="text-sm native:text-lg">
                {mine.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button className="w-full" onPress={() => claim()}>
        <Text>Przemij</Text>
      </Button>
    </View>
  );
}
