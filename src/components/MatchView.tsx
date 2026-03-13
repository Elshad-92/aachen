import { Player, getOverall, STAT_LABELS, StatKey, PlayerStats } from "@/types/player";
import { getTeamAvgStats } from "@/lib/team-generator";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MatchViewProps {
  teamA: Player[];
  teamB: Player[];
  onBack: () => void;
}

const statKeys: StatKey[] = ["speed", "shoot", "stamina", "dribbling", "pass"];

const TeamColumn = ({
  team,
  label,
  variant,
}: {
  team: Player[];
  label: string;
  variant: "a" | "b";
}) => {
  const avg = getTeamAvgStats(team);
  const teamOverall = Math.round(
    (avg.speed + avg.shoot + avg.stamina + avg.dribbling + avg.pass) / 5
  );

  return (
    <div className="flex-1 space-y-3">
      {/* Header */}
      <div
        className={`rounded-lg p-3 text-center ${
          variant === "a"
            ? "bg-azerbaijan text-azerbaijan-foreground"
            : "bg-germany text-germany-foreground"
        }`}
      >
        <p className="font-display text-sm font-semibold uppercase tracking-wider">
          {variant === "a" ? "Aserbaidschan" : "Deutschland"}
        </p>
        <p className="font-display text-3xl font-bold">{teamOverall}</p>
        <p className="text-xs opacity-80">AVG OVR</p>
      </div>

      {/* Avg Stats */}
      <div className="rounded-lg border bg-card p-3 space-y-2">
        {statKeys.map((key) => (
          <div key={key} className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground w-7 font-medium">
              {STAT_LABELS[key]}
            </span>
            <div className="flex-1 h-2 rounded-full bg-accent overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${avg[key]}%` }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className={`h-full rounded-full ${
                  variant === "a" ? "bg-azerbaijan" : "bg-germany"
                }`}
              />
            </div>
            <span className="font-display text-sm font-bold w-7 text-right">
              {avg[key]}
            </span>
          </div>
        ))}
      </div>

      {/* Players */}
      <div className="space-y-1.5">
        {team.map((player, i) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, x: variant === "a" ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.08 }}
            className="flex items-center gap-2 rounded-md border bg-card px-2.5 py-2"
          >
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-display font-semibold ${
                variant === "a"
                  ? "bg-team-a/10 text-team-a"
                  : "bg-team-b/10 text-team-b"
              }`}
            >
              {player.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)}
            </div>
            <span className="flex-1 text-sm font-medium truncate">
              {player.name}
            </span>
            <span className="font-display text-sm font-bold">
              {getOverall(player.stats)}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const MatchView = ({ teamA, teamB, onBack }: MatchViewProps) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-display text-xl font-bold uppercase tracking-wide">
            Match Day
          </h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4">
        {/* VS Header */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="text-center my-4"
        >
          <span className="font-display text-4xl font-bold text-muted-foreground/30">
            VS
          </span>
        </motion.div>

        <div className="flex gap-3">
          <TeamColumn team={teamA} label="Team A" variant="a" />
          <TeamColumn team={teamB} label="Team B" variant="b" />
        </div>
      </div>
    </div>
  );
};

export default MatchView;
