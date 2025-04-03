import { prisma } from "@/lib/prisma";
import { GameForClient, GameForServer } from "./types";
import ListOfGames from "./ListOfGames";

export function convertGameDataToNumbers(
  data: GameForServer[]
): GameForClient[] {
  return data.map((game) => ({
    ...game,
    playerGames: game.playerGames.map((pg) => {
      return {
        ...pg,
        buyIns: pg.buyIns.toNumber(),
        gains: pg.gains.toNumber(),
        netProfit: pg.netProfit.toNumber(),
        player: {
          ...pg.player,
          buyIns: pg.player.buyIns.toNumber(),
          gains: pg.player.gains.toNumber(),
        },
      };
    }),
  }));
}

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

  const data = convertGameDataToNumbers(games);
  return data;
}

export default async function Games() {
  const games = await getAllGamesWithPlayers();

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
