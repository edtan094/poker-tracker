"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getPlayers() {
  return await prisma.player.findMany();
}

export async function addPlayer(name: string, buyIn: number, gains: number) {
  await prisma.player.create({
    data: { name, buyIn, gains },
  });
  revalidatePath("/");
}
