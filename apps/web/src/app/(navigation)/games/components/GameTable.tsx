"use client";
import { useCallback, useEffect, useState } from "react";
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
import { debounce } from "lodash";
import { Trash2 } from "lucide-react";

type GameTableProps = {
  players: Player[];
  handleDelete: (index: number) => void;
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  chipMode: boolean;
  chipsPerBuyIn: number;
  dollarPerBuyIn: number;
  isEdit: boolean;
};

export default function GameTable({
  players,
  handleDelete,
  setPlayers,
  chipMode,
  chipsPerBuyIn,
  dollarPerBuyIn,
  isEdit,
}: GameTableProps) {
  const [gainsInputs, setGainsInputs] = useState<string[]>(
    players.map((p) => {
      if (p.gains) {
        return p.gains?.toString();
      }
      return "";
    })
  );

  const debouncedUpdate = useCallback(
    debounce((newPlayers) => {
      if (!isEdit) {
        localStorage.setItem("players", JSON.stringify(newPlayers));
      }
      setPlayers(newPlayers);
    }, 500),
    [setPlayers]
  );

  const convertToDollars = (chips: number) =>
    (chips / chipsPerBuyIn) * dollarPerBuyIn;

  const convertToChips = (dollars: number) =>
    (dollars / dollarPerBuyIn) * chipsPerBuyIn;

  const handleChange = (
    index: number,
    field: "buyIns" | "gains",
    rawValue: string
  ) => {
    const parsed = parseFloat(rawValue);
    const numericValue = isNaN(parsed) ? 0 : parsed;
    const converted = chipMode ? convertToDollars(numericValue) : numericValue;

    setPlayers((prev) => {
      const newPlayers = prev.map((player, i) =>
        i === index
          ? {
              ...player,
              [field]: converted,
            }
          : player
      );

      debouncedUpdate(newPlayers);
      return newPlayers;
    });
  };

  const handleChangeGains = (index: number, value: string) => {
    const regex = chipMode ? /^-?\d*$/ : /^-?\d*\.?\d*$/;

    if (!regex.test(value)) return;

    setGainsInputs((prev) => {
      const newInputs = [...prev];
      newInputs[index] = value;
      return newInputs;
    });

    const parsed = chipMode ? parseInt(value, 10) : parseFloat(value);

    if (!isNaN(parsed)) {
      const dollarValue = chipMode
        ? (parsed / chipsPerBuyIn) * dollarPerBuyIn
        : parsed;

      setPlayers((prevPlayers) => {
        const newPlayers = [...prevPlayers];
        newPlayers[index] = {
          ...newPlayers[index],
          gains: Math.round(dollarValue * 100) / 100,
        };
        debouncedUpdate(newPlayers);
        return newPlayers;
      });
    }
  };

  useEffect(() => {
    setGainsInputs(() => {
      return players.map((p) => {
        const gains = p.gains ?? 0;
        const value = chipMode
          ? (gains / dollarPerBuyIn) * chipsPerBuyIn
          : gains;

        return value.toFixed(2).replace(/\.00$/, "");
      });
    });
  }, [players, chipMode, chipsPerBuyIn, dollarPerBuyIn]);

  const displayBuyIns = (player: Player) => {
    if (!player.buyIns) return 0;
    return chipMode
      ? convertToChips(player.buyIns).toString()
      : player.buyIns.toString();
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Player</TableHead>
          <TableHead>Buy Ins {chipMode ? "(chips)" : "(dollars)"}</TableHead>
          <TableHead>Gains {chipMode ? "(chips)" : "(dollars)"}</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.map((player, index) => {
          return (
            <TableRow key={player.id}>
              <TableCell className=" p-2">
                <p>{player.name}</p>
              </TableCell>
              <TableCell className=" p-2">
                <Input
                  type="number"
                  value={displayBuyIns(player)}
                  onChange={(e) =>
                    handleChange(index, "buyIns", e.target.value)
                  }
                  className="border p-1 w-full"
                />
              </TableCell>
              <TableCell className=" p-2">
                <Input
                  type="text"
                  inputMode={chipMode ? "numeric" : "decimal"}
                  value={gainsInputs[index]}
                  onChange={(e) => handleChangeGains(index, e.target.value)}
                  step={chipMode ? 1 : "any"}
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:bg-red-100 md:hidden"
                  onClick={() => handleDelete(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  className="hidden md:inline-flex"
                  onClick={() => handleDelete(index)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
