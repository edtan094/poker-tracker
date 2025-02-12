import { Button } from "@/components/ui/button";
import { createGame } from "@/app/actions/GameActions";

export type Player = { name: string; buyIns: number; gains: number };

export default async function GamePage() {
  return (
    <div>
      <form action={createGame}>
        <Button type="submit">Start New Game</Button>
      </form>
    </div>
  );
}
