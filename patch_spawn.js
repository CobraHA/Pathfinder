const fs = require('fs');
let file = fs.readFileSync('src/services/QuestEngine.ts', 'utf8');

const injection = `
  static async spawnTreasureMark(longitude: number, latitude: number): Promise<string> {
    const angle = Math.random() * Math.PI * 2;
    const distance = 200 + Math.random() * 600; // 200m to 800m
    const offsetLat = (distance * Math.cos(angle)) / 111320;
    const offsetLon = (distance * Math.sin(angle)) / (40075000 * Math.cos(latitude * Math.PI / 180) / 360);
    const newLat = latitude + offsetLat;
    const newLon = longitude + offsetLon;
    const osmId = 'treasure_' + Date.now() + Math.floor(Math.random() * 1000);
    
    const loot = [
      { itemId: 'copper_coins', amount: 50 + Math.floor(Math.random() * 100) },
      { itemId: 'gold_coin', amount: 1 + Math.floor(Math.random() * 3) }
    ];
    if (Math.random() > 0.5) loot.push({ itemId: 'medicine', amount: 1 });
    if (Math.random() > 0.5) loot.push({ itemId: 'iron_ore', amount: Math.floor(Math.random() * 5) + 1 });

    const newNode = {
      osm_id: osmId,
      title: "map.markers.treasure_mark",
      type: "treasure_mark",
      location: \`POINT(\${newLon} \${newLat})\`,
      data: { isLocked: false, items: loot }
    };

    try {
      await supabase.from('world_nodes').insert(newNode);
    } catch (e) {
      console.error("Error inserting treasure mark:", e);
    }
    
    return osmId;
  }
`;

if (!file.includes('static async spawnTreasureMark')) {
  file = file.replace(/static async getNodesByIds/, injection + '\n  static async getNodesByIds');
  fs.writeFileSync('src/services/QuestEngine.ts', file);
  console.log("Injected spawnTreasureMark");
}
