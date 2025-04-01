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
import { Switch } from "@/components/ui/switch";

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
  toggleExistingOrNewPlayer: () => void;
};

export default function SubmitPlayerForm({
  setPlayers,
  isNewPlayer,
  allPlayers,
  action,
  isPending,
  state,
  setAllPlayers,
  toggleExistingOrNewPlayer,
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
            },
          ])
        );
        return [
          ...prevState,
          {
            id: state.data?.id,
            name: state.data?.name,
          },
        ];
      });
      setExistingPlayerId("");
    }
  }, [state]);

  return (
    <div className=" flex justify-center">
      <form action={action} className="mb-6 space-y-4">
        <div className="flex items-center space-x-2">
          <Label htmlFor="newOrExistingPlayer" className="text-right">
            {isNewPlayer ? "New Player" : "Existing Player"}
          </Label>
          <Switch
            onCheckedChange={toggleExistingOrNewPlayer}
            checked={!isNewPlayer}
          />
        </div>
        <div className="flex items-center space-x-2">
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
    </div>
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
