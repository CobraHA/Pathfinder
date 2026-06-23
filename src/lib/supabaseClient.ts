import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  username: string;
  level: number;
  xp: number;
  faction_id: string;
  last_location: any;
  last_location_update: string;
};

export type WorldNode = {
  id: string;
  title: string;
  type: string;
  location: any;
  data: any;
};

export type QuestResponse = {
  id: string;
  title: string;
  type: string;
  distance_meters: number;
  data: any;
};
