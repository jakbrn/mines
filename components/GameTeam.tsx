import { View } from "react-native";
import { Team } from "~/db/schema";
import { Text } from "./ui/text";
import { CuboidIcon, PickaxeIcon } from "lucide-nativewind";
import { useTeamResources } from "~/hooks/teamsResources";
import { useTeamMines } from "~/hooks/mines";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";

export default function GameTeamComponent({ team }: { team: Team }) {
  const resources = useTeamResources(team.id);
  const { data: mines } = useTeamMines(team.id);

  return (
    <Dialog>
      <DialogTrigger>
        <View className="bg-secondary p-4 rounded-lg shadow-md w-full justify-between gap-1">
          <Text className="text-lg font-semibold">{team.name}</Text>
          <View className="flex-row items-center gap-2">
            <CuboidIcon size={14} className="text-primary" />
            <Text className="text-primary">{resources.reduce((acc, resource) => acc + resource.amount, 0)}</Text>
            <PickaxeIcon size={14} color="orange" className="ml-1" />
            <Text className="text-primary">{mines.length}</Text>
          </View>
        </View>
      </DialogTrigger>
      <DialogContent className="w-[80vw] sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{team.name}</DialogTitle>
        </DialogHeader>
        <View className="">
          <Text className="text-primary font-semibold mb-1">Zasoby:</Text>
          {resources.length === 0 ? (
            <Text className="text-gray-500">Brak zasobów</Text>
          ) : (
            resources.map((r) => (
              <View key={r.resource.id} className="flex-row items-center justify-between mb-2">
                <Text className="">{r.resource.name}</Text>
                <Text className="text-primary">{r.amount}</Text>
              </View>
            ))
          )}
        </View>
        <View className="mb-2">
          <Text className="text-primary font-semibold mb-1">Kopalnie:</Text>
          {mines.length === 0 ? (
            <Text className="text-gray-500">Brak kopalni</Text>
          ) : (
            mines.map((m) => (
              <View key={m.mines.id} className="flex-row items-center justify-between mb-2">
                <Text className="">{m.mines.name}</Text>
              </View>
            ))
          )}
        </View>

        <DialogFooter>
          <DialogClose asChild>
            <Button>
              <Text>OK</Text>
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
