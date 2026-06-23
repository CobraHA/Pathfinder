-- Aktivieren der PostGIS Extension für Geodaten
CREATE EXTENSION IF NOT EXISTS postgis;

-- Tabellen vorher bereinigen, falls das Skript mehrmals ausgeführt wird (verhindert "relation already exists" Fehler)
DROP TABLE IF EXISTS quest_logs CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS visited_cells CASCADE;
DROP TABLE IF EXISTS world_nodes CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS factions CASCADE;

-- 1. FACTIONS TABLE
CREATE TABLE factions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    color TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Initiale Faktionen (Beispiel)
INSERT INTO factions (name, color) VALUES 
('Cyber-Syndicate', '#00ffcc'), 
('Neon-Rebels', '#ff007f') 
ON CONFLICT DO NOTHING;

-- 2. PROFILES TABLE
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    level INT DEFAULT 1,
    xp INT DEFAULT 0,
    faction_id UUID REFERENCES factions(id),
    last_location GEOMETRY(Point, 4326),
    last_location_update TIMESTAMPTZ,
    visited_points JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. WORLD NODES (POIs / Quests)
CREATE TABLE world_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    osm_id TEXT UNIQUE,
    title TEXT NOT NULL,
    type TEXT NOT NULL, -- 'quest', 'shop', 'landmark'
    location GEOMETRY(Point, 4326) NOT NULL,
    data JSONB DEFAULT '{}'::jsonb, -- Für spezifische Quest-Parameter
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX world_nodes_location_idx ON world_nodes USING GIST (location);

-- 4. INVENTORY
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    item_id TEXT NOT NULL,
    quantity INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(profile_id, item_id)
);

-- 5. QUEST LOGS
CREATE TABLE quest_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    node_id UUID REFERENCES world_nodes(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL DEFAULT 'active', -- 'active', 'completed', 'failed'
    progress JSONB DEFAULT '{}'::jsonb,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    UNIQUE(profile_id, node_id)
);

-- 6. VISITED CELLS (Fog of War als Polygone)
CREATE TABLE visited_cells (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    geom GEOMETRY(Polygon, 4326) NOT NULL,
    visited_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX visited_cells_geom_idx ON visited_cells USING GIST (geom);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================
ALTER TABLE factions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE world_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE quest_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE visited_cells ENABLE ROW LEVEL SECURITY;

-- Factions & World Nodes: Jeder kann lesen, nur Admins schreiben (hier vereinfacht: Insert nur via Service Key)
CREATE POLICY "Public factions are viewable by everyone." ON factions FOR SELECT USING (true);
CREATE POLICY "Public world_nodes are viewable by everyone." ON world_nodes FOR SELECT USING (true);

-- Profiles: User können nur ihr eigenes Profil bearbeiten, aber andere sehen
CREATE POLICY "Users can view all profiles." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- Inventory: User sehen und verändern nur eigenes Inventar
CREATE POLICY "Users can view own inventory." ON inventory FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can manage own inventory." ON inventory FOR ALL USING (auth.uid() = profile_id);

-- Quest Logs: User sehen und verändern nur eigene Quests
CREATE POLICY "Users can view own quests." ON quest_logs FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can manage own quests." ON quest_logs FOR ALL USING (auth.uid() = profile_id);

-- Visited Cells: User sehen und erstellen nur eigene Polygone
CREATE POLICY "Users can view own visited cells." ON visited_cells FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can insert own visited cells." ON visited_cells FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- ==========================================
-- FUNCTIONS
-- ==========================================

-- Function: get_nearby_quests
-- Gibt Quests und NPCs im Radius von X Metern zurück. Nutzt ST_DWithin für Performance auf der geography Form (in Metern).
DROP FUNCTION IF EXISTS get_nearby_quests(DOUBLE PRECISION, DOUBLE PRECISION, DOUBLE PRECISION);
CREATE OR REPLACE FUNCTION get_nearby_quests(
  p_longitude DOUBLE PRECISION,
  p_latitude DOUBLE PRECISION,
  p_radius_meters DOUBLE PRECISION DEFAULT 9999999 -- Global abrufbar für NPCs
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  type TEXT,
  distance_meters DOUBLE PRECISION,
  data JSONB,
  location JSONB
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    wn.id,
    wn.title,
    wn.type,
    ST_DistanceSphere(wn.location, ST_SetSRID(ST_MakePoint(p_longitude, p_latitude), 4326)) AS distance_meters,
    wn.data,
    ST_AsGeoJSON(wn.location)::jsonb AS location
  FROM world_nodes wn
  WHERE ST_DWithin(
    wn.location::geography, 
    ST_SetSRID(ST_MakePoint(p_longitude, p_latitude), 4326)::geography, 
    p_radius_meters
  )
  AND wn.type IN ('quest', 'npc', 'resource')
  ORDER BY distance_meters ASC;
$$;

-- ==========================================
-- 7. INITIALE NPCs (Hannover)
-- ==========================================
INSERT INTO world_nodes (title, type, location, data) VALUES 
(
  'Schmied Garrosh', 
  'npc', 
  ST_SetSRID(ST_MakePoint(9.7353, 52.3718), 4326), -- Marktkirche
  '{
    "dialog": {
      "start": {
        "text": "Ah, ein Reisender! Mein Feuer erlischt fast und mir geht das Eisen aus. Hast du etwas Zeit für einen alten Schmied?",
        "options": [
          { "label": "Womit kann ich helfen?", "next": "ask_trade" },
          { "label": "Ich habe es eilig.", "next": "end" }
        ]
      },
      "ask_trade": {
        "text": "Wenn du mir 3 Eisenerze aus den Minen vor der Stadt bringen könntest, würde ich dir ein gutes Schwert schmieden.",
        "options": [
          { "label": "Hier sind die 3 Eisenerze.", "action": "trade_iron" },
          { "label": "Ich werde dir das Erz besorgen. (Quest annehmen)", "next": "accept_quest" },
          { "label": "Vielleicht später.", "next": "end" }
        ]
      },
      "accept_quest": {
        "text": "Mögen die Götter dich schützen! Kehre zurück, wenn du das Erz hast.",
        "action": "give_quest",
        "options": [
          { "label": "Leb wohl.", "next": "end" }
        ]
      }
    }
  }'::jsonb
),
(
  'Mönch Alkuin', 
  'npc', 
  ST_SetSRID(ST_MakePoint(9.7386, 52.3744), 4326), -- Kröpcke
  '{
    "dialog": {
      "start": {
        "text": "Friede sei mit dir. Die Pestilenz greift um sich, wir benötigen dringend Kräuter für unsere Heiltränke.",
        "options": [
          { "label": "Wie kann ich helfen, Vater?", "next": "ask_trade" },
          { "label": "Ich muss weiter.", "next": "end" }
        ]
      },
      "ask_trade": {
        "text": "Finde 5 Heilwurzeln in den Wäldern im Osten. Der Orden wird dich fürstlich entlohnen.",
        "options": [
          { "label": "Ich mache mich auf den Weg. (Quest annehmen)", "next": "accept_quest" },
          { "label": "Dafür fehlt mir die Zeit.", "next": "end" }
        ]
      },
      "accept_quest": {
        "text": "Der Segen sei mit dir. Beeil dich!",
        "action": "give_quest",
        "options": [
          { "label": "Bis bald.", "next": "end" }
        ]
      }
    }
  }'::jsonb
),
(
  'Wache Leif', 
  'npc', 
  ST_SetSRID(ST_MakePoint(9.7410, 52.3769), 4326), -- Hauptbahnhof
  '{
    "dialog": {
      "start": {
        "text": "Halt! Wer geht da? In letzter Zeit treiben sich Banditen vor den Toren Hannovers herum.",
        "options": [
          { "label": "Ich bin nur ein friedlicher Abenteurer.", "next": "ask_trade" },
          { "label": "Lass mich durch, Wache.", "next": "end" }
        ]
      },
      "ask_trade": {
        "text": "Dann beweise es. Der Hauptmann zahlt 50 Goldstücke für das Amulett des Banditenanführers.",
        "options": [
          { "label": "Ich kümmere mich um die Banditen. (Quest annehmen)", "next": "accept_quest" },
          { "label": "Kein Interesse an Kopfgeldjagden.", "next": "end" }
        ]
      },
      "accept_quest": {
        "text": "Pass auf deinen Rücken auf. Die Schurken kennen keine Gnade.",
        "action": "give_quest",
        "options": [
          { "label": "Das werde ich.", "next": "end" }
        ]
      }
    }
  }'::jsonb
),
(
  'Klares Flusswasser', 
  'resource', 
  ST_SetSRID(ST_MakePoint(9.7310, 52.3725), 4326), -- Leine
  '{
    "resource": {
      "itemId": "water_flask",
      "name": "Flasche Wasser",
      "type": "consumable",
      "amount": 1
    }
  }'::jsonb
),
(
  'Eisenerz-Ader', 
  'resource', 
  ST_SetSRID(ST_MakePoint(9.7300, 52.3770), 4326), -- Steintor Bereich
  '{
    "resource": {
      "itemId": "iron_ore",
      "name": "Eisenerz",
      "type": "material",
      "amount": 1
    }
  }'::jsonb
),
(
  'Seltene Heilwurzel', 
  'resource', 
  ST_SetSRID(ST_MakePoint(9.7360, 52.3650), 4326), -- Maschpark
  '{
    "resource": {
      "itemId": "herb_root",
      "name": "Heilwurzel",
      "type": "material",
      "amount": 1
    }
  }'::jsonb
);
-- Allow users to insert world nodes (for OSM seeding)
CREATE POLICY "Public world_nodes are insertable by everyone." ON world_nodes FOR INSERT WITH CHECK (true);
