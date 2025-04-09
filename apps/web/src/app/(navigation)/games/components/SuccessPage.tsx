import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ClearLocalStorage from "../new-game/component/ClearLocalStorage";
import { PlayerGameForClient } from "../edit-game/types";
import SuccessPageHeader from "./SuccessPageHeader";

type SuccessPageProps = {
  gameId: string;
  playerGames: PlayerGameForClient[];
};

export default async function SuccessPage({
  gameId,
  playerGames,
}: SuccessPageProps) {
  return (
    <div>
      <ClearLocalStorage />
      <SuccessPageHeader gameId={gameId} />

      <Table className=" mt-28">
        <TableHeader>
          <TableRow>
            <TableHead>Player</TableHead>
            <TableHead>Buy Ins</TableHead>
            <TableHead>Gains</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {playerGames.map((games, index) => (
            <TableRow key={index}>
              <TableCell>
                <p>{games.player.name}</p>
              </TableCell>
              <TableCell>
                <p>{+games.buyIns}</p>
              </TableCell>
              <TableCell>
                <p>{+games.gains}</p>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
