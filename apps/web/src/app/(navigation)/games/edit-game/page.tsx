import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
export async function getAllGamesWithPlayers() {
  const games = await prisma.game.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      playerGames: {
        include: {
          player: true,
        },
      },
    },
  });
  return games;
}

export default async function Games() {
  const games = await getAllGamesWithPlayers();
  console.log("games", games);
  return (
    <div>
      <h1>Games</h1>
      <p>List of games that can be edited.</p>
    </div>
  );
}
