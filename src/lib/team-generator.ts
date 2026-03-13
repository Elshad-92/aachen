import { Player, PlayerStats, getOverall } from "@/types/player";

// Greedy balanced split: sort by overall desc, assign each player to the weaker team
export const generateBalancedTeams = (
  players: Player[]
): [Player[], Player[]] => {
  const sorted = [...players].sort(
    (a, b) => getOverall(b.stats) - getOverall(a.stats)
  );

  const teamA: Player[] = [];
  const teamB: Player[] = [];
  let sumA = 0;
  let sumB = 0;

  for (const player of sorted) {
    const ovr = getOverall(player.stats);
    if (sumA <= sumB && teamA.length < players.length / 2) {
      teamA.push(player);
      sumA += ovr;
    } else if (teamB.length < players.length / 2) {
      teamB.push(player);
      sumB += ovr;
    } else {
      teamA.push(player);
      sumA += ovr;
    }
  }

  return [teamA, teamB];
};

export const getTeamAvgStats = (team: Player[]): PlayerStats => {
  if (team.length === 0)
    return { speed: 0, shoot: 0, stamina: 0, dribbling: 0, pass: 0 };

  const sum = team.reduce(
    (acc, p) => ({
      speed: acc.speed + p.stats.speed,
      shoot: acc.shoot + p.stats.shoot,
      stamina: acc.stamina + p.stats.stamina,
      dribbling: acc.dribbling + p.stats.dribbling,
      pass: acc.pass + p.stats.pass,
    }),
    { speed: 0, shoot: 0, stamina: 0, dribbling: 0, pass: 0 }
  );

  return {
    speed: Math.round(sum.speed / team.length),
    shoot: Math.round(sum.shoot / team.length),
    stamina: Math.round(sum.stamina / team.length),
    dribbling: Math.round(sum.dribbling / team.length),
    pass: Math.round(sum.pass / team.length),
  };
};
