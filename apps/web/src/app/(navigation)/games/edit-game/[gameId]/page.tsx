import { getPlayerGamesByGameId } from "@/app/actions/PlayerActions";
import Game from "../../components/Game";

export default async function EditGamePage(props: {
  params: Promise<{ gameId: string }>;
}) {
  const { gameId } = await props.params;

  const playerGames = await getPlayerGamesByGameId(gameId);

  return (
    <div>
      <div className=" flex justify-center">
        <h1>Edit Game</h1>
      </div>
      <Game playerGames={playerGames} isEdit={!!gameId} />
    </div>
  );
}
