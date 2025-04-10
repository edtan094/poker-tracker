"use client";
import { GameForClient } from "./types";
import GameCard from "../components/GameCard";
import { useToast } from "@/hooks/use-toast";
import { deleteGame } from "@/app/actions/GameActions";

type ListOfGamesProps = {
  games: GameForClient[];
};

export default function ListOfGames({ games }: ListOfGamesProps) {
  const { toast } = useToast();

  const handleDelete = async (gameId: string) => {
    try {
      const deletedGame = await deleteGame(gameId);
      if (deletedGame === gameId) {
        toast({
          title: "Game deleted",
          description: `Game #${deletedGame} has been deleted.`,
        });
      } else {
        toast({
          title: "Error deleting game",
          description: `Game #${gameId} could not be deleted.`,
          variant: "destructive",
        });
      }
    } catch (e) {
      toast({
        title: "Error deleting game",
        description: `Game #${gameId} could not be deleted.`,
        variant: "destructive",
      });
      console.error("error", e);
    }
  };

  if (!games || games.length === 0) {
    return (
      <div className="flex justify-center">
        <p className="text-center text-lg">No games found!</p>
      </div>
    );
  }

  return games.map((game, index) => {
    return (
      <GameCard
        key={game.id}
        game={game}
        length={games.length}
        index={index}
        handleDelete={handleDelete}
      />
    );
  });
}
