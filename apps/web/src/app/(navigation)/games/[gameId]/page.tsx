"use client";
import GameTable from "../components/GameTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { addPlayerToGame, getPlayersByGame } from "@/app/actions/GameActions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addPlayer, getPlayers } from "@/app/actions/PlayerActions";
import { Decimal } from "@prisma/client/runtime/library";
import { Switch } from "@/components/ui/switch";

export type Player = {
  id: string;
  name: string;
  buyIns: Decimal;
  gains: Decimal;
};

export default function NewGamePage({
  params: { gameId },
}: {
  params: { gameId: string };
}) {
  const [name, setName] = useState("");
  const [buyIns, setBuyIns] = useState<string>("");
  const [gains, setGains] = useState<string>("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [isNewPlayer, setIsNewPlayer] = useState(true);

  const toggleExistingOrNewPlayer = () => {
    setIsNewPlayer(!isNewPlayer);
  };

  const handleSubmit = async () => {
    if (isNewPlayer) {
      const newPlayer = await addPlayer(
        name,
        parseFloat(buyIns),
        gains ? parseFloat(gains) : 0,
        gameId
      );
      await addPlayerToGame(
        gameId,
        newPlayer.id,
        newPlayer.buyIns,
        newPlayer.gains
      );
    } else {
      await addPlayerToGame(
        gameId,
        name,
        parseFloat(buyIns),
        parseFloat(gains)
      );
    }

    setName("");
    setBuyIns("");
    setGains("");
  };

  const totalBuyIns = players.reduce((acc, player) => acc + player.buyIns, 0);

  useEffect(() => {
    async function fetchAllPlayers() {
      const data = await getPlayers();
      const players = data.map((player) => ({
        id: player.id,
        name: player.name,
        buyIns: player.buyIns,
        gains: player.gains,
      }));
      setAllPlayers(players);
    }

    fetchAllPlayers();
  }, []);

  useEffect(() => {
    async function fetchPlayersInGame() {
      const data = await getPlayersByGame(gameId);
      setPlayers(data);
    }
    fetchPlayersInGame();
  }, []);

  return (
    <div>
      <div className="mb-4 border-b pb-4">
        <div className="flex justify-center items-center">
          <div className="flex items-center space-x-2">
            <Switch
              id="newOrExistingPlayer"
              onClick={toggleExistingOrNewPlayer}
            />
            <Label htmlFor="newOrExistingPlayer">
              {isNewPlayer ? "New Player" : "Existing Player"}
            </Label>
          </div>
        </div>
        <form action={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              {isNewPlayer ? (
                <Input
                  id="name"
                  className="col-span-3"
                  name="name"
                  type="text"
                  required
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
              ) : (
                <SelectPlayers data={allPlayers} />
              )}
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
              <Label htmlFor="gains" className="text-right">
                {+gains >= 0 ? (
                  <span>Gains</span>
                ) : (
                  <span className="ml-2 text-destructive">Loss</span>
                )}
              </Label>
              <Input
                id="gains"
                type="text"
                name="gains"
                className="col-span-3"
                pattern="-?[0-9]*\.?[0-9]*"
                onChange={(e) => {
                  const value = e.target.value;

                  // Allow only numbers, optional negative sign, and a single decimal
                  if (/^-?\d*\.?\d*$/.test(value) || value === "") {
                    setGains(value);
                  }
                }}
                value={gains}
              />
            </div>
          </div>
          <Button variant="default" type="submit">
            Submit
          </Button>
        </form>
      </div>

      <div>
        <GameTable
          players={players}
          handleDelete={() => {}}
          setPlayers={setPlayers}
        />
      </div>
      <div className=" border-t mt-4 pt-4">
        <p>Total Buy Ins: ${totalBuyIns}</p>
      </div>
    </div>
  );
}

type SelectPlayersProps = {
  data: Player[];
};

function SelectPlayers({ data }: SelectPlayersProps) {
  return (
    <>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Existing Player" />
        </SelectTrigger>
        <SelectContent>
          {data.map((player) => {
            return (
              <SelectItem key={player.id} value={player.id}>
                {player.name}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </>
  );
}
