const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL, process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const { data, error } = await supabase
    .from('world_nodes')
    .select('id, osm_id');

  if (data) {
    const toDelete = data.filter(d => String(d.osm_id).startsWith('rnd_npc_')).map(d => d.id);
    console.log("Found", toDelete.length, "nodes to delete.");
    
    if (toDelete.length > 0) {
      const { error: delError } = await supabase
        .from('world_nodes')
        .delete()
        .in('id', toDelete);
        
      if (delError) console.error("Del Error:", delError);
      else console.log("Deleted successfully.");
    }
  }
}
run();
