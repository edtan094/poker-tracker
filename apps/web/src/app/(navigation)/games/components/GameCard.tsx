"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GameForClient } from "../edit-game/types";
import { Button } from "@/components/ui/button";
import React from "react";
import { EditIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import AlertModal from "@/components/modal/AlertModal";

type GameCardProps = {
  game: GameForClient;
  length: number;
  index: number;
  handleDelete: (gameId: string) => void;
};

export default function GameCard({
  game,
  length,
  index,
  handleDelete,
}: GameCardProps) {
  const numberOfPlayers = game.playerGames.length;

  const totalBuyIns = game.playerGames.reduce((acc, pg) => {
    return acc + pg.buyIns;
  }, 0);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
  }).format(game.dateOfGame);

  return (
    <Card key={game.id} className=" mb-4">
      <CardHeader>
        <CardTitle className=" text-lg md:text-3xl">
          Game # {length - index} - {formattedDate}
        </CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <p>Number of Players: {numberOfPlayers} </p>
          <p>Total Buy Ins: ${totalBuyIns}</p>
        </div>
      </CardContent>
      <CardFooter className=" flex justify-between">
        <Link href={`/games/edit-game/${game.id}`} className=" w-1/2">
          <Button>
            <EditIcon />
            Edit
          </Button>
        </Link>

        <AlertModal
          buttonVariant="destructive"
          buttonText="Delete"
          buttonIcon={TrashIcon}
          title="Are you sure you want to delete this game?"
          description="This action cannot be undone. This will permanently delete this game and remove your data from our servers."
          actionText="Delete"
          cancelText="Cancel"
          handleAction={() => {
            handleDelete(game.id);
          }}
        />
      </CardFooter>
    </Card>
  );
}
