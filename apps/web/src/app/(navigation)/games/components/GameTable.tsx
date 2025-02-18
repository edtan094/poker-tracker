"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Player } from "@prisma/client";

type GameTableProps = {
  players: Player[];
  handleDelete: (index: number) => void;
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
};

export default function GameTable({
  players,
  handleDelete,
  setPlayers,
}: GameTableProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempPlayer, setTempPlayer] = useState<Player | null>(null);

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setTempPlayer({ ...players[index] });
  };

  const handleChange = (index: number, field: keyof Player, value: string) => {
    setPlayers((prevPlayers) => {
      const newPlayers = prevPlayers.map((player, i) =>
        i === index
          ? {
              ...player,
              [field]:
                field === "buyIns" || field === "gains"
                  ? parseFloat(value) || 0
                  : value,
            }
          : player
      );

      localStorage.setItem("players", JSON.stringify(newPlayers)); // ✅ Save to localStorage
      return newPlayers;
    });
  };

  const handleUpdate = (index: number, updatedPlayer: Player) => {
    setPlayers((prevPlayers) => {
      const newPlayers = prevPlayers.map((player, i) =>
        i === index ? updatedPlayer : player
      );

      localStorage.setItem("players", JSON.stringify(newPlayers));

      return newPlayers;
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Player</TableHead>
          <TableHead>Buy Ins</TableHead>
          <TableHead>Gains</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.map((player, index) => (
          <TableRow key={index}>
            <TableCell>
              <Input
                type="text"
                value={player.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                className="border p-1 w-full"
              />
            </TableCell>
            <TableCell>
              <Input
                type="text"
                inputMode="decimal"
                value={player.buyIns.toString()}
                onChange={(e) => handleChange(index, "buyIns", e.target.value)}
                className="border p-1 w-full"
              />
            </TableCell>
            <TableCell>
              <Input
                type="text"
                inputMode="decimal"
                value={player.gains.toString()}
                onChange={(e) => handleChange(index, "gains", e.target.value)}
                className="border p-1 w-full"
              />
            </TableCell>
            <TableCell>
              <Button variant="destructive" onClick={() => handleDelete(index)}>
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

type EditGameRowProps = {
  tempPlayer: Player | null;
  handleChange: (field: keyof Player, value: string) => void;
  handleSave: () => void;
};

function EditGameRow({
  tempPlayer,
  handleChange,
  handleSave,
}: EditGameRowProps) {
  return (
    <>
      <TableCell>
        <Input
          type="text"
          value={tempPlayer?.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
          className="border p-1 w-full"
        />
      </TableCell>

      <TableCell>
        <Input
          type="text"
          inputMode="decimal"
          value={tempPlayer?.buyIns.toString() || ""}
          onChange={(e) => {
            const value = e.target.value;
            if (/^-?\d*\.?\d*$/.test(value) || value === "") {
              handleChange("buyIns", value);
            }
          }}
          className="border p-1 w-full"
        />
      </TableCell>

      <TableCell>
        <Input
          type="text"
          value={tempPlayer?.gains.toString() || ""}
          onChange={(e) => {
            const value = e.target.value;
            if (/^-?\d*\.?\d*$/.test(value) || value === "") {
              handleChange("gains", value);
            }
          }}
          className="border p-1 w-full"
        />
      </TableCell>

      {/* <TableCell>
        <Button variant="default" onClick={handleSave}>
          Save
        </Button>
      </TableCell> */}
    </>
  );
}
