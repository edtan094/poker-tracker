"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { ActionResponse } from "../page";
import { Player } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialState: ActionResponse = {
  success: false,
  message: "",
};

type SubmitPlayerFormProps = {
  setPlayers: (players: Player[]) => void;
  isNewPlayer: boolean;
  allPlayers: Player[];
  action: (payload: FormData) => void;
  isPending: boolean;
  state: ActionResponse;
  setAllPlayers: (players: Player[]) => void;
};

export default function SubmitPlayerForm({
  setPlayers,
  isNewPlayer,
  allPlayers,
  action,
  isPending,
  state,
  setAllPlayers,
}: SubmitPlayerFormProps) {
  const [existingPlayerId, setExistingPlayerId] = useState("");

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
      setExistingPlayerId("");
    }
  }, [state]);

  return (
    <form action={action}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          {isNewPlayer ? (
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
          ) : (
            <SelectPlayers
              data={allPlayers}
              existingPlayerId={existingPlayerId}
              setExistingPlayerId={setExistingPlayerId}
            />
          )}
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

type SelectPlayersProps = {
  data: Player[];
  setExistingPlayerId: (player: string) => void;
  existingPlayerId: string;
};

function SelectPlayers({
  data,
  setExistingPlayerId,
  existingPlayerId,
}: SelectPlayersProps) {
  return (
    <>
      <Select
        name="existingPlayerId"
        value={existingPlayerId}
        onValueChange={(value) => {
          setExistingPlayerId(value);
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Existing Player" />
        </SelectTrigger>
        <SelectContent>
          {data.map((player) => {
            return (
              <SelectItem key={player.id} value={player.id}>
                {player.name}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </>
  );
}
