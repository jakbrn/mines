import { eq } from "drizzle-orm";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { ChevronLeftIcon } from "lucide-nativewind";
import { useEffect, useState } from "react";
import { SafeAreaView, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { minesResources } from "~/db/schema";
import { useDrizzle } from "~/hooks/drizzle";
import { useMineResource } from "~/hooks/resources";

export default function EditMineResourceScreen() {
  const db = useDrizzle();
  const { resourceId } = useLocalSearchParams<{ id: string; mineId: string; resourceId: string }>();
  const [frequency, setFrequency] = useState("");
  const [amount, setAmount] = useState("");
  const { data } = useMineResource(Number(resourceId));

  useEffect(() => {
    if (data) {
      setFrequency((data.interval / 60 / 1000).toString());
      setAmount(data.amount.toString());
    }
  }, [data]);

  const updateMineResource = async () => {
    if (!resourceId || !frequency || !amount) {
      return;
    }
    await db
      .update(minesResources)
      .set({
        interval: Number(frequency) * 60 * 1000,
        amount: Number(amount),
      })
      .where(eq(minesResources.id, Number(resourceId)))
      .then(() => {
        router.back();
      });
  };

  const deleteMineResource = () => {
    if (!resourceId) return;
    db.delete(minesResources)
      .where(eq(minesResources.id, Number(resourceId)))
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
                <Text className="text-2xl font-semibold flex-1">{data?.resourcee.name}</Text>
              </View>
            </SafeAreaView>
          ),
        }}
      />
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
      <Button className="w-full" onPress={() => updateMineResource()}>
        <Text>Zapisz</Text>
      </Button>
      <Button variant="destructive" className="w-full mt-auto mb-safe" onPress={() => deleteMineResource()}>
        <Text className="text-sm font-semibold">Usuń zasób</Text>
      </Button>
    </View>
  );
}
