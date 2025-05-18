-- Create sessions table
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL,
  location TEXT NOT NULL,
  location_id TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  wave_height TEXT,
  wave_quality TEXT,
  crowd TEXT,
  notes TEXT,
  rating INTEGER,
  media JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fk_user
    FOREIGN KEY(user_id)
      REFERENCES auth.users(id)
);

-- Add RLS policies for sessions table
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert their own sessions
CREATE POLICY "Users can insert their own sessions"
  ON public.sessions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can view their own sessions
CREATE POLICY "Users can view their own sessions"
  ON public.sessions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can update their own sessions
CREATE POLICY "Users can update their own sessions"
  ON public.sessions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own sessions
CREATE POLICY "Users can delete their own sessions"
  ON public.sessions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at on sessions update
CREATE TRIGGER update_sessions_updated_at
BEFORE UPDATE ON public.sessions
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- Create index on user_id for faster queries
CREATE INDEX sessions_user_id_idx ON public.sessions(user_id);

-- Create index on date for faster sorting
CREATE INDEX sessions_date_idx ON public.sessions(date); 
