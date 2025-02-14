"use client";
import { useState } from "react";
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

  const handleSave = () => {
    if (tempPlayer !== null && editingIndex !== null) {
      handleUpdate(editingIndex, tempPlayer);

      //  Ensure the UI updates after save
      setTimeout(() => {
        setEditingIndex(null);
        setTempPlayer(null);
      }, 0);
    }
  };

  const handleChange = (field: keyof Player, value: string) => {
    if (tempPlayer) {
      setTempPlayer({
        ...tempPlayer,
        [field]:
          field === "buyIns" || field === "gains"
            ? parseFloat(value) || 0
            : value,
      });
    }
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
          <TableHead>Profit</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.map((player, index) => (
          <TableRow
            key={index}
            onClick={() => handleEdit(index)}
            className="cursor-pointer"
          >
            {editingIndex === index ? (
              <EditGameRow
                tempPlayer={tempPlayer}
                handleChange={handleChange}
                handleSave={handleSave}
              />
            ) : (
              <>
                {/* Regular row display when not editing */}
                <TableCell>{player.name}</TableCell>
                <TableCell>{+player.buyIns}</TableCell>
                <TableCell>{+player.gains}</TableCell>
                <TableCell>{+player.buyIns + +player.gains}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click from triggering edit
                      handleDelete(index);
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </>
            )}
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

      <TableCell>
        {(parseFloat(tempPlayer?.buyIns.toString() || "0") || 0) +
          (parseFloat(tempPlayer?.gains.toString() || "0") || 0)}
      </TableCell>

      <TableCell>
        <Button variant="default" onClick={handleSave}>
          Save
        </Button>
      </TableCell>
    </>
  );
}
