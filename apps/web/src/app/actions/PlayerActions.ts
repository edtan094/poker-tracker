"use server";

import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { revalidatePath } from "next/cache";

export async function getPlayers() {
  return await prisma.player.findMany();
}

export async function addPlayer(
  name: string,
  buyIns: number | Decimal,
  gains: number | Decimal
) {
  const newPlayer = await prisma.player.create({
    data: { name, buyIns, gains },
  });
  revalidatePath(`/games/new-game`);

  return newPlayer;
}
