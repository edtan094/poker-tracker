"use client";
import { usePathname } from "next/navigation";

type SuccessPageHeaderProps = {
  gameId: string;
};

export default function SuccessPageHeader({ gameId }: SuccessPageHeaderProps) {
  const pathName = usePathname();

  const isEdit = pathName.includes(`/edit-game/${gameId}/success`);

  return (
    <>
      <h1>
        {isEdit
          ? "The game has been editted successfully!"
          : "New Game has been entered succesfully!"}{" "}
        Thank you for playing!
      </h1>
      <p>Game ID: {gameId}</p>
    </>
  );
}
