import Game from "../components/Game";

export default function NewGamePage() {
  return (
    <div>
      <div className=" flex justify-center">
        <h2 className=" font-bold text-3xl">New Game</h2>
      </div>
      <Game />
    </div>
  );
}
