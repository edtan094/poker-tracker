import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function GamePage() {
  return (
    <div className=" flex justify-center mt-9">
      <Button>
        <Link href={"/games/new-game"}>Start New Game</Link>
      </Button>
    </div>
  );
}
