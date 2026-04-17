import { Player, getOverall, STAT_LABELS, StatKey } from "@/types/player";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PlayerDetailDialogProps {
  player: Player | null;
  open: boolean;
  onClose: () => void;
}

const statKeys: StatKey[] = ["speed", "shoot", "stamina", "dribbling", "pass"];

const PlayerDetailDialog = ({ player, open, onClose }: PlayerDetailDialogProps) => {
  if (!player) return null;
  const overall = getOverall(player.stats);
  const initials = player.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {player.name}
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-4 pt-2">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-display text-xl font-bold">
            {initials}
          </div>
          <div className="flex flex-col items-center ml-auto">
            <span className="font-display text-4xl font-bold leading-none">
              {overall}
            </span>
            <span className="text-xs text-muted-foreground mt-1">OVR</span>
          </div>
        </div>

        <div className="space-y-3 pt-4">
          {statKeys.map((key) => (
            <div key={key} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  {STAT_LABELS[key]}
                </span>
                <span className="font-display font-bold text-base">
                  {player.stats[key]}
                </span>
              </div>
              <div className="h-2 rounded-full bg-accent overflow-hidden">
                <div
                  className="h-full rounded-full bg-stat-bar transition-all"
                  style={{ width: `${player.stats[key]}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerDetailDialog;
