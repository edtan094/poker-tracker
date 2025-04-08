import { prisma } from "@/lib/prisma";
import { GameForClient } from "./types";
import ListOfGames from "./ListOfGames";

async function getAllGames(): Promise<GameForClient[]> {
  const games = await prisma.game.findMany({
    include: {
      playerGames: {
        include: {
          player: true,
        },
      },
    },
    orderBy: { dateOfGame: "desc" },
  });

  if (!games.length) {
    return [];
  }

  return games.map((game) => ({
    ...game,
    playerGames: game.playerGames.map((pg) => ({
      ...pg,
      buyIns: pg.buyIns.toNumber(),
      gains: pg.gains.toNumber(),
      netProfit: pg.netProfit.toNumber(),
      player: {
        ...pg.player,
        buyIns: pg.player.buyIns.toNumber(),
        gains: pg.player.gains.toNumber(),
      },
    })),
  })) as GameForClient[];
}

export default async function Games() {
  const games = await getAllGames();

  return (
    <div>
      <div className=" flex justify-center">
        <div>
          <ListOfGames games={games} />
        </div>
      </div>
    </div>
  );
}
