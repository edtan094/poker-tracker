"use server";

import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function createGame() {
  const game = await prisma.game.create({ data: {} });

  redirect(`/games/${game.id}`);
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
  revalidatePath(`/games/${gameId}`);
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
