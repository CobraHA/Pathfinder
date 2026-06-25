const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function clearOldNPCs() {
  const { data, error } = await supabase
    .from('world_nodes')
    .delete()
    .like('osm_id', 'rnd_npc_%');

  if (error) {
    console.error("Error clearing NPCs:", error);
  } else {
    console.log("Cleared old random NPCs from Supabase.");
  }
}

clearOldNPCs();
