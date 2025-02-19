import { handleGetPlayers } from "@/app/actions/PlayerActions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";

import { cache } from "@/lib/cache";

export const dynamic = "force-dynamic";

const getAllPlayersByGains = cache(
  async () => {
    return await prisma.player.findMany({ orderBy: { gains: "desc" } });
  },
  ["/leaderboards"],
  { revalidate: 60 }
);

export default async function LeaderboardsPage() {
  const allPlayers = await getAllPlayersByGains();
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
            {allPlayers.map((player, index) => {
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
