import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cache } from "@/lib/cache";
import { prisma } from "@/lib/prisma";

const getAllPlayersByGains = cache(async () => {
  return prisma.player.findMany({ orderBy: { gains: "desc" } });
}, ["/leaderboards"]);

export default async function Leaderboard() {
  const allPlayers = await getAllPlayersByGains();
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Place</TableHead>
            <TableHead>Player</TableHead>
            <TableHead>Gains</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allPlayers.map((player, index) => {
            return (
              <TableRow key={player.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {index === 0 ? (
                    <span>{player.name} ( Aura Farmer 👑)</span>
                  ) : (
                    player.name
                  )}
                </TableCell>
                <TableCell>{Number(player.gains)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}
