import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ClearLocalStorage from "../new-game/component/ClearLocalStorage";
import { GameForClient } from "../edit-game/types";
import SuccessPageHeader from "./SuccessPageHeader";
import GoHomeButton from "./GoHomeButton";

type SuccessPageProps = {
  gameId: string;
  game: GameForClient;
};

export default async function SuccessPage({ gameId, game }: SuccessPageProps) {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
  }).format(game.dateOfGame);
  return (
    <div>
      <ClearLocalStorage />
      <SuccessPageHeader gameId={gameId} />

      <div className=" flex flex-col items-center justify-center mt-10">
        <h1 className=" text-xl">Game Summary</h1>
      </div>

      <Table className=" my-28">
        <TableHeader>
          <TableRow>
            <TableHead>Player</TableHead>
            <TableHead>Buy Ins</TableHead>
            <TableHead>Gains</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {game.playerGames.map((games, index) => (
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

      <div>
        <p>Game Date: {formattedDate}</p>
        <p>Dollars per buy in: ${game.dollarPerBuyIn}</p>
        <p>Chips per buy in: {game.chipsPerBuyIn}</p>
        <p>Number of Players: {game.playerGames.length}</p>
        <p>
          Total Buy Ins: $
          {game.playerGames.reduce((acc, pg) => {
            return acc + pg.buyIns;
          }, 0)}
        </p>
      </div>

      <div className=" mt-10 flex justify-center">
        <GoHomeButton />
      </div>
    </div>
  );
}
