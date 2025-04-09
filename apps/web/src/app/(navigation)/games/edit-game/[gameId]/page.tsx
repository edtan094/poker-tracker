import Game from "../../components/Game";
import getGameById from "@/lib/db/getGamesById";

export default async function EditGamePage(props: {
  params: Promise<{ gameId: string }>;
}) {
  const { gameId } = await props.params;

  const game = await getGameById(gameId);

  return (
    <div>
      <div className=" flex justify-center">
        <h1 className=" font-bold text-3xl">Edit Game</h1>
      </div>
      <Game game={game} isEdit={!!gameId} />
    </div>
  );
}
