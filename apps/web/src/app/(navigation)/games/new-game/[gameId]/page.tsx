import { getPlayerGamesByGameId } from "@/app/actions/PlayerActions";
import ClearLocalStorage from "../component/ClearLocalStorage";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function NewGamePage({
  params: { gameId },
}: {
  params: { gameId: string };
}) {
  const playerGames = await getPlayerGamesByGameId(gameId);

  return (
    <div>
      <ClearLocalStorage />
      <h1>New Game has been entered! Thank you for playing!</h1>
      <p>Game ID: {gameId}</p>

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
