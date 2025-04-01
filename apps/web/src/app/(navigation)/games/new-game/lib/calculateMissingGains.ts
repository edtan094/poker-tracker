import { Player } from "@prisma/client";

export const calculateMissingGains = (
  players: Player[],
  chipMode: boolean,
  dollarPerBuyIn: number,
  chipsPerBuyIn: number
) => {
  const totalGains = players.reduce((acc, player) => {
    if (player.gains === undefined) {
      return acc;
    }
    return acc + player.gains;
  }, 0);

  if (totalGains > 0) {
    if (chipMode) {
      return (
        "You have an excess of " +
        Math.abs(totalGains * (chipsPerBuyIn / dollarPerBuyIn)) +
        " in chips. Please check your inputs."
      );
    }
    return (
      "You have an excess of " +
      totalGains +
      " in gains. Please check your inputs."
    );
  }

  if (totalGains < 0) {
    if (chipMode) {
      return (
        "You are missing " +
        Math.abs(totalGains * (chipsPerBuyIn / dollarPerBuyIn)) +
        " in chips. Please check your inputs."
      );
    }
    return (
      "You are missing " +
      Math.abs(totalGains) +
      " in gains. Please check your inputs."
    );
  }
};
