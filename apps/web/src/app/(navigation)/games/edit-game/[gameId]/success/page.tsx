import { getPlayerGamesByGameId } from "@/app/actions/PlayerActions";
import SuccessPage from "../../../components/SuccessPage";

export default async function EditGameSuccessOrFailure(props: {
  params: Promise<{ gameId: string }>;
}) {
  const params = await props.params;

  const { gameId } = params;

  const playerGames = await getPlayerGamesByGameId(gameId);

  return (
    <>
      <SuccessPage gameId={gameId} playerGames={playerGames} />
    </>
  );
}
