-- Create spots table
CREATE TABLE IF NOT EXISTS public.spots (
  id TEXT PRIMARY KEY,
  spot_name TEXT NOT NULL,
  latitude NUMERIC(10, 7), -- Precision 10, Scale 7 for typical lat/lng
  longitude NUMERIC(10, 7), -- Precision 10, Scale 7 for typical lat/lng
  continent TEXT,
  country TEXT,
  region TEXT,
  area TEXT,
  type TEXT,
  category TEXT,
  has_spots_flag BOOLEAN DEFAULT FALSE,
  surfline_www_url TEXT,
  surfline_travel_url TEXT,
  original_depth INTEGER,
  original_enumerated_path TEXT,
  lies_in_1 TEXT,
  lies_in_2 TEXT,
  lies_in_3 TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Apply RLS policy to spots table
ALTER TABLE public.spots ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read the spots data
CREATE POLICY "Allow read access for all authenticated users on spots" ON public.spots
  FOR SELECT USING (auth.role() = 'authenticated');

-- Optional: Add an index for faster lookups on spot_name or coordinates if needed
-- CREATE INDEX IF NOT EXISTS idx_spots_spot_name ON public.spots(spot_name);
-- CREATE INDEX IF NOT EXISTS idx_spots_coordinates ON public.spots USING gist (latitude, longitude); -- For spatial queries
