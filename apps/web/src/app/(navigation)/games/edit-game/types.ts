import { Decimal } from "@prisma/client/runtime/library";

export interface PlayerForClient {
  id: string;
  name: string;
  buyIns: number;
  gains: number;
  createdAt: Date; // ISO date string
}

export interface PlayerGameForClient {
  id: string;
  playerId: string;
  gameId: string;
  buyIns: number;
  gains: number;
  netProfit: number;
  player: PlayerForClient;
}

export interface GameForClient {
  id: string;
  createdAt: Date; // ISO date string
  playerGames: PlayerGameForClient[];
}

export interface PlayerForServer {
  id: string;
  name: string;
  buyIns: Decimal;
  gains: Decimal;
  createdAt: Date; // ISO date string
}

export interface PlayerGameForServer {
  id: string;
  playerId: string;
  gameId: string;
  buyIns: Decimal;
  gains: Decimal;
  netProfit: Decimal;
  player: PlayerForClient;
}

export interface GameForServer {
  id: string;
  createdAt: Date; // ISO date string
  playerGames: PlayerGameForServer[];
}
