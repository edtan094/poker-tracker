"use client";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type AlertModalProps = {
  buttonVariant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
  buttonText?: string;
  buttonIcon?: React.ReactNode;
  title?: string;
  description?: string;
  actionText?: string;
  cancelText?: string;
  handleAction: () => void;
};

export default function AlertModal({
  buttonVariant,
  buttonText,
  buttonIcon: ButtonIcon,
  title,
  description,
  actionText,
  cancelText,
  handleAction,
}: AlertModalProps) {
  const [text, setText] = useState("");

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={buttonVariant}>
          <ButtonIcon />
          {buttonText}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            <div>
              <p>{description}</p>
              <div className=" mt-4">
                <Input
                  type="text"
                  placeholder="Type something..."
                  className="w-full"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <div className=" flex justify-between items-center w-full">
            <AlertDialogCancel className="mt-0">{cancelText}</AlertDialogCancel>
            <AlertDialogAction
              disabled={text !== "I want to delete this game"}
              onClick={handleAction}
              className=" bg-destructive text-white"
            >
              {actionText}
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
