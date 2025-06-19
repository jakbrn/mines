import { Mine, Team } from "~/db/schema";
import { useMineOwner } from "~/hooks/mines";
import { Text } from "./ui/text";
import { View } from "react-native";

export default function GameMineComponent({ mine }: { mine: Mine }) {
  const { data: mineOwner } = useMineOwner(mine.id);

  return (
    <View className="bg-secondary p-4 rounded-lg shadow-md w-full">
      <Text className="text-lg font-semibold">{mine.name}</Text>
      {mineOwner ? (
        <Text className="font-semibold">
          {mineOwner?.teamm.name}{" "}
          <Text className="text-gray-500">
            od{" "}
            {new Date(mineOwner.claimed_at).toLocaleTimeString("pl-PL", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </Text>
      ) : (
        <Text className="text-gray-500">Brak właściciela</Text>
      )}
    </View>
  );
}
