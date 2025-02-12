import { getPlayers } from "@/app/actions/PlayerActions";
import NewGamePage from "./components/NewGamePage";

export type Player = { name: string; buyIns: number; gains: number };

export default async function GamePage() {
  return (
    <div>
      <h1 className=" my-8">New Game</h1>
      <NewGamePage />
    </div>
  );
}
