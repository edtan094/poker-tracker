import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type GameSettingsProps = {
  showDollarAmount: boolean;
  toggleShowDollarAmount: () => void;
  moneyPerBuyIn?: number;
  chipsPerBuyIn?: number;
  setMoneyPerBuyIn: (value: number) => void;
  setChipsPerBuyIn: (value: number) => void;
};

export default function GameSettings({
  showDollarAmount,
  toggleShowDollarAmount,
  moneyPerBuyIn,
  chipsPerBuyIn,
  setMoneyPerBuyIn,
  setChipsPerBuyIn,
}: GameSettingsProps) {
  return (
    <div className="grid gap-4 py-4 border rounded p-4">
      <div className="flex justify-center">
        <p className="text-right">Game Settings</p>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="chipOrDollar" className="text-right mr-4">
          {showDollarAmount ? "Dollar Amount" : "Chip Amount"}
        </Label>
        <Switch
          onCheckedChange={toggleShowDollarAmount}
          checked={!showDollarAmount}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="moneyPerBuyIn" className=" text-right">
          {showDollarAmount ? "$ Per Buy In" : "Chips Per Buy In"}
        </Label>
        <Input
          id="moneyPerBuyIn"
          name="moneyPerBuyIn"
          className="col-span-3 md:w-1/2"
          type="number"
        />
      </div>
    </div>
  );
}
