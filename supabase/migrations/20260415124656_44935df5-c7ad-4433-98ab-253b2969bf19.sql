CREATE TABLE public.players (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  speed INTEGER NOT NULL DEFAULT 50,
  shoot INTEGER NOT NULL DEFAULT 50,
  stamina INTEGER NOT NULL DEFAULT 50,
  dribbling INTEGER NOT NULL DEFAULT 50,
  pass INTEGER NOT NULL DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view players" ON public.players FOR SELECT USING (true);
CREATE POLICY "Anyone can insert players" ON public.players FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update players" ON public.players FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete players" ON public.players FOR DELETE USING (true);