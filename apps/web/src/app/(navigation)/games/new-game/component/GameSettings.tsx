import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type GameSettingsProps = {
  showDollarAmount: boolean;
  toggleShowDollarAmount: () => void;
};

export default function GameSettings({
  showDollarAmount,
  toggleShowDollarAmount,
}: GameSettingsProps) {
  return (
    <div className="grid gap-4 py-4">
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
