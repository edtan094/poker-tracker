"use server";

import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { revalidatePath, revalidateTag } from "next/cache";
import { unstable_cache } from "next/cache";
import { ActionResponse } from "../(navigation)/games/new-game/page";
import { z } from "zod";

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

const playerSchema = z.object({
  name: z.string().min(1, "Name must be at least 1 character"),
  buyIns: z.string().optional(),
  gains: z.string().optional(),
});

export async function submitPlayer(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const rawData = {
      name: formData.get("name") as string,
      buyIns: formData.get("buyIns") as string,
      gains: formData.get("gains") as string,
    };

    const validatedData = playerSchema.safeParse(rawData);
    if (!validatedData.success) {
      return {
        success: false,
        message: "Please fix the errors in the form",
        errors: validatedData.error.flatten().fieldErrors,
        inputs: validatedData.data,
      };
    }

    const player = await prisma.player.findFirst({
      where: { name: validatedData.data.name },
    });

    if (player) {
      return {
        success: false,
        message: "Player already exists",
        inputs: validatedData.data,
      };
    }

    const newPlayer = await addPlayer(validatedData.data.name);

    if (!newPlayer) {
      return {
        success: false,
        message: "Failed to save user",
        inputs: validatedData.data,
      };
    }

    return {
      data: { ...validatedData.data, id: newPlayer.id },
      success: true,
      message: "User saved successfully!",
    };
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}
