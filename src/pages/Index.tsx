import { useState, useMemo, useEffect, useCallback } from "react";
import { Player } from "@/types/player";
import { loadPlayers, addPlayer, updatePlayer, deletePlayer } from "@/lib/storage";
import { generateBalancedTeams } from "@/lib/team-generator";
import { useAuth } from "@/contexts/AuthContext";
import PlayerCard from "@/components/PlayerCard";
import PlayerFormDialog from "@/components/PlayerFormDialog";
import PlayerDetailDialog from "@/components/PlayerDetailDialog";
import MatchView from "@/components/MatchView";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Shuffle, Users, X, LogOut } from "lucide-react";

const REQUIRED_PLAYERS = 12;

const Index = () => {
  const { isAdmin, signOut, user } = useAuth();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [formOpen, setFormOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [detailPlayer, setDetailPlayer] = useState<Player | null>(null);
  const [matchTeams, setMatchTeams] = useState<[Player[], Player[]] | null>(null);
  const [shuffling, setShuffling] = useState(false);

  useEffect(() => {
    loadPlayers().then((data) => {
      setPlayers(data);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    if (!search) return players;
    const q = search.toLowerCase();
    return players.filter((p) => p.name.toLowerCase().includes(q));
  }, [players, search]);

  const sortPlayers = (list: Player[]) =>
    [...list].sort((a, b) => a.name.localeCompare(b.name));

  const handleSave = async (data: Omit<Player, "id"> & { id?: string }) => {
    if (data.id) {
      const updated: Player = { id: data.id, name: data.name, stats: data.stats };
      const success = await updatePlayer(updated);
      if (success) {
        setPlayers((prev) =>
          sortPlayers(prev.map((p) => (p.id === data.id ? updated : p)))
        );
      }
    } else {
      const newPlayer = await addPlayer({ name: data.name, stats: data.stats });
      if (newPlayer) {
        setPlayers((prev) => sortPlayers([...prev, newPlayer]));
      }
    }
  };

  const handleDelete = async (id: string) => {
    const success = await deletePlayer(id);
    if (success) {
      setPlayers((prev) => prev.filter((p) => p.id !== id));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < REQUIRED_PLAYERS) {
        next.add(id);
      }
      return next;
    });
  };

  const handleGenerate = async () => {
    const selected = players.filter((p) => selectedIds.has(p.id));
    setShuffling(true);
    // Dramatic pause
    await new Promise((r) => setTimeout(r, 1200));
    const teams = generateBalancedTeams(selected);
    setShuffling(false);
    setMatchTeams(teams);
  };

  if (matchTeams) {
    return (
      <MatchView
        teamA={matchTeams[0]}
        teamB={matchTeams[1]}
        onBack={() => {
          setMatchTeams(null);
          setSelectionMode(false);
          setSelectedIds(new Set());
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background pb-28"> 
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold uppercase tracking-wide">
                ⚚ Aachen Ushaqlari
              </h1>
              <p className="text-xs text-muted-foreground">
                {players.length} Spieler im Kader {isAdmin && "(Admin)"}
              </p>
            </div>
            <div className="flex gap-2">
              {selectionMode ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectionMode(false);
                    setSelectedIds(new Set());
                  }}
                >
                  <X className="h-4 w-4 mr-1" />
                  Abbrechen
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectionMode(true)}
                    disabled={players.length < REQUIRED_PLAYERS}
                  >
                    <Users className="h-4 w-4 mr-1" />
                    Aufstellen
                  </Button>
                  {isAdmin && (
                    <Button
                      size="sm"
                      onClick={() => {
                        setEditingPlayer(null);
                        setFormOpen(true);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={signOut}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Spieler suchen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      {/* Player List */}
      <div className="max-w-lg mx-auto px-4 pt-4 space-y-2">
        <AnimatePresence>
          {filtered.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              selected={selectedIds.has(player.id)}
              selectionMode={selectionMode}
              isAdmin={isAdmin}
              onSelect={() =>
                selectionMode
                  ? toggleSelect(player.id)
                  : setDetailPlayer(player)
              }
              onEdit={() => {
                setEditingPlayer(player);
                setFormOpen(true);
              }}
              onDelete={() => handleDelete(player.id)}
            />
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="font-display text-lg">
              {players.length === 0
                ? "Noch keine Spieler im Kader"
                : "Keine Ergebnisse"}
            </p>
            {players.length === 0 && (
              <p className="text-sm mt-1">
                Füge deinen ersten Spieler hinzu!
              </p>
            )}
          </div>
        )}
      </div>

      {/* Selection Bottom Bar */}
      <AnimatePresence>
        {selectionMode && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 border-t bg-card/95 backdrop-blur-sm p-4 z-20"
          >
            <div className="max-w-lg mx-auto flex items-center gap-3">
              <div className="flex-1">
                <p className="font-display text-lg font-bold">
                  {selectedIds.size}/{REQUIRED_PLAYERS}
                </p>
                <p className="text-xs text-muted-foreground">
                  Spieler ausgewählt
                </p>
              </div>
              <Button
                onClick={handleGenerate}
                disabled={selectedIds.size !== REQUIRED_PLAYERS || shuffling}
                className="gap-2"
              >
                {shuffling ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                  >
                    <Shuffle className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <Shuffle className="h-4 w-4" />
                )}
                {shuffling ? "Mische Teams..." : "Teams generieren"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Dialog */}
      <PlayerFormDialog
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingPlayer(null);
        }}
        onSave={handleSave}
        player={editingPlayer}
      />

      {/* Detail Dialog */}
      <PlayerDetailDialog
        open={detailPlayer !== null}
        player={detailPlayer}
        onClose={() => setDetailPlayer(null)}
      />
    </div>
  );
};

export default Index;
