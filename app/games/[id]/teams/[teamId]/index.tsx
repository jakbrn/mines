import { eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Link, router, Stack, useLocalSearchParams } from "expo-router";
import { ChevronLeftIcon, ChevronRightIcon, PenIcon } from "lucide-nativewind";
import { Cuboid, Pickaxe, Users } from "lucide-react-native";
import * as React from "react";
import { SafeAreaView, View } from "react-native";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { games, teams } from "~/db/schema";
import { useDrizzle } from "~/hooks/drizzle";
import { useTeamMines } from "~/hooks/mines";

export default function GameTeamScreen() {
  const { id, teamId } = useLocalSearchParams<{
    id: string;
    teamId: string;
  }>();
  const db = useDrizzle();
  const { data } = useLiveQuery(
    db.query.teams.findFirst({
      where: eq(teams.id, Number(teamId)),
    })
  );
  const [name, setName] = React.useState("");
  const [editDialogVisible, setEditDialogVisible] = React.useState(false);

  React.useEffect(() => {
    if (data) {
      setName(data.name);
    }
  }, [data]);

  const deleteTeam = () => {
    if (!teamId) return;
    db.delete(teams)
      .where(eq(teams.id, Number(teamId)))
      .then(() => {
        router.back();
      });
  };

  const updateTeamName = async () => {
    if (!teamId || !name.trim()) return;
    await db
      .update(teams)
      .set({ name: name.trim() })
      .where(eq(teams.id, Number(teamId)));
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
                <Text className="text-2xl font-semibold flex-1">{data?.name}</Text>
              </View>
            </SafeAreaView>
          ),
        }}
      />
      <Dialog
        className="w-full"
        open={editDialogVisible}
        onOpenChange={(open) => {
          setEditDialogVisible(open);
          if (!open) {
            setName(data?.name || "");
          }
        }}
      >
        <DialogTrigger>
          <View className="bg-secondary p-4 px-5 rounded-lg shadow-md w-full flex-row items-center gap-4">
            <PenIcon size={18} className="text-primary" />
            <Text className="text-lg font-semibold">Zmień nazwę</Text>
          </View>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] w-[90vw]">
          <DialogHeader>
            <DialogTitle>Zmiana nazwy</DialogTitle>
            <DialogDescription>Podaj nową nazwę dla tej drużyny</DialogDescription>
          </DialogHeader>
          <Input
            className="w-full mb-4"
            placeholder="Wpisz nazwę drużyny"
            autoCapitalize="words"
            autoCorrect={false}
            autoFocus
            returnKeyType="done"
            defaultValue={data?.name}
            onSubmitEditing={async () => {
              await updateTeamName();
              setEditDialogVisible(false);
            }}
            onChangeText={(text) => setName(text)}
            value={name}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button onPress={() => updateTeamName()} className="w-full">
                <Text>Zapisz</Text>
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Button variant="destructive" className="w-full mt-auto mb-safe" onPress={() => deleteTeam()}>
        <Text className="text-sm font-semibold">Usuń drużynę</Text>
      </Button>
    </View>
  );
}
