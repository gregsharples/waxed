-- Remove unused coordinate columns
ALTER TABLE public.sessions DROP COLUMN IF EXISTS latitude;
ALTER TABLE public.sessions DROP COLUMN IF EXISTS longitude;

-- Create wave_heights seed table
CREATE TABLE IF NOT EXISTS public.wave_heights (
  id SERIAL PRIMARY KEY,
  label TEXT NOT NULL,
  metric TEXT NOT NULL,
  description TEXT, -- Kept for potential future use, though not in current ConditionOptions.ts
  image_path TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create wave_qualities seed table
CREATE TABLE IF NOT EXISTS public.wave_qualities (
  id SERIAL PRIMARY KEY,
  label TEXT NOT NULL,
  description TEXT NOT NULL,
  image_path TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create crowd_levels seed table
CREATE TABLE IF NOT EXISTS public.crowd_levels (
  id SERIAL PRIMARY KEY,
  label TEXT NOT NULL,
  description TEXT,
  icon_name TEXT,
  image_path TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Apply RLS policies to seed tables (read-only for all authenticated users)
ALTER TABLE public.wave_heights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wave_qualities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crowd_levels ENABLE ROW LEVEL SECURITY;

-- Allow all users to read the seed data
CREATE POLICY "Allow read access for all authenticated users on wave_heights" ON public.wave_heights
  FOR SELECT USING (auth.role() = 'authenticated');
  
CREATE POLICY "Allow read access for all authenticated users on wave_qualities" ON public.wave_qualities
  FOR SELECT USING (auth.role() = 'authenticated');
  
CREATE POLICY "Allow read access for all authenticated users on crowd_levels" ON public.crowd_levels
  FOR SELECT USING (auth.role() = 'authenticated');

-- Insert seed data for wave heights (EXACTLY matching ConditionOptions.ts)
-- IDs are 1-based integers corresponding to wh1, wh2, etc.
INSERT INTO public.wave_heights (id, label, metric, description, image_path) VALUES
  (1, 'Ankle Biters', '< 0.3m', NULL, 'assets/images/conditions/wave-height-wh1.jpg'),
  (2, 'Below Knee', '0.3 – 0.5m', NULL, 'assets/images/conditions/wave-height-wh2.jpg'),
  (3, 'Knee to Waist', '0.5 – 0.9m', NULL, 'assets/images/conditions/wave-height-wh3.jpg'),
  (4, 'Waist to Shoulder', '0.9 – 1.5m', NULL, 'assets/images/conditions/wave-height-wh4.jpg'),
  (5, 'Head High', '~2m', NULL, 'assets/images/conditions/wave-height-wh5.jpg'),
  (6, 'Overhead (1.5x)', '2 – 3m', NULL, 'assets/images/conditions/wave-height-wh6.jpg'),
  (7, 'Double Overhead', '3 – 4m', NULL, 'assets/images/conditions/wave-height-wh7.jpg'),
  (8, 'Triple / Huge!', '4m+', NULL, 'assets/images/conditions/wave-height-wh8.jpg');

-- Insert seed data for wave qualities (EXACTLY matching ConditionOptions.ts)
-- IDs are 1-based integers corresponding to wq1, wq2, etc.
INSERT INTO public.wave_qualities (id, label, description, image_path) VALUES
  (1, 'Blown Out', 'Total mess — strong wind, no shape', 'assets/images/conditions/wave-quality-wq1.jpg'),
  (2, 'Choppy', 'Disorganized, short-period, windy', 'assets/images/conditions/wave-quality-wq2.jpg'),
  (3, 'Bumpy', 'Rideable but uneven', 'assets/images/conditions/wave-quality-wq3.jpg'),
  (4, 'Fair', 'Decent shape, a bit soft or inconsistent', 'assets/images/conditions/wave-quality-wq4.jpg'),
  (5, 'Clean', 'Well-formed, consistent lines', 'assets/images/conditions/wave-quality-wq5.jpg'),
  (6, 'Glassy', 'Dream conditions, silky smooth surface', 'assets/images/conditions/wave-quality-wq6.jpg');

-- Insert seed data for crowd levels (EXACTLY matching ConditionOptions.ts)
-- IDs are 1-based integers corresponding to c1, c2, etc.
INSERT INTO public.crowd_levels (id, label, description, icon_name, image_path) VALUES
  (1, 'Soul Session', 'Just you and your mates', 'Smile', 'assets/images/conditions/crowd-level-c1.jpg'),
  (2, 'Uncrowded', 'A few others but waves for all', 'User', 'assets/images/conditions/crowd-level-c2.jpg'),
  (3, 'Manageable', 'Quite busy but well spread out', 'Users', 'assets/images/conditions/crowd-level-c3.jpg'),
  (4, 'Busy', 'Having to compete for waves', 'Users', 'assets/images/conditions/crowd-level-c4.jpg'),
  (5, 'Hectic', 'Lucky if you get a wave', 'Frown', 'assets/images/conditions/crowd-level-c5.jpg');

-- Modify sessions table to use integer foreign keys
ALTER TABLE public.sessions 
  DROP COLUMN IF EXISTS wave_height,
  DROP COLUMN IF EXISTS wave_quality,
  DROP COLUMN IF EXISTS crowd,
  ADD COLUMN wave_height_id INTEGER REFERENCES public.wave_heights(id),
  ADD COLUMN wave_quality_id INTEGER REFERENCES public.wave_qualities(id),
  ADD COLUMN crowd_id INTEGER REFERENCES public.crowd_levels(id);
