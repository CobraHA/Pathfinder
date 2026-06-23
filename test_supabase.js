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
  console.log('Data:', JSON.stringify(data?.[0], null, 2));
}
test();
