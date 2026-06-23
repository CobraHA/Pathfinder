require('dotenv').config({path: '.env'});
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://example.supabase.co';
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'fake-key';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.rpc('get_nearby_quests', {
    p_longitude: 9.7353,
    p_latitude: 52.3718,
    p_radius_meters: 50000
  });

  const uniqueData = data || [];
  
  const processed = uniqueData.map(q => {
    let qLoc = q.location;
    if (typeof qLoc === 'string') {
      try { qLoc = JSON.parse(qLoc); } catch (e) {}
    }
    
    let qLat = qLoc?.coordinates?.[1];
    let qLon = qLoc?.coordinates?.[0];
    if (qLoc?.type === 'Point' && Array.isArray(qLoc?.coordinates)) {
      qLon = qLoc.coordinates[0];
      qLat = qLoc.coordinates[1];
    }
    return {
      title: q.title,
      qLat,
      qLon,
      distance: q.distance_meters,
      renderLat: q.location?.coordinates?.[1] || 52.3718 + 0.001
    };
  });
  console.log(processed);
}
test();
