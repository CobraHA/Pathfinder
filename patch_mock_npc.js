const fs = require('fs');
let file = fs.readFileSync('src/services/questEngine.ts', 'utf8');

// Fix import
if (!file.includes("import { NPCS }")) {
  file = file.replace("import { MOCK_DB } from '../config/mockDB';", "import { MOCK_DB } from '../config/mockDB';\nimport { NPCS } from '../config/NPCData';");
}

// Fix Einsamer Wanderer in generateRichMockEnvironment
const target = `      else if (t === 'rock') { title = "Fels"; itemId = "stone_block"; }
      else if (t === 'water') { title = "Wasserquelle"; itemId = "clean_water"; }
      else if (t === 'npc') { qType = 'npc'; title = "Einsamer Wanderer"; }
      else if (t === 'campfire') { qType = 'cold_campfire'; title = "map.markers.campfire"; }

      let itemType = 'material';
      if (itemId === 'clean_water') itemType = 'consumable';

      nodes.push({
        id: \`offline_mock_\${now}_\${i}\`,
        title: title,
        type: qType,
        location: { type: 'Point', coordinates: [longitude + offsetLon, latitude + offsetLat] },
        data: qType === 'resource' ? { resource: { itemId, name: title, type: itemType, amount: 1, maxGathers: 5 } } : { name: title }
      });`;

const replacement = `      else if (t === 'rock') { title = "Fels"; itemId = "stone_block"; }
      else if (t === 'water') { title = "Wasserquelle"; itemId = "clean_water"; }
      else if (t === 'npc') { qType = 'npc'; title = "Einsamer Wanderer"; }
      else if (t === 'campfire') { qType = 'cold_campfire'; title = "map.markers.campfire"; }

      let itemType = 'material';
      if (itemId === 'clean_water') itemType = 'consumable';

      let nodeData = qType === 'resource' ? { resource: { itemId, name: title, type: itemType, amount: 1, maxGathers: 5 } } : { name: title };

      if (qType === 'npc') {
        const randomNpcDef = NPCS[Math.floor(Math.random() * NPCS.length)];
        const randomQuest = randomNpcDef.quests[Math.floor(Math.random() * randomNpcDef.quests.length)];
        title = randomNpcDef.nameKey;
        nodeData = {
          name: title,
          baseKey: randomNpcDef.id,
          quest: randomQuest,
          dialog: { start: { text: randomNpcDef.dialogStartKey } }
        };
      }

      nodes.push({
        id: \`offline_mock_\${now}_\${i}\`,
        title: title,
        type: qType,
        location: { type: 'Point', coordinates: [longitude + offsetLon, latitude + offsetLat] },
        data: nodeData
      });`;

file = file.replace(target, replacement);

fs.writeFileSync('src/services/questEngine.ts', file);
console.log("Patched mock NPCs");
