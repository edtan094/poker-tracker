import { submitPlayer } from "@/app/actions/PlayerActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect } from "react";
import { ActionResponse } from "../page";
import { Player } from "@prisma/client";

const initialState: ActionResponse = {
  success: false,
  message: "",
};

type SubmitPlayerFormProps = {
  setPlayers: (players: Player[]) => void;
};

export default function SubmitPlayerForm({
  setPlayers,
}: SubmitPlayerFormProps) {
  const [state, action, isPending] = useActionState(submitPlayer, initialState);

  useEffect(() => {
    if (state.success) {
      setPlayers((prevState) => {
        localStorage.setItem(
          "players",
          JSON.stringify([
            ...prevState,
            {
              id: state.data?.id,
              name: state.data?.name,
              buyIns: parseFloat(state.data?.buyIns) || 0,
              gains: parseFloat(state.data?.gains) || 0,
            },
          ])
        );
        return [
          ...prevState,
          {
            id: state.data?.id,
            name: state.data?.name,
            buyIns: parseFloat(state.data?.buyIns) || 0,
            gains: parseFloat(state.data?.gains) || 0,
          },
        ];
      });
    }
  }, [state]);

  return (
    <form action={action}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            id="name"
            className="col-span-3 md:w-1/2"
            name="name"
            type="text"
            minLength={1}
            required
            placeholder="Enter Name"
            defaultValue={state.inputs?.name}
          />
          {state?.errors?.name && (
            <p id="streetAddress-error" className="text-sm text-red-500">
              {state.errors.name[0]}
            </p>
          )}
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="buyIns" className="text-right">
            Buy Ins
          </Label>
          <Input
            id="buyIns"
            type="number"
            name="buyIns"
            required
            className="col-span-3 md:w-1/2"
            placeholder="Enter Buy Ins"
            defaultValue={state.inputs?.buyIns}
          />
          {state?.errors?.buyIns && (
            <p id="streetAddress-error" className="text-sm text-red-500">
              {state.errors.buyIns[0]}
            </p>
          )}
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="gains" className="text-right">
            <span>Gains</span>
          </Label>
          <Input
            id="gains"
            type="text"
            name="gains"
            className="col-span-3 md:w-1/2"
            pattern="-?[0-9]*\.?[0-9]*"
            placeholder="Enter Gains"
            defaultValue={state.inputs?.gains}
          />
          {state?.errors?.gains && (
            <p id="streetAddress-error" className="text-sm text-red-500">
              {state.errors.gains[0]}
            </p>
          )}
        </div>
      </div>
      <div className="flex justify-between">
        <Button variant="default" type="submit" disabled={isPending}>
          {isPending ? "Submitting..." : "Submit"}
        </Button>

        {state.message && (
          <>
            {state.success ? (
              <p className="text-center text-primary">{state.message}</p>
            ) : (
              <p className="text-center text-red-500">{state.message}</p>
            )}
          </>
        )}
      </div>
    </form>
  );
}
