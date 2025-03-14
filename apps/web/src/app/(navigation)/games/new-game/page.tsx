"use client";
import GameTable from "../components/GameTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useActionState, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { createGame } from "@/app/actions/GameActions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  addPlayer,
  handleGetPlayers,
  submitPlayer,
} from "@/app/actions/PlayerActions";
import { Switch } from "@/components/ui/switch";
import { Player } from "@prisma/client";
import SubmitPlayerForm from "./component/SubmitPlayerForm";

export type UserFormData = {
  name: string;
  buyIns: string;
  gains: string;
};

export type ActionResponse = {
  success: boolean;
  message: string;
  errors?: {
    [K in keyof UserFormData]?: string[];
  };
  data?: {
    name: string;
    buyIns?: string | undefined;
    gains?: string | undefined;
  };
};

export default function NewGamePage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [isNewPlayer, setIsNewPlayer] = useState(true);
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleExistingOrNewPlayer = () => {
    setIsNewPlayer(!isNewPlayer);
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
        <SubmitPlayerForm setPlayers={setPlayers} />
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
