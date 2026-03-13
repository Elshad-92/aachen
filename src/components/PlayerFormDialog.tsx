import { useState } from "react";
import { Player, PlayerStats, StatKey, STAT_LABELS } from "@/types/player";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface PlayerFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (player: Omit<Player, "id"> & { id?: string }) => void;
  player?: Player | null;
}

const statKeys: StatKey[] = ["speed", "shoot", "stamina", "dribbling", "pass"];
const statLabels: Record<StatKey, string> = {
  speed: "Speed",
  shoot: "Shoot",
  stamina: "Stamina",
  dribbling: "Dribbling",
  pass: "Pass",
};

const defaultStats: PlayerStats = {
  speed: 50,
  shoot: 50,
  stamina: 50,
  dribbling: 50,
  pass: 50,
};

const PlayerFormDialog = ({
  open,
  onClose,
  onSave,
  player,
}: PlayerFormDialogProps) => {
  const [name, setName] = useState(player?.name ?? "");
  const [stats, setStats] = useState<PlayerStats>(
    player?.stats ?? { ...defaultStats }
  );

  const handleOpen = (isOpen: boolean) => {
    if (isOpen) {
      setName(player?.name ?? "");
      setStats(player?.stats ?? { ...defaultStats });
    } else {
      onClose();
    }
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ id: player?.id, name: name.trim(), stats });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {player ? "Spieler bearbeiten" : "Neuer Spieler"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          <Input
            placeholder="Name des Spielers"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="font-display text-lg"
            autoFocus
          />

          <div className="space-y-4">
            {statKeys.map((key) => (
              <div key={key} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    {statLabels[key]}
                  </span>
                  <Input
                    type="number"
                    min={1}
                    max={99}
                    value={stats[key]}
                    onChange={(e) => {
                      const v = Math.min(99, Math.max(1, Number(e.target.value) || 1));
                      setStats((prev) => ({ ...prev, [key]: v }));
                    }}
                    className="w-16 h-8 text-center font-display font-bold text-base"
                  />
                </div>
                <Slider
                  value={[stats[key]]}
                  onValueChange={([v]) =>
                    setStats((prev) => ({ ...prev, [key]: v }))
                  }
                  min={1}
                  max={99}
                  step={1}
                  className="[&_[role=slider]]:bg-primary"
                />
              </div>
            ))}
          </div>

          <Button onClick={handleSave} className="w-full" disabled={!name.trim()}>
            {player ? "Speichern" : "Spieler hinzufügen"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerFormDialog;
