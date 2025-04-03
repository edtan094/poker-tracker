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
import { EditIcon } from "lucide-react";

type GameCardProps = {
  game: GameForClient;
  index: number;
};

export default function GameCard({ game, index }: GameCardProps) {
  const numberOfPlayers = game.playerGames.length;

  const totalBuyIns = game.playerGames.reduce((acc, pg) => {
    return acc + pg.buyIns;
  }, 0);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(game.createdAt);

  return (
    <Card key={game.id} className=" mb-4">
      <CardHeader>
        <CardTitle className=" text-lg md:text-3xl">
          Game # {index + 1} - {formattedDate}
        </CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <p>Number of Players: {numberOfPlayers} </p>
          <p>Total Buy Ins: ${totalBuyIns}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button>
          <EditIcon />
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
}
