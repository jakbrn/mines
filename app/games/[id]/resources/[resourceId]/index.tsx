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
import { games, resources, teams } from "~/db/schema";
import { useDrizzle } from "~/hooks/drizzle";

export default function GameResourceScreen() {
  const { id, resourceId } = useLocalSearchParams<{
    id: string;
    resourceId: string;
  }>();
  const db = useDrizzle();
  const { data } = useLiveQuery(
    db.query.resources.findFirst({
      where: eq(teams.id, Number(resourceId)),
    })
  );
  const [name, setName] = React.useState("");
  const [editDialogVisible, setEditDialogVisible] = React.useState(false);

  React.useEffect(() => {
    if (data) {
      setName(data.name);
    }
  }, [data]);

  const deleteResource = () => {
    if (!resourceId) return;
    db.delete(resources)
      .where(eq(resources.id, Number(resourceId)))
      .then(() => {
        router.back();
      });
  };

  const updateResourceName = async () => {
    if (!resourceId || !name.trim()) return;
    await db
      .update(resources)
      .set({ name: name.trim() })
      .where(eq(resources.id, Number(resourceId)));
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
            <DialogDescription>Podaj nową nazwę dla tego zasobu</DialogDescription>
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
              await updateResourceName();
              setEditDialogVisible(false);
            }}
            onChangeText={(text) => setName(text)}
            value={name}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button onPress={() => updateResourceName()} className="w-full">
                <Text>Zapisz</Text>
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Button variant="destructive" className="w-full mt-auto mb-safe" onPress={() => deleteResource()}>
        <Text className="text-sm font-semibold">Usuń zasób</Text>
      </Button>
    </View>
  );
}
