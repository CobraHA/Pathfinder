const fs = require('fs');
const file = 'src/services/QuestEngine.ts';
let content = fs.readFileSync(file, 'utf8');

const regexImport = /import AsyncStorage from '@react-native-async-storage\/async-storage';/;
if (!content.match(regexImport)) {
  content = "import AsyncStorage from '@react-native-async-storage/async-storage';\n" + content;
}

const getScannedAreasCode = `
  static async getScannedAreas(): Promise<{lat: number, lon: number}[]> {
    try {
      const data = await AsyncStorage.getItem('SCANNED_AREAS');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  static async addScannedArea(lat: number, lon: number) {
    try {
      const areas = await this.getScannedAreas();
      areas.push({ lat, lon });
      // Keep only last 50 to prevent infinite growth
      if (areas.length > 50) areas.shift();
      await AsyncStorage.setItem('SCANNED_AREAS', JSON.stringify(areas));
    } catch (e) {}
  }
`;

if (!content.includes('getScannedAreas()')) {
  content = content.replace(/export class QuestEngine \{/, "export class QuestEngine {\n" + getScannedAreasCode);
}

const checkLogicRegex = /\/\/ If local area is empty or barely populated, procedurally fetch from OSM to seed the DB\n\s*if \(\!data \|\| localNodesCount < 10\) \{/;

const newCheckLogic = `
      // Check if we are near a previously scanned area (within 400m)
      const scannedAreas = await this.getScannedAreas();
      const isAlreadyScanned = scannedAreas.some(area => getDistance(latitude, longitude, area.lat, area.lon) < 400);

      // If local area is empty or barely populated AND we haven't scanned it yet, fetch from OSM
      if (!isAlreadyScanned && (!data || localNodesCount < 10)) {
        await this.addScannedArea(latitude, longitude);
`;

content = content.replace(checkLogicRegex, newCheckLogic);

// Change Supabase RPC radius from 1200 to 500
content = content.replace(/p_radius_meters: 1200/, 'p_radius_meters: 500');

fs.writeFileSync(file, content, 'utf8');
console.log("Patched QuestEngine.ts with spatial caching!");
