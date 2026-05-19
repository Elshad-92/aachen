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

  const isA = variant === "a";
  const accent = isA ? "hsl(195,85%,40%)" : "hsl(0,72%,45%)";
  const accentSoft = isA ? "hsl(151,67%,40%)" : "hsl(48,100%,50%)";
  const flagName = isA ? "Aserbaidschan" : "Deutschland";

  return (
    <div className="flex-1 space-y-3">
      {/* Flag Header */}
      <div className="relative overflow-hidden rounded-xl shadow-lg ring-1 ring-black/5">
        {/* Flag stripes background */}
        {isA ? (
          <div className="absolute inset-0 flex flex-col">
            <div className="flex-1 bg-[hsl(195,85%,40%)]" />
            <div className="flex-1 bg-[hsl(357,82%,51%)] relative flex items-center justify-center gap-1.5">
              {/* Crescent: white circle with red circle offset to carve crescent */}
              <div className="relative w-5 h-5">
                <div className="absolute inset-0 rounded-full bg-white" />
                <div className="absolute inset-0 rounded-full bg-[hsl(357,82%,51%)] translate-x-[30%]" />
              </div>
              {/* 8-pointed star */}
              <svg viewBox="0 0 100 100" className="w-3.5 h-3.5 fill-white">
                <polygon points="50,5 59,38 92,28 68,52 92,72 59,62 50,95 41,62 8,72 32,52 8,28 41,38" />
              </svg>
            </div>
            <div className="flex-1 bg-[hsl(151,67%,40%)]" />
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col">
            <div className="flex-1 bg-black" />
            <div className="flex-1 bg-[hsl(0,72%,45%)]" />
            <div className="flex-1 bg-[hsl(48,100%,50%)]" />
          </div>
        )}
        {/* Overlay content */}
        <div className="relative bg-black/35 backdrop-blur-[1px] p-3 text-center text-white">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] drop-shadow">
            {flagName}
          </p>
          <p className="font-display text-4xl font-bold leading-none mt-1 drop-shadow-lg">
            {teamOverall}
          </p>
          <p className="text-[10px] uppercase tracking-widest opacity-90 mt-1">
            AVG OVR
          </p>
        </div>
      </div>

      {/* Avg Stats */}
      <div className="rounded-xl border bg-card p-3 space-y-2 shadow-sm">
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
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${accent}, ${accentSoft})`,
                }}
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
            initial={{ opacity: 0, x: isA ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.08 }}
            className="relative flex items-center gap-2 rounded-lg border bg-card px-2.5 py-2 shadow-sm overflow-hidden"
          >
            <span
              className="absolute left-0 top-0 bottom-0 w-1"
              style={{ background: accent }}
            />
            <div
              className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-display font-semibold text-white ml-1"
              style={{ background: accent }}
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
          <TeamColumn team={teamA} label="Aserbaidschan" variant="a" />
          <TeamColumn team={teamB} label="Deutschland" variant="b" />
        </div>
      </div>
    </div>
  );
};

export default MatchView;
