import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, LogOut } from "lucide-react";

interface AttendanceEntry {
  id: string;
  name: string;
  created_by_username: string;
  created_at: string;
}

const AttendancePage = () => {
  const { user, isAdmin, signOut } = useAuth();
  const [entries, setEntries] = useState<AttendanceEntry[]>([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch current week's attendance
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const { data, error } = await supabase
          .from("attendance")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setEntries(data || []);
      } catch (err) {
        console.error("Error fetching attendance:", err);
      }
    };

    fetchAttendance();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel("attendance-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "attendance" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setEntries((prev) => [payload.new as AttendanceEntry, ...prev]);
          } else if (payload.eventType === "DELETE") {
            setEntries((prev) =>
              prev.filter((entry) => entry.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleAddName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { error } = await supabase.from("attendance").insert([
        {
          name: newName.trim(),
          created_by_username: user?.username,
        },
      ]);

      if (error) throw error;
      setNewName("");
      setSuccess("Name hinzugefügt! ✅");
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Hinzufügen");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, createdBy: string) => {
    if (user?.username !== createdBy && !isAdmin) {
      setError("Du kannst nur deine eigenen Einträge löschen!");
      return;
    }

    try {
      const { error } = await supabase.from("attendance").delete().eq("id", id);
      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Löschen");
    }
  };

  const handleResetAll = async () => {
    if (!isAdmin) return;

    if (window.confirm("Alle Einträge dieser Woche löschen?")) {
      try {
        const { error } = await supabase.from("attendance").delete().neq("id", "");
        if (error) throw error;
        setSuccess("Liste wurde zurückgesetzt! ✅");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Fehler beim Resetten");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Wer spielt mit?</h1>
          <Button
            onClick={() => signOut()}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Add Name Form */}
        <Card>
          <CardHeader>
            <CardTitle>Namen hinzufügen</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddName} className="space-y-3">
              <Input
                placeholder="Dein Name..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                disabled={loading}
              />
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Wird hinzugefügt..." : "Hinzufügen"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Messages */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="bg-green-900 border-green-700">
            <AlertDescription className="text-green-200">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {/* Attendance List */}
        <Card>
          <CardHeader className="flex justify-between">
            <CardTitle>
              Spieler ({entries.length}/12)
            </CardTitle>
            {isAdmin && (
              <Button
                onClick={handleResetAll}
                variant="destructive"
                size="sm"
              >
                Liste resetten
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {entries.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                Noch keine Anmeldungen...
              </p>
            ) : (
              <div className="space-y-2">
                {entries.map((entry, index) => (
                  <div
                    key={entry.id}
                    className="flex justify-between items-center p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 font-semibold w-6">
                        {index + 1}.
                      </span>
                      <span className="text-white font-medium">
                        {entry.name}
                      </span>
                      <span className="text-xs text-gray-400">
                        ({entry.created_by_username})
                      </span>
                    </div>
                    {(user?.username === entry.created_by_username ||
                      isAdmin) && (
                      <Button
                        onClick={() =>
                          handleDelete(entry.id, entry.created_by_username)
                        }
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AttendancePage;
