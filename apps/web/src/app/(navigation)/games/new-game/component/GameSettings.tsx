"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

type GameSettingsProps = {
  chipMode: boolean;
  setChipMode: (v: boolean) => void;
  chipsPerBuyIn: number;
  setChipsPerBuyIn: (v: number) => void;
  dollarPerBuyIn: number;
  setDollarPerBuyIn: (v: number) => void;
};

export default function GameSettings({
  chipMode,
  setChipMode,
  chipsPerBuyIn,
  setChipsPerBuyIn,
  dollarPerBuyIn,
  setDollarPerBuyIn,
}: GameSettingsProps) {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="toggle-chip-mode"
          checked={chipMode}
          onCheckedChange={setChipMode}
        />
        <Label htmlFor="toggle-chip-mode">
          {chipMode ? "Chip Mode" : "Dollar Mode"}
        </Label>
      </div>

      <div className="flex items-center gap-4">
        <div>
          <Label>Chips Per Buy-In</Label>
          <Input
            type="number"
            value={chipsPerBuyIn}
            onChange={(e) => setChipsPerBuyIn(+e.target.value)}
          />
        </div>
        <div>
          <Label>Dollar Per Buy-In</Label>
          <Input
            type="number"
            value={dollarPerBuyIn}
            onChange={(e) => setDollarPerBuyIn(+e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
