import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Config: max. 15 m/s (ca. 54 km/h) als Limit für Anti-Cheat
const MAX_SPEED_M_S = 15;

serve(async (req) => {
  try {
    const { longitude, latitude } = await req.json();
    
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response("Unauthorized", { status: 401 });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new Response("Unauthorized", { status: 401 });

    // Hole das Profil mit der letzten Location
    const { data: profile } = await supabase
      .from('profiles')
      .select('last_location, last_location_update')
      .eq('id', user.id)
      .single();

    if (profile && profile.last_location && profile.last_location_update) {
      const lastUpdate = new Date(profile.last_location_update);
      const now = new Date();
      const secondsDiff = (now.getTime() - lastUpdate.getTime()) / 1000;

      // Distanzprüfung (vereinfacht über eine Supabase RPC oder direkt in DB via Trigger)
      // Wir nehmen hier der Einfachheit halber an, dass wir eine Funktion 'calculate_distance' haben
      const { data: distanceData } = await supabase.rpc('calculate_distance', {
        lon1: profile.last_location.coordinates[0],
        lat1: profile.last_location.coordinates[1],
        lon2: longitude,
        lat2: latitude
      });

      if (distanceData) {
        const speed = distanceData / secondsDiff;
        if (speed > MAX_SPEED_M_S) {
          // Setze Suspect-Status bei Cheating
          await supabase.from('profiles').update({ is_suspect: true }).eq('id', user.id);
          return new Response(JSON.stringify({ error: "Movement too fast. Cheat detected." }), { status: 403 });
        }
      }
    }

    // Speichere die neue Location im Profil (und erstelle optional die besuchte Zelle)
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        last_location: `POINT(${longitude} ${latitude})`,
        last_location_update: new Date().toISOString()
      })
      .eq('id', user.id);

    if (updateError) throw updateError;

    return new Response(JSON.stringify({ success: true, message: "Location valid and updated." }), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(String(err), { status: 500 });
  }
});
