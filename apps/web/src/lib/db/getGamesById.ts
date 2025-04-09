import { GameForClient } from "@/app/(navigation)/games/edit-game/types";
import { prisma } from "../prisma";

export default async function getGameById(
  gameId: string
): Promise<GameForClient> {
  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: { playerGames: { include: { player: true } } },
  });

  if (!game) {
    throw new Error("Game not found.");
  }

  const playerGames = game.playerGames.map((pg) => ({
    ...pg,
    buyIns: pg.buyIns.toNumber(),
    gains: pg.gains.toNumber(),
    netProfit: pg.netProfit.toNumber(),
    player: {
      ...pg.player,
      buyIns: pg.player.buyIns.toNumber(),
      gains: pg.player.gains.toNumber(),
    },
  }));
  return {
    ...game,
    playerGames,
  };
}
