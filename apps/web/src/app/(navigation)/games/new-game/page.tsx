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
  const [loading, setIsLoading] = useState(false);
  const [playerSubmissionLoading, setPlayerSubmissionLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleExistingOrNewPlayer = () => {
    setIsNewPlayer(!isNewPlayer);
  };

  const handleSubmit = async () => {
    if (playerSubmissionLoading) return;
    setPlayerSubmissionLoading(true);
    setError("");
    if (isNewPlayer) {
      const isExistingPlayer = allPlayers.find(
        (player) => player.name === name
      );
      if (isExistingPlayer) {
        setError(
          "Player already exists. Please chose a different name or an existing player."
        );
        return;
      }
      const newPlayer = await addPlayer(name);

      setPlayers((prevState) => {
        localStorage.setItem(
          "players",
          JSON.stringify([
            ...prevState,
            {
              id: newPlayer.id,
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
    setPlayerSubmissionLoading(false);
  };

  const handleDelete = (index: number) => {
    setPlayers((prevPlayers) => {
      const newPlayers = [...prevPlayers];
      newPlayers.splice(index, 1);
      localStorage.setItem("players", JSON.stringify(newPlayers));
      return newPlayers;
    });
  };

  const handleCreateGame = async () => {
    if (loading) return;
    setIsLoading(true);
    setError("");

    try {
      await createGame(players);
    } catch (error) {
      console.error("Error creating game:", error);
      setError("Failed to create game. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
        <Button
          variant="default"
          type="button"
          onClick={handleSubmit}
          disabled={playerSubmissionLoading}
        >
          {playerSubmissionLoading ? "Submitting..." : "Submit"}
        </Button>
        {error && <p className="text-destructive mt-2">{error}</p>}
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
        <Button
          variant="default"
          type="button"
          onClick={handleCreateGame}
          disabled={loading}
        >
          {loading ? "Saving Game..." : "Save Game"}
        </Button>
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
