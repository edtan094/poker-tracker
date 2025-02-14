export default async function NewGamePage({
  params: { gameId },
}: {
  params: { gameId: string };
}) {
  return (
    <div>
      <h1>New Game has been entered! Thank you for playing!</h1>
      <p>Game ID: {gameId}</p>
    </div>
  );
}
