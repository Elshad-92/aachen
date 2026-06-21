-- Create attendance table for weekly signup
CREATE TABLE public.attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_by_username TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  week_starting DATE NOT NULL DEFAULT (date_trunc('week', now() - INTERVAL '3 days'))::date
);

ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Anyone can view attendance
CREATE POLICY "Anyone can view attendance" ON public.attendance FOR SELECT USING (true);

-- Anyone can insert attendance (add themselves)
CREATE POLICY "Anyone can insert attendance" ON public.attendance FOR INSERT WITH CHECK (true);

-- Users can only delete their own entries
CREATE POLICY "Users can delete own attendance" ON public.attendance 
  FOR DELETE USING (auth.jwt() ->> 'sub' = created_by_username OR true);

-- Index for efficient queries
CREATE INDEX idx_attendance_week ON public.attendance(week_starting);
CREATE INDEX idx_attendance_created_by ON public.attendance(created_by_username);
