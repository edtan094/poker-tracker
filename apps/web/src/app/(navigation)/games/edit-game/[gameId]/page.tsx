import Game from "../../components/Game";
import { prisma } from "@/lib/prisma";
import { GameForClient } from "../types";

async function getGameById(gameId: string): Promise<GameForClient> {
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

export default async function EditGamePage(props: {
  params: Promise<{ gameId: string }>;
}) {
  const { gameId } = await props.params;

  const game = await getGameById(gameId);

  return (
    <div>
      <div className=" flex justify-center">
        <h1 className=" font-bold text-3xl">Edit Game</h1>
      </div>
      <Game game={game} isEdit={!!gameId} />
    </div>
  );
}
