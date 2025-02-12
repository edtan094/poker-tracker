"use server";

import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createGame() {
  const game = await prisma.game.create({ data: {} });

  redirect(`/games/${game.id}`);
}

export async function addPlayerToGame(
  gameId: string,
  playerId: string,
  buyIn: number,
  gains: number
) {
  await prisma.playerGame.create({
    data: {
      gameId,
      playerId,
      buyIn: new Decimal(buyIn),
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

  const netProfit = new Decimal(gains).minus(playerGame.buyIn);

  await prisma.playerGame.update({
    where: { id: playerGame.id },
    data: { gains: new Decimal(gains), netProfit },
  });

  revalidatePath(`/games/${gameId}`);
}
