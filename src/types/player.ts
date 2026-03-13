export interface PlayerStats {
  speed: number;
  shoot: number;
  stamina: number;
  dribbling: number;
  pass: number;
}

export interface Player {
  id: string;
  name: string;
  stats: PlayerStats;
}

export type StatKey = keyof PlayerStats;

export const STAT_LABELS: Record<StatKey, string> = {
  speed: "SPD",
  shoot: "SHO",
  stamina: "STA",
  dribbling: "DRI",
  pass: "PAS",
};

export const getOverall = (stats: PlayerStats): number => {
  const { speed, shoot, stamina, dribbling, pass } = stats;
  return Math.round((speed + shoot + stamina + dribbling + pass) / 5);
};
