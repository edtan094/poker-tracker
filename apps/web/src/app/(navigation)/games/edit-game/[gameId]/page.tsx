import { getPlayerGamesByGameId } from "@/app/actions/PlayerActions";

export default async function EditGamePage(props: {
  params: Promise<{ gameId: string }>;
}) {
  const { gameId } = await props.params;

  const playerGames = await getPlayerGamesByGameId(gameId);
  console.log("playerGames", playerGames);
  return (
    <div>
      <h1>Edit Game</h1>
      <p>Game editing functionality will be implemented here.</p>
    </div>
  );
}
