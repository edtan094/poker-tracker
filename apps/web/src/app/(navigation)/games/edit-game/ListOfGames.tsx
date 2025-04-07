import { GameForClient } from "./types";
import GameCard from "../components/GameCard";

type ListOfGamesProps = {
  games: GameForClient[];
};

export default function ListOfGames({ games }: ListOfGamesProps) {
  {
    return games.map((game, index) => {
      return (
        <GameCard
          key={game.id}
          game={game}
          length={games.length}
          index={index}
        />
      );
    });
  }
}
