const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL, process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  console.log("Deleting all rnd_npc_ nodes from Supabase...");
  const { data, error } = await supabase
    .from('world_nodes')
    .delete()
    .like('osm_id', 'rnd_npc_%');

  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Successfully deleted all rnd_npc_ nodes.");
  }
}
run();
