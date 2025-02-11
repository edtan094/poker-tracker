"use client";

import GameTable from "./components/GameTable";
import AddPlayerDialog from "./components/AddPlayerDialog";
import { addPlayer } from "@/app/actions/AddPlayer";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function NewGamePage() {
  const [name, setName] = useState("");
  const [buyIns, setBuyIns] = useState<number>(0);
  const [gainsLosses, setGainsLosses] = useState<number>(0);
  const [players, setPlayers] = useState<
    { name: string; buyIns: number; gainsLosses: number }[]
  >([]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setPlayers([...players, { name, buyIns, gainsLosses }]);
    setName("");
    setBuyIns(0);
    setGainsLosses(0);

    localStorage.setItem(
      "players",
      JSON.stringify([...players, { name, buyIns, gainsLosses }])
    );
  };

  const handleDelete = (index: number) => {
    const newPlayers = players.filter((player, i) => i !== index);
    setPlayers(newPlayers);
    localStorage.setItem("players", JSON.stringify(newPlayers));
  };

  useEffect(() => {
    const playersLocalStorage = localStorage.getItem("players");
    if (playersLocalStorage) {
      setPlayers(JSON.parse(playersLocalStorage));
    }
  }, []);

  const totalBuyIns = players.reduce((acc, player) => acc + player.buyIns, 0);

  return (
    <div>
      <h1 className=" my-8">New Game</h1>

      <div>
        <form>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                className="col-span-3"
                name="name"
                required
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="buyins" className="text-right">
                Buy Ins
              </Label>
              <Input
                id="buyIns"
                type="number"
                name="buyIns"
                required
                className="col-span-3"
                onChange={(e) => setBuyIns(Number(e.target.value || undefined))}
                value={buyIns}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gains-losses" className="text-right">
                Gains/Losses
              </Label>
              <Input
                id="gainslosses"
                type="number"
                name="gainslosses"
                required
                className="col-span-3"
                onChange={(e) =>
                  setGainsLosses(Number(e.target.value || undefined))
                }
                value={gainsLosses}
              />
            </div>
          </div>
          <Button variant="default" onClick={(e) => handleSubmit(e)}>
            Submit
          </Button>
        </form>

        <div>
          <GameTable players={players} handleDelete={handleDelete} />
        </div>
        <div className=" border-t mt-4 pt-4">
          <p>Total Buy Ins: ${totalBuyIns}</p>
        </div>
      </div>
    </div>
  );
}
