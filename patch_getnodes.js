const fs = require('fs');

let file = fs.readFileSync('src/services/QuestEngine.ts', 'utf8');

const injection = `
  static async getNodesByIds(ids: string[]): Promise<any[]> {
    if (!ids || ids.length === 0) return [];
    
    let results: any[] = [];
    
    // Check MOCK_DB
    MOCK_DB.forEach(m => {
      if (ids.includes(m.id)) results.push(m);
    });

    // Check offline cache
    this.mockEnvironmentCache.forEach(m => {
      if (ids.includes(m.id)) results.push(m);
    });

    // Check generated chests
    // (We don't cache generated chests statically, but we can skip them for now since they are not quests)

    const remainingIds = ids.filter(id => !results.find(r => r.id === id));
    if (remainingIds.length > 0) {
      try {
        const { data } = await supabase.from('world_nodes').select('*').in('osm_id', remainingIds);
        if (data) {
          data.forEach((n: any) => {
            let lon = 0, lat = 0;
            if (n.location) {
              if (typeof n.location === 'string' && n.location.startsWith('POINT')) {
                const coords = n.location.replace('POINT(', '').replace(')', '').split(' ');
                lon = parseFloat(coords[0]);
                lat = parseFloat(coords[1]);
              } else if (n.location.type === 'Point' && Array.isArray(n.location.coordinates)) {
                lon = n.location.coordinates[0];
                lat = n.location.coordinates[1];
              }
            }
            results.push({
              id: n.osm_id,
              title: n.title,
              type: n.type,
              location: { type: 'Point', coordinates: [lon, lat] },
              data: n.data
            });
          });
        }
      } catch (e) {
        console.error("Error fetching getNodesByIds from Supabase:", e);
      }
    }

    return results;
  }
`;

if (!file.includes('static async getNodesByIds')) {
  file = file.replace(/static async checkNearbyQuests/, injection + '\n  static async checkNearbyQuests');
  fs.writeFileSync('src/services/QuestEngine.ts', file);
  console.log("Injected getNodesByIds into QuestEngine.ts");
} else {
  console.log("getNodesByIds already exists");
}
