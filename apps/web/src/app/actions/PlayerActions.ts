"use server";

import { prisma } from "@/lib/prisma";
import { ActionResponse } from "../(navigation)/games/new-game/page";
import { z } from "zod";

export async function getPlayers() {
  return await prisma.player.findMany();
}

export async function addPlayer(name: string) {
  const newPlayer = await prisma.player.create({
    data: { name, buyIns: 0, gains: 0 },
  });

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

const playerSchema = z
  .object({
    name: z.string().min(1, "Name is required").nullable().optional(),
    existingPlayerId: z.string().uuid().nullable().optional(),
    buyIns: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid buy-in amount"),
    gains: z.string().regex(/^-?\d+(\.\d{1,2})?$/, "Invalid gains amount"),
  })
  .refine((data) => data.name || data.existingPlayerId, {
    message: "Either name or existingPlayerId is required",
    path: ["name"],
  });

export async function submitPlayer(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const rawData = {
      name: formData.get("name") as string,
      existingPlayerId: formData.get("existingPlayerId") as string,
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

    if (validatedData.data.existingPlayerId) {
      const player = await prisma.player.findFirst({
        where: { id: validatedData.data.existingPlayerId },
      });

      if (!player) {
        return {
          success: false,
          message: "Player not found",
          inputs: validatedData.data,
        };
      }
      return {
        data: {
          ...player,
          buyIns: validatedData.data.buyIns,
          gains: validatedData.data.gains,
        },
        success: true,
        message: "User saved successfully!",
      };
    }

    if (!validatedData.data.name) {
      return {
        success: false,
        message: "Name is required",
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
