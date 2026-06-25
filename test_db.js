const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL, process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const { data, error } = await supabase
    .from('world_nodes')
    .select('osm_id, title')
    .like('osm_id', 'rnd_npc_%');

  console.log("Remaining rnd_npc_ nodes:", data?.length || 0);
  if (data?.length > 0) {
    console.log("Some titles:", data.slice(0, 5).map(d => d.title));
  }
}
run();
