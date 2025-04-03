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

type GameCardProps = {
  game: GameForClient;
};

export default function GameCard({ game }: GameCardProps) {
  return (
    <Card key={game.id} className=" mb-4">
      <CardHeader>
        <CardTitle>Game Id: {game.id}</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <p>Scores</p>
          <div>
            {game.playerGames.map((pg) => {
              return (
                <div key={pg.id}>
                  <p>Player: {pg.player.name}</p>
                  <p>Buy Ins: {pg.buyIns}</p>
                  <p>Gains: {pg.gains}</p>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button>Edit</Button>
      </CardFooter>
    </Card>
  );
}
