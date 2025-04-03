import { GameForClient } from "./types";
import GameCard from "../components/GameCard";

type ListOfGamesProps = {
  games: GameForClient[];
};

export default function ListOfGames({ games }: ListOfGamesProps) {
  {
    return games.map((game) => {
      return <GameCard key={game.id} game={game} />;
    });
  }
}
