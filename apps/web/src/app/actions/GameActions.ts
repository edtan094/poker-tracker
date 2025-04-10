"use server";

import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createGame(
  players: { id: string; buyIns: number; gains: number }[],
  date: Date,
  chipsPerBuyIn: number,
  dollarPerBuyIn: number
) {
  if (!players || players.length === 0)
    throw new Error("Players are required.");
  if (!date) throw new Error("Date is required.");
  if (!chipsPerBuyIn) throw new Error("Chips per buy-in are required.");
  if (!dollarPerBuyIn) throw new Error("Dollar per buy-in is required.");
  if (players.some((player) => !player.id))
    throw new Error("Player ID is required.");
  if (players.some((player) => player.buyIns === undefined))
    throw new Error("Player buy-ins are required.");

  const game = await prisma.$transaction(async (prisma) => {
    const game = await prisma.game.create({
      data: { dateOfGame: date, chipsPerBuyIn, dollarPerBuyIn },
    });

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

export async function editGame(
  gameId: string,
  players: { id: string; buyIns: number; gains: number }[],
  date: Date,
  chipsPerBuyIn: number,
  dollarPerBuyIn: number
) {
  if (!gameId || typeof gameId !== "string")
    throw new Error("Game ID is required.");
  if (!players || players.length === 0)
    throw new Error("Players are required.");
  if (!date) throw new Error("Date is required.");
  if (!chipsPerBuyIn) throw new Error("Chips per buy-in are required.");
  if (!dollarPerBuyIn) throw new Error("Dollar per buy-in is required.");
  if (players.some((player) => !player.id))
    throw new Error("Player ID is required.");
  if (players.some((player) => player.buyIns === undefined))
    throw new Error("Player buy-ins are required.");

  const game = await prisma.game.findUnique({
    where: { id: gameId },
  });

  if (!game) throw new Error("Game not found.");

  await prisma.$transaction(async (prisma) => {
    await prisma.game.update({
      where: { id: gameId },
      data: { dateOfGame: date, chipsPerBuyIn, dollarPerBuyIn },
    });

    await prisma.playerGame.deleteMany({
      where: { gameId },
    });

    await prisma.playerGame.createMany({
      data: players.map(({ id, buyIns, gains }) => ({
        gameId,
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

      await prisma.player.update({
        where: { id },
        data: {
          gains: new Decimal(totalGains._sum.gains || 0),
          buyIns: new Decimal(totalBuyIns._sum.buyIns || 0),
        },
      });
    }
  });

  revalidatePath("/leaderboards");
  redirect(`/games/edit-game/${game.id}/success`);
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

export async function deleteGame(gameId: string) {
  if (!gameId || typeof gameId !== "string") {
    throw new Error("Game ID is required.");
  }

  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: {
      playerGames: {
        select: { playerId: true },
      },
    },
  });

  if (!game) throw new Error("Game not found.");

  const affectedPlayerIds = [
    ...new Set(game.playerGames.map((pg) => pg.playerId)),
  ];

  await prisma.$transaction(async (prisma) => {
    await prisma.playerGame.deleteMany({
      where: { gameId },
    });

    await prisma.game.delete({
      where: { id: gameId },
    });

    for (const playerId of affectedPlayerIds) {
      const totalGains = await prisma.playerGame.aggregate({
        where: { playerId },
        _sum: { gains: true },
      });

      const totalBuyIns = await prisma.playerGame.aggregate({
        where: { playerId },
        _sum: { buyIns: true },
      });

      await prisma.player.update({
        where: { id: playerId },
        data: {
          gains: new Decimal(totalGains._sum.gains || 0),
          buyIns: new Decimal(totalBuyIns._sum.buyIns || 0),
        },
      });
    }
  });

  revalidatePath("/games/edit-game");
  revalidatePath("/leaderboards");
  return gameId;
}
