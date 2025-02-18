import { handleGetPlayers } from "@/app/actions/PlayerActions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function LeaderboardsPage() {
  const allPlayers = await handleGetPlayers();

  const sortPlayersByHighestProfit = () => {
    return allPlayers.sort((a, b) => {
      return +b.buyIns + +b.gains - (+a.buyIns + +a.gains);
    });
  };
  return (
    <div>
      <h1>Leaderboards</h1>

      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Place</TableHead>
              <TableHead>Player</TableHead>
              <TableHead>Gains</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortPlayersByHighestProfit().map((player, index) => {
              return (
                <TableRow key={player.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{player.name}</TableCell>
                  <TableCell>{+player.gains}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
