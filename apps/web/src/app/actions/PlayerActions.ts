"use server";

import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { revalidatePath, revalidateTag } from "next/cache";
import { unstable_cache } from "next/cache";

async function getPlayers() {
  return await prisma.player.findMany();
}

export const handleGetPlayers = unstable_cache(
  async () => {
    return getPlayers();
  },
  ["players"],
  { revalidate: false }
);

export async function addPlayer(name: string) {
  const newPlayer = await prisma.player.create({
    data: { name, buyIns: 0, gains: 0 },
  });
  revalidatePath(`/games/new-game`);
  revalidateTag("players");

  return newPlayer;
}

export async function getPlayerGamesByGameId(gameId: string) {
  try {
    const playerGames = await prisma.playerGame.findMany({
      where: { gameId: gameId },
      include: {
        player: true,
      },
    });

    if (!playerGames.length) {
      throw new Error("No players found for this game.");
    }

    return playerGames;
  } catch (error) {
    console.error("Error fetching PlayerGames:", error.message);
    throw new Error("Failed to fetch PlayerGames.");
  }
}
