const fs = require('fs');

let file = fs.readFileSync('src/services/QuestEngine.ts', 'utf8');

// 1. Change p_radius_meters from 5000 to 1200
file = file.replace(/p_radius_meters: 5000/g, "p_radius_meters: 1200");

// 2. Inject random NPCs inside fetchAndSeedOSM before upserting
const injectPoint = `      console.log(\`[QuestEngine] Mapped \${newNodes.length} nodes from Overpass elements.\`);`;
const injectCode = `
      // --- INJECT RANDOM NPCS ---
      const npcCount = Math.floor(Math.random() * 3) + 2; // 2 to 4 NPCs
      const npcNames = [
        'map.markers.survivor_barista',
        'map.markers.trader_bot',
        'map.markers.drunk_informant',
        'Alkuin der Alchemist',
        'Leif der Holzfäller',
        'Garrosh der Schmied',
        'Einsamer Wanderer'
      ];
      for (let i = 0; i < npcCount; i++) {
        const offsetLat = (Math.random() - 0.5) * 0.008;
        const offsetLon = (Math.random() - 0.5) * 0.008;
        const npcLat = latitude + offsetLat;
        const npcLon = longitude + offsetLon;
        const npcTitle = npcNames[Math.floor(Math.random() * npcNames.length)];
        
        let dialogStart = "map.dialogs.trader";
        if (npcTitle.includes("barista")) dialogStart = "map.dialogs.survivor_barista";
        if (npcTitle.includes("informant")) dialogStart = "map.dialogs.drunk_informant";
        if (npcTitle.includes("Alkuin")) dialogStart = "map.dialogs.alkuin";
        if (npcTitle.includes("Leif")) dialogStart = "map.dialogs.leif";
        if (npcTitle.includes("Garrosh")) dialogStart = "map.dialogs.garrosh";
        if (npcTitle.includes("Wanderer")) dialogStart = "map.dialogs.beggar";

        const npcOsmId = 'rnd_npc_' + Date.now() + '_' + i;
        const npcData = {
          name: npcTitle,
          dialogStart: dialogStart
        };

        newNodes.push({
          osm_id: npcOsmId,
          title: npcTitle,
          type: 'npc',
          location: \`POINT(\${npcLon} \${npcLat})\`,
          data: npcData
        });

        localQuests.push({
          id: npcOsmId,
          title: npcTitle,
          type: 'npc',
          distance_meters: getDistance(latitude, longitude, npcLat, npcLon),
          location: { type: 'Point', coordinates: [npcLon, npcLat] },
          data: npcData
        });
      }
      console.log(\`[QuestEngine] Injected \${npcCount} random NPCs.\`);
      // --------------------------
`;

if (!file.includes("INJECT RANDOM NPCS")) {
  file = file.replace(injectPoint, injectPoint + injectCode);
}

fs.writeFileSync('src/services/QuestEngine.ts', file);
console.log("Patched QuestEngine.ts successfully.");
