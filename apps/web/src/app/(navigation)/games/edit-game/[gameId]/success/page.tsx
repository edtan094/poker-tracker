import SuccessPage from "../../../components/SuccessPage";
import getGameById from "@/lib/db/getGameById";

export default async function EditGameSuccessOrFailure(props: {
  params: Promise<{ gameId: string }>;
}) {
  const params = await props.params;

  const { gameId } = params;

  const game = await getGameById(gameId);

  return (
    <>
      <SuccessPage gameId={gameId} game={game} />
    </>
  );
}
