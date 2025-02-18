"use server";

import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { revalidatePath, revalidateTag } from "next/cache";
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

    for (const { id, gains } of players) {
      await prisma.player.update({
        where: { id },
        data: {
          gains: { increment: new Decimal(gains) },
        },
      });
    }

    return game;
  });
  revalidateTag("players");
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
  revalidateTag("players");
}

export async function getPlayersByGame(gameId: string) {
  const playerGames = await prisma.playerGame.findMany({
    where: { gameId },
    include: { player: true }, // Include player details
  });

  return playerGames.map(({ player, buyIns, gains, netProfit }) => ({
    id: player.id,
    name: player.name,
    buyIns,
    gains,
    netProfit,
  }));
}
