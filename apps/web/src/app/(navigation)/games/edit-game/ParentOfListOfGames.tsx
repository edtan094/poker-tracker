import { prisma } from "@/lib/prisma";
import ListOfGames from "./ListOfGames";
import { GameForClient } from "./types";

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
  }));
}

export default async function ParentOfListOfGames() {
  const games = await getAllGames();
  return <ListOfGames games={games} />;
}
