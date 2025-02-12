"use client";

import GameTable from "./components/GameTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";

export default function NewGamePage() {
  const [name, setName] = useState("");
  const [buyIns, setBuyIns] = useState<string>("");
  const [gains, setGains] = useState<string>("");
  const [players, setPlayers] = useState<
    { name: string; buyIns: number; gains: number }[]
  >([]);
  console.log("players", players);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setPlayers([
      ...players,
      { name, buyIns: parseFloat(buyIns) || 0, gains: parseFloat(gains) || 0 },
    ]);
    setName("");
    setBuyIns("");
    setGains("");

    localStorage.setItem(
      "players",
      JSON.stringify([...players, { name, buyIns, gains }])
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
              <Label htmlFor="buyIns" className="text-right">
                Buy Ins
              </Label>
              <Input
                id="buyIns"
                type="number"
                name="buyIns"
                required
                className="col-span-3"
                onChange={(e) => setBuyIns(e.target.value)}
                value={buyIns}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gainslosses" className="text-right">
                {gains >= 0 ? (
                  <span>Gains</span>
                ) : (
                  <span className="ml-2 text-destructive">Loss</span>
                )}
              </Label>
              <Input
                id="gainslosses"
                type="number"
                name="gainslosses"
                required
                inputMode="decimal"
                className="col-span-3"
                onChange={(e) => {
                  setGains(e.target.value);
                }}
                value={gains}
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
