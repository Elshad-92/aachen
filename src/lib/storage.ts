import { Player } from "@/types/player";
import { supabase } from "@/integrations/supabase/client";

export const loadPlayers = async (): Promise<Player[]> => {
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error loading players:", error);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    stats: {
      speed: row.speed,
      shoot: row.shoot,
      stamina: row.stamina,
      dribbling: row.dribbling,
      pass: row.pass,
    },
  }));
};

export const addPlayer = async (player: Omit<Player, "id">): Promise<Player | null> => {
  const { data, error } = await supabase
    .from("players")
    .insert({
      name: player.name,
      speed: player.stats.speed,
      shoot: player.stats.shoot,
      stamina: player.stats.stamina,
      dribbling: player.stats.dribbling,
      pass: player.stats.pass,
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding player:", error);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    stats: {
      speed: data.speed,
      shoot: data.shoot,
      stamina: data.stamina,
      dribbling: data.dribbling,
      pass: data.pass,
    },
  };
};

export const updatePlayer = async (player: Player): Promise<boolean> => {
  const { error } = await supabase
    .from("players")
    .update({
      name: player.name,
      speed: player.stats.speed,
      shoot: player.stats.shoot,
      stamina: player.stats.stamina,
      dribbling: player.stats.dribbling,
      pass: player.stats.pass,
    })
    .eq("id", player.id);

  if (error) {
    console.error("Error updating player:", error);
    return false;
  }
  return true;
};

export const deletePlayer = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from("players")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting player:", error);
    return false;
  }
  return true;
};
