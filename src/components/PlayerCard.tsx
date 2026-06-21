import { Player, getOverall, STAT_LABELS, StatKey } from "@/types/player";
import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";

interface PlayerCardProps {
  player: Player;
  selected?: boolean;
  selectionMode?: boolean;
  isAdmin?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const statKeys: StatKey[] = ["speed", "shoot", "stamina", "dribbling", "pass"];

const PlayerCard = ({
  player,
  selected,
  selectionMode,
  isAdmin,
  onSelect,
  onEdit,
  onDelete,
}: PlayerCardProps) => {
  const overall = getOverall(player.stats);
  const initials = player.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <motion.div
      layout
      whileTap={{ scale: 0.97 }}
      onClick={onSelect}
      className={`flex items-center gap-3 rounded-lg border bg-card p-3 transition-colors cursor-pointer ${
        selected
          ? "border-primary ring-2 ring-primary/30"
          : "border-border hover:border-muted-foreground/30"
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-display text-sm font-semibold ${
          selected
            ? "bg-primary text-primary-foreground"
            : "bg-accent text-foreground"
        }`}
      >
        {initials}
      </div>

      {/* Name + mini stats */}
      <div className="flex-1 min-w-0">
        <p className="font-display text-base font-semibold truncate">
          {player.name}
        </p>
        <div className="flex gap-1 mt-1">
          {statKeys.map((key) => (
            <div key={key} className="flex-1">
              <div className="text-[10px] text-muted-foreground leading-none mb-0.5">
                {STAT_LABELS[key]}
              </div>
              <div className="h-1.5 rounded-full bg-accent overflow-hidden">
                <div
                  className="h-full rounded-full bg-stat-bar transition-all"
                  style={{ width: `${player.stats[key]}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Overall */}
      <div className="flex flex-col items-center shrink-0">
        <span className="font-display text-2xl font-bold leading-none">
          {overall}
        </span>
        <span className="text-[10px] text-muted-foreground">OVR</span>
      </div>

      {/* Actions (only in non-selection mode and for admins) */}
      {!selectionMode && isAdmin && (
        <div className="flex flex-col gap-1 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default PlayerCard;
