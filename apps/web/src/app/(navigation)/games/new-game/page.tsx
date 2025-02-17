"use client";
import GameTable from "../components/GameTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { createGame } from "@/app/actions/GameActions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addPlayer, handleGetPlayers } from "@/app/actions/PlayerActions";
import { Switch } from "@/components/ui/switch";
import { Player } from "@prisma/client";

export default function NewGamePage() {
  const [name, setName] = useState("");
  const [existingPlayerId, setExistingPlayerId] = useState("");
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
        parseFloat(gains) || 0
      );

      setPlayers((prevState) => {
        localStorage.setItem(
          "players",
          JSON.stringify([
            ...prevState,
            {
              name,
              buyIns: parseFloat(buyIns) || 0,
              gains: parseFloat(gains) || 0,
            },
          ])
        );
        return [
          ...prevState,
          {
            ...newPlayer,
            buyIns: parseFloat(buyIns),
            gains: parseFloat(gains) || 0,
          },
        ];
      });
    } else {
      const player = allPlayers.find(
        (player) => player.id === existingPlayerId
      );
      if (player) {
        setPlayers(() => {
          localStorage.setItem(
            "players",
            JSON.stringify([
              ...players,
              {
                id: player.id,
                name: player.name,
                buyIns: parseFloat(buyIns) || 0,
                gains: parseFloat(gains) || 0,
              },
            ])
          );
          return [
            ...players,
            {
              ...player,
              buyIns: parseFloat(buyIns),
              gains: parseFloat(gains) || 0,
            },
          ];
        });
      }
    }

    setName("");
    setBuyIns("");
    setGains("");
    setExistingPlayerId("");
    setIsNewPlayer(false);
  };

  const handleDelete = (index: number) => {
    setPlayers((prevPlayers) => {
      const newPlayers = [...prevPlayers];
      newPlayers.splice(index, 1);
      localStorage.setItem("players", JSON.stringify(newPlayers));
      return newPlayers;
    });
  };

  const totalBuyIns = players.reduce((acc, player) => acc + player.buyIns, 0);

  useEffect(() => {
    async function fetchAllPlayers() {
      const data = await handleGetPlayers();
      const players = data.map((player) => ({
        id: player.id,
        name: player.name,
        buyIns: player.buyIns,
        gains: player.gains,
      }));
      setAllPlayers(players);
    }

    fetchAllPlayers();
  }, [players.length]);

  useEffect(() => {
    const playersLocalStorage = localStorage.getItem("players");
    if (playersLocalStorage) {
      setPlayers(JSON.parse(playersLocalStorage));
    }
  }, []);

  return (
    <div>
      <div className="mb-4 border-b pb-4">
        <div className="flex justify-center items-center">
          <div className="flex items-center space-x-2">
            <Switch
              onCheckedChange={toggleExistingOrNewPlayer}
              checked={!isNewPlayer}
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
                <SelectPlayers
                  data={allPlayers}
                  existingPlayerId={existingPlayerId}
                  setExistingPlayerId={setExistingPlayerId}
                />
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
          handleDelete={handleDelete}
          setPlayers={setPlayers}
        />
      </div>
      <div className=" border-t mt-4 pt-4">
        <p>Total Buy Ins: ${totalBuyIns}</p>
      </div>
      <div className="mt-4">
        <form action={async () => await createGame(players)}>
          <Button variant="default" type="submit">
            Save Game
          </Button>
        </form>
      </div>
    </div>
  );
}

type SelectPlayersProps = {
  data: Player[];
  setExistingPlayerId: (player: string) => void;
  existingPlayerId: string;
};

function SelectPlayers({
  data,
  setExistingPlayerId,
  existingPlayerId,
}: SelectPlayersProps) {
  return (
    <>
      <Select
        onValueChange={(value) => {
          setExistingPlayerId(value);
        }}
        value={existingPlayerId}
      >
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
