import { eq } from "drizzle-orm";
import { Link, router, Stack, useLocalSearchParams } from "expo-router";
import { ChevronLeftIcon, ClockIcon, CuboidIcon, PenIcon, PlusIcon } from "lucide-nativewind";
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
import { mines } from "~/db/schema";
import { useDrizzle } from "~/hooks/drizzle";
import { useMine } from "~/hooks/mines";
import { useMineResources } from "~/hooks/resources";

export default function GameMineScreen() {
  const { id, mineId } = useLocalSearchParams<{
    id: string;
    mineId: string;
  }>();
  const db = useDrizzle();
  const { data } = useMine(Number(mineId));
  const { data: mineResources } = useMineResources(Number(mineId));
  const [name, setName] = React.useState("");
  const [editDialogVisible, setEditDialogVisible] = React.useState(false);

  React.useEffect(() => {
    if (data) {
      setName(data.name);
    }
  }, [data]);

  const deleteMine = () => {
    if (!mineId) return;
    db.delete(mines)
      .where(eq(mines.id, Number(mineId)))
      .then(() => {
        router.back();
      });
  };

  const updateMineName = async () => {
    if (!mineId || !name.trim()) return;
    await db
      .update(mines)
      .set({ name: name.trim() })
      .where(eq(mines.id, Number(mineId)));
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
            <DialogDescription>Podaj nową nazwę dla tej kopalni</DialogDescription>
          </DialogHeader>
          <Input
            className="w-full mb-4"
            placeholder="Wpisz nazwę kopalni"
            autoCapitalize="words"
            autoCorrect={false}
            autoFocus
            returnKeyType="done"
            defaultValue={data?.name}
            onSubmitEditing={async () => {
              await updateMineName();
              setEditDialogVisible(false);
            }}
            onChangeText={(text) => setName(text)}
            value={name}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button onPress={() => updateMineName()} className="w-full">
                <Text>Zapisz</Text>
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <View className="flex-row p-1 border-b border-border w-full items-center justify-between">
        <Text className="text-lg font-semibold">Zasoby</Text>
        <Button onPress={() => router.push(`/games/${id}/mines/${mineId}/add-resource`)} variant="ghost" size="icon">
          <PlusIcon size={24} className="text-primary" />
        </Button>
      </View>
      {mineResources.length === 0 && (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500 text-center">
            Brak zasobów w tej kopalni. Dodaj nowy zasób, aby rozpocząć.
          </Text>
        </View>
      )}
      {mineResources.map((resource) => (
        <Link key={resource.id} href={`/games/${id}/mines/${mineId}/resources/${resource.id}`} className="w-full">
          <View
            key={resource.id}
            className="bg-secondary p-4 px-5 rounded-lg shadow-md w-full items-center gap-2 justify-between"
          >
            <Text className="text-lg font-semibold w-full">{resource.resourcee.name}</Text>
            <View className="flex-row w-full gap-2">
              <ClockIcon size={18} className="text-primary" />
              <Text className="text-sm font-semibold mr-2">{Math.round(resource.interval / (60 * 1000))} min</Text>
              <CuboidIcon size={18} className="text-primary" />
              <Text className="text-sm font-semibold">{resource.amount}</Text>
            </View>
          </View>
        </Link>
      ))}
      <Button variant="destructive" className="w-full mt-auto mb-safe" onPress={() => deleteMine()}>
        <Text className="text-sm font-semibold">Usuń kopalnie</Text>
      </Button>
    </View>
  );
}
