import { Player } from "@/types/player";

const STORAGE_KEY = "kickoff-players";

export const loadPlayers = (): Player[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const savePlayers = (players: Player[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
};
