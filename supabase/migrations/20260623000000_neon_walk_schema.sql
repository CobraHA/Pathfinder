-- Extension für PostGIS aktivieren
CREATE EXTENSION IF NOT EXISTS postgis;

-- Tabelle für Profile (falls nicht vorhanden)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username text,
  level int DEFAULT 1,
  last_location geometry(POINT, 4326),
  last_location_update timestamptz DEFAULT now(),
  is_suspect boolean DEFAULT false
);

-- Index für Location auf Profile
CREATE INDEX IF NOT EXISTS profiles_last_location_idx ON public.profiles USING GIST (last_location);

-- Tabelle für World Nodes
CREATE TABLE IF NOT EXISTS public.world_nodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  osm_id text UNIQUE,
  type text NOT NULL, -- e.g. 'water', 'forest', 'monument'
  location geometry(POINT, 4326) NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- GIST Index für Spatial Queries
CREATE INDEX IF NOT EXISTS world_nodes_location_idx ON public.world_nodes USING GIST (location);

-- RPC Funktion für Distanz-Berechnung
CREATE OR REPLACE FUNCTION calculate_distance(lon1 float, lat1 float, lon2 float, lat2 float)
RETURNS float AS $$
BEGIN
  RETURN ST_DistanceSphere(
    ST_SetSRID(ST_MakePoint(lon1, lat1), 4326),
    ST_SetSRID(ST_MakePoint(lon2, lat2), 4326)
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- RPC Funktion für prozedurale Quest-Generierung
CREATE OR REPLACE FUNCTION get_nearby_quests(p_latitude float, p_longitude float, p_radius_meters float DEFAULT 500)
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  SELECT json_agg(
    json_build_object(
      'id', id,
      'type', type,
      'distance_meters', ST_DistanceSphere(location, ST_SetSRID(ST_MakePoint(p_longitude, p_latitude), 4326)),
      'location', ST_AsGeoJSON(location)::jsonb,
      'data', metadata
    )
  )
  INTO result
  FROM public.world_nodes
  WHERE ST_DWithin(
    location::geography,
    ST_SetSRID(ST_MakePoint(p_longitude, p_latitude), 4326)::geography,
    p_radius_meters
  )
  LIMIT 20;
  
  RETURN COALESCE(result, '[]'::json);
END;
$$ LANGUAGE plpgsql;
