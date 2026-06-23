import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabaseClient';

const FOG_CACHE_KEY = '@rpg_visited_points';

export const FogEngine = {
  // Lädt die besuchten Punkte aus dem lokalen Speicher und synchronisiert 1x mit Supabase
  loadVisitedPoints: async () => {
    try {
      let points = [];
      const localData = await AsyncStorage.getItem(FOG_CACHE_KEY);
      if (localData) {
        points = JSON.parse(localData);
      }

      // Check user session
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('visited_points')
          .eq('id', session.user.id)
          .single();

        if (profile?.visited_points && Array.isArray(profile.visited_points)) {
          // Sehr simples Merge: Wir überschreiben der Einfachheit halber mit Server-Daten, 
          // falls der Server mehr Punkte hat (effizient).
          if (profile.visited_points.length > points.length) {
            points = profile.visited_points;
            await AsyncStorage.setItem(FOG_CACHE_KEY, JSON.stringify(points));
          }
        }
      }

      return points;
    } catch (e) {
      console.warn("Error loading fog points", e);
      return [];
    }
  },

  // Speichert einen neuen Punkt (lokal sofort, Server gedrosselt/batch)
  saveVisitedPoints: async (points) => {
    try {
      // 1. Immer lokal abspeichern (sehr schnell)
      await AsyncStorage.setItem(FOG_CACHE_KEY, JSON.stringify(points));

      // 2. Im Hintergrund in Supabase speichern (nur wenn eingeloggt)
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await supabase
          .from('profiles')
          .update({ visited_points: points })
          .eq('id', session.user.id);
      }
    } catch (e) {
      console.warn("Error saving fog points", e);
    }
  }
};
