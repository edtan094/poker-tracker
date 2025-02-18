"use server";

import { cache } from "@/lib/cache";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { revalidatePath, revalidateTag } from "next/cache";

async function getPlayers() {
  return await prisma.player.findMany();
}

export const handleGetPlayers = cache(
  () => {
    return getPlayers();
  },
  ["players"],
  { revalidate: false }
);

export async function addPlayer(
  name: string,
  buyIns: number | Decimal,
  gains: number | Decimal
) {
  const newPlayer = await prisma.player.create({
    data: { name, buyIns, gains },
  });
  revalidatePath(`/games/new-game`);
  revalidateTag("/players");

  return newPlayer;
}
