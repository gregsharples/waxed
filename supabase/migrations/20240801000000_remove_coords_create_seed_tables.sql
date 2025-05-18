-- Remove unused coordinate columns
ALTER TABLE public.sessions DROP COLUMN IF EXISTS latitude;
ALTER TABLE public.sessions DROP COLUMN IF EXISTS longitude;

-- Create wave_heights seed table
CREATE TABLE IF NOT EXISTS public.wave_heights (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  label TEXT NOT NULL,
  metric TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create wave_qualities seed table
CREATE TABLE IF NOT EXISTS public.wave_qualities (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  label TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create crowd_levels seed table
CREATE TABLE IF NOT EXISTS public.crowd_levels (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Apply RLS policies to seed tables (read-only for all authenticated users)
ALTER TABLE public.wave_heights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wave_qualities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crowd_levels ENABLE ROW LEVEL SECURITY;

-- Allow all users to read the seed data
CREATE POLICY "Allow read access for all authenticated users" ON public.wave_heights
  FOR SELECT USING (auth.role() = 'authenticated');
  
CREATE POLICY "Allow read access for all authenticated users" ON public.wave_qualities
  FOR SELECT USING (auth.role() = 'authenticated');
  
CREATE POLICY "Allow read access for all authenticated users" ON public.crowd_levels
  FOR SELECT USING (auth.role() = 'authenticated');

-- Insert seed data for wave heights (EXACTLY matching ConditionOptions.ts)
INSERT INTO public.wave_heights (id, name, label, metric, description) VALUES
  (1, 'wh1', 'Ankle Biters', '< 0.3m', NULL),
  (2, 'wh2', 'Below Knee', '0.3 – 0.5m', NULL),
  (3, 'wh3', 'Knee to Waist', '0.5 – 0.9m', NULL),
  (4, 'wh4', 'Waist to Shoulder', '0.9 – 1.5m', NULL),
  (5, 'wh5', 'Head High', '~2m', NULL),
  (6, 'wh6', 'Overhead (1.5x)', '2 – 3m', NULL),
  (7, 'wh7', 'Double Overhead', '3 – 4m', NULL),
  (8, 'wh8', 'Triple / Huge!', '4m+', NULL);

-- Insert seed data for wave qualities (EXACTLY matching ConditionOptions.ts)
INSERT INTO public.wave_qualities (id, name, label, description) VALUES
  (1, 'wq1', 'Blown Out', 'Total mess — strong wind, no shape'),
  (2, 'wq2', 'Poor', 'Heavy chop, some broken waves'),
  (3, 'wq3', 'Fair', 'Slight bump, mixed quality'),
  (4, 'wq4', 'Good', 'Nice shape, mostly clean faces'),
  (5, 'wq5', 'Very Good', 'Clean, well-formed peaks'),
  (6, 'wq6', 'Epic', 'Perfect conditions — smooth & hollow');

-- Insert seed data for crowd levels (EXACTLY matching ConditionOptions.ts)
INSERT INTO public.crowd_levels (id, name, label, description) VALUES
  (1, 'c1', 'Soul Session', 'Just you and your mates'),
  (2, 'c2', 'Uncrowded', 'Few others, plenty of waves'),
  (3, 'c3', 'Moderate', 'Decent crowd, still getting waves'),
  (4, 'c4', 'Crowded', 'Packed lineup, waiting for waves'),
  (5, 'c5', 'Combat Zone', 'Extreme crowds, few waves per session');

-- Modify sessions table to use integer foreign keys
ALTER TABLE public.sessions 
  DROP COLUMN IF EXISTS wave_height,
  DROP COLUMN IF EXISTS wave_quality,
  DROP COLUMN IF EXISTS crowd,
  ADD COLUMN wave_height_id INTEGER REFERENCES public.wave_heights(id),
  ADD COLUMN wave_quality_id INTEGER REFERENCES public.wave_qualities(id),
  ADD COLUMN crowd_id INTEGER REFERENCES public.crowd_levels(id); 
