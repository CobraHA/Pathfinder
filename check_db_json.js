const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL, process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const { data, error } = await supabase
    .from('world_nodes')
    .select('osm_id, data')
    .like('osm_id', 'rnd_npc_%')
    .limit(1);

  if (data && data.length > 0) {
    console.log(JSON.stringify(data[0], null, 2));
  } else {
    console.log("No rnd_npc_ nodes found in DB.");
  }
}
run();
