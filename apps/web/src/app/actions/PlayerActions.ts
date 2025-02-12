"use server"; // Enables the function to run server-side

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache"; // Needed to refresh the UI after database updates

export async function getPlayers() {
  return await prisma.player.findMany();
}

export async function addPlayer(name: string, buyIn: number, gains: number) {
  await prisma.player.create({
    data: { name, buyIn, gains },
  });
  revalidatePath("/"); // Refresh UI automatically
}
