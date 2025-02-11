"use client";

import GameTable from "./components/GameTable";
import AddPlayerDialog from "./components/AddPlayerDialog";
import { useFormState, useFormStatus } from "react-dom";
import { addPlayer } from "@/app/actions/AddPlayer";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function NewGamePage() {
  const [error, action] = useFormState(addPlayer, {});

  return (
    <div>
      <h1 className=" my-8">New Game</h1>

      <div>
        <form action={action}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" className="col-span-3" name="name" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="buyins" className="text-right">
                Buy Ins
              </Label>
              <Input
                id="buyins"
                type="number"
                name="buy ins"
                required
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gains-losses" className="text-right">
                Gains/Losses
              </Label>
              <Input
                id="gainslosses"
                type="number"
                name="gainslosses"
                required
                className="col-span-3"
              />
            </div>
          </div>
          <SubmitButton />
        </form>

        <div>{/* <GameTable /> */}</div>
      </div>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return <Button type="submit">{pending ? "Saving..." : "Save"}</Button>;
}
