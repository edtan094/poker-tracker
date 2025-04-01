"use client";
import GameTable from "../components/GameTable";
import { Button } from "@/components/ui/button";
import { useActionState, useEffect, useState } from "react";
import { createGame } from "@/app/actions/GameActions";
import { getPlayers, submitPlayer } from "@/app/actions/PlayerActions";
import { Player } from "@prisma/client";
import SubmitPlayerForm from "./component/SubmitPlayerForm";
import GameSettings from "./component/GameSettings";
import { showMissingGainsMessage } from "./lib/calculateMissingGains";

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
    id: string;
    name: string;
  };
  inputs?: {
    name: string;
  };
};

const initialState: ActionResponse = {
  success: false,
  message: "",
};

export default function NewGamePage() {
  const [state, action, isPending] = useActionState(submitPlayer, initialState);
  const [players, setPlayers] = useState<Player[]>([]);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [isNewPlayer, setIsNewPlayer] = useState(true);
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [chipMode, setChipMode] = useState(true);
  const [chipsPerBuyIn, setChipsPerBuyIn] = useState(500);
  const [dollarPerBuyIn, setDollarPerBuyIn] = useState(5);

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

  const totalBuyIns = players.reduce((acc, player) => {
    if (player.buyIns === undefined) {
      return acc;
    }
    return acc + player.buyIns;
  }, 0);

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
  }, [players.length]);

  useEffect(() => {
    const playersLocalStorage = localStorage.getItem("players");
    if (playersLocalStorage) {
      setPlayers(JSON.parse(playersLocalStorage));
    }
  }, []);

  const totalBuyInsInChips = (totalBuyIns / dollarPerBuyIn) * chipsPerBuyIn;

  return (
    <div>
      <div className=" flex justify-center">
        <h2 className=" font-bold text-3xl">New Game</h2>
      </div>
      <div className="mb-4 border-b pb-4">
        <div className=" my-8">
          <GameSettings
            chipMode={chipMode}
            setChipMode={setChipMode}
            chipsPerBuyIn={chipsPerBuyIn}
            setChipsPerBuyIn={setChipsPerBuyIn}
            dollarPerBuyIn={dollarPerBuyIn}
            setDollarPerBuyIn={setDollarPerBuyIn}
          />
        </div>
        <div className=" my-8">
          <SubmitPlayerForm
            setPlayers={setPlayers}
            isNewPlayer={isNewPlayer}
            allPlayers={allPlayers}
            action={action}
            isPending={isPending}
            state={state}
            setAllPlayers={setAllPlayers}
            toggleExistingOrNewPlayer={toggleExistingOrNewPlayer}
          />
        </div>
      </div>

      <div>
        <GameTable
          players={players}
          handleDelete={handleDelete}
          setPlayers={setPlayers}
          chipMode={chipMode}
          chipsPerBuyIn={chipsPerBuyIn}
          dollarPerBuyIn={dollarPerBuyIn}
        />
      </div>
      <div className=" border-t mt-4 pt-4 text-green-500">
        <p className=" mb-2">Total Buy Ins in $$$: ${totalBuyIns}</p>
        <p className=" mb-2">
          Total Buy Ins in Chips: {totalBuyInsInChips} Chips
        </p>
        <p className=" text-red-500">
          {showMissingGainsMessage(
            players,
            chipMode,
            dollarPerBuyIn,
            chipsPerBuyIn
          ) &&
            showMissingGainsMessage(
              players,
              chipMode,
              dollarPerBuyIn,
              chipsPerBuyIn
            )}
        </p>
      </div>

      <div className=" mt-4">
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
