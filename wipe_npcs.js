require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function wipeNpcs() {
  console.log("Wiping NPCs from Supabase...");
  const { data, error } = await supabase
    .from('world_nodes')
    .delete()
    .eq('type', 'npc');

  if (error) {
    console.error("Error wiping NPCs:", error);
  } else {
    console.log("Successfully wiped NPCs from world_nodes cache!");
  }
}

wipeNpcs();
