"use server";

import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createGame(
  players: { id: string; buyIns: number; gains: number }[]
) {
  const game = await prisma.$transaction(async (prisma) => {
    const game = await prisma.game.create({ data: {} });

    await prisma.playerGame.createMany({
      data: players.map(({ id, buyIns, gains }) => ({
        gameId: game.id,
        playerId: id,
        buyIns: new Decimal(buyIns),
        gains: new Decimal(gains),
      })),
    });

    for (const { id } of players) {
      const totalGains = await prisma.playerGame.aggregate({
        where: { playerId: id },
        _sum: { gains: true },
      });

      const totalBuyIns = await prisma.playerGame.aggregate({
        where: { playerId: id },
        _sum: { buyIns: true },
      });

      const updatedPlayer = await prisma.player.update({
        where: { id },
        data: {
          gains: new Decimal(totalGains._sum.gains || 0),
          buyIns: new Decimal(totalBuyIns._sum.buyIns || 0),
        },
      });
    }

    return game;
  });
  revalidatePath("/leaderboards");
  redirect(`/games/new-game/${game.id}`);
}

export async function addPlayerToGame(
  gameId: string,
  playerId: string,
  buyIns: number | Decimal,
  gains: number | Decimal
) {
  await prisma.playerGame.create({
    data: {
      gameId,
      playerId,
      buyIns: new Decimal(buyIns),
      gains: new Decimal(gains),
      netProfit: new Decimal(0),
    },
  });
  revalidatePath("/games/new-game");
  revalidatePath("/leaderboards");
}

export async function updatePlayerScore(
  gameId: string,
  playerId: string,
  gains: number
) {
  const playerGame = await prisma.playerGame.findFirst({
    where: { gameId, playerId },
  });

  if (!playerGame) throw new Error("Player not found in this game.");

  const netProfit = new Decimal(gains).minus(playerGame.buyIns);

  await prisma.playerGame.update({
    where: { id: playerGame.id },
    data: { gains: new Decimal(gains), netProfit },
  });

  revalidatePath(`/games/${gameId}`);
}

export async function getPlayersByGame(gameId: string) {
  const playerGames = await prisma.playerGame.findMany({
    where: { gameId },
    include: { player: true },
  });

  return playerGames.map(({ player, buyIns, gains, netProfit }) => ({
    id: player.id,
    name: player.name,
    buyIns: buyIns.toNumber(),
    gains: gains.toNumber(),
    netProfit: netProfit.toNumber(),
  }));
}
