import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormStatus } from "react-dom";

export default function AddPlayerDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Player</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Player</DialogTitle>
          <DialogDescription>Enter player information</DialogDescription>
        </DialogHeader>
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
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <SubmitButton />
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return <Button type="submit">{pending ? "Saving..." : "Save"}</Button>;
}
