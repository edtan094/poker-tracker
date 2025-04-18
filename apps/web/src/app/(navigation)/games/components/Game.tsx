"use client";

import { Button } from "@/components/ui/button";
import GameSettings from "../new-game/component/GameSettings";
import SubmitPlayerForm from "../new-game/component/SubmitPlayerForm";
import GameTable from "./GameTable";
import { useActionState, useEffect, useMemo, useState } from "react";
import { getPlayers, submitPlayer } from "@/app/actions/PlayerActions";
import { Player } from "@prisma/client";
import { createGame, editGame } from "@/app/actions/GameActions";
import { showMissingGainsMessage } from "../new-game/lib/calculateMissingGains";
import { GameForClient } from "../edit-game/types";

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

type GameProps = {
  game: GameForClient;
  isEdit?: boolean;
};

export default function Game({ game, isEdit }: GameProps) {
  const [state, action, isPending] = useActionState(submitPlayer, initialState);
  const [players, setPlayers] = useState<Player[]>([]);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [isNewPlayer, setIsNewPlayer] = useState(true);
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [chipMode, setChipMode] = useState(true);
  const [chipsPerBuyIn, setChipsPerBuyIn] = useState(500);
  const [dollarPerBuyIn, setDollarPerBuyIn] = useState(5);
  const [date, setDate] = useState<Date>(new Date());
  const toggleExistingOrNewPlayer = () => {
    setIsNewPlayer(!isNewPlayer);
  };

  const handleDelete = (index: number) => {
    setPlayers((prevPlayers) => {
      const newPlayers = [...prevPlayers];
      newPlayers.splice(index, 1);
      if (!isEdit) {
        localStorage.setItem("players", JSON.stringify(newPlayers));
      }

      return newPlayers;
    });
  };

  const handleEditGame = async () => {
    if (loading) return;
    setIsLoading(true);
    setError("");
    try {
      await editGame(game.id, players, date, chipsPerBuyIn, dollarPerBuyIn);
    } catch (error) {
      console.error("Error editing game:", error);
      setError("Failed to edit game. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGame = async () => {
    if (loading) return;
    setIsLoading(true);
    setError("");

    try {
      await createGame(players, date, chipsPerBuyIn, dollarPerBuyIn);
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
    if (isEdit && game) {
      const playersFromExistingGame = game.playerGames?.map((playerGame) => {
        return {
          id: playerGame.player.id,
          name: playerGame.player.name,
          buyIns: playerGame.buyIns,
          gains: playerGame.gains,
        };
      });

      setPlayers(playersFromExistingGame);
      setDate(game.dateOfGame);
      setChipsPerBuyIn(game.chipsPerBuyIn);
      setDollarPerBuyIn(game.dollarPerBuyIn);
      return;
    }
    const playersLocalStorage = localStorage.getItem("players");
    if (playersLocalStorage) {
      setPlayers(JSON.parse(playersLocalStorage));
    }
  }, []);

  const missingGainsMessage = useMemo(() => {
    return showMissingGainsMessage(
      players,
      chipMode,
      dollarPerBuyIn,
      chipsPerBuyIn
    );
  }, [players, chipMode, dollarPerBuyIn, chipsPerBuyIn]);

  const totalBuyInsInChips = (totalBuyIns / dollarPerBuyIn) * chipsPerBuyIn;
  return (
    <>
      <div className="mb-4 border-b pb-4">
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
            isEdit={isEdit}
          />
        </div>
        <div className=" my-8">
          <GameSettings
            chipMode={chipMode}
            setChipMode={setChipMode}
            chipsPerBuyIn={chipsPerBuyIn}
            setChipsPerBuyIn={setChipsPerBuyIn}
            dollarPerBuyIn={dollarPerBuyIn}
            setDollarPerBuyIn={setDollarPerBuyIn}
            date={date}
            setDate={setDate}
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
          isEdit={isEdit}
        />
      </div>
      <div className=" border-t mt-4 pt-4 text-green-500">
        <p className=" mb-2">Total Buy Ins in $$$: ${totalBuyIns}</p>
        <p className=" mb-2">
          Total Buy Ins in Chips: {totalBuyInsInChips} Chips
        </p>
        {missingGainsMessage && (
          <p className="text-red-500">{missingGainsMessage}</p>
        )}
      </div>
      <div className=" mt-4">
        <Button
          variant="default"
          type="button"
          onClick={isEdit ? handleEditGame : handleCreateGame}
          disabled={loading || players.length === 0}
        >
          {loading ? "Saving Game..." : "Save Game"}
        </Button>
      </div>
    </>
  );
}
