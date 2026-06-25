const fs = require('fs');
const file = 'src/config/NPCData.ts';
let content = fs.readFileSync(file, 'utf8');

const newNPCs = `
  {
    id: "drunkard_hostile",
    nameKey: "npc.drunkard_hostile.name",
    dialogStartKey: "npc.drunkard_hostile.start",
    quests: [{ questId: "dummy", requirement: { itemId: "dummy", amount: 1 }, xpReward: 0 }]
  },
  {
    id: "thief",
    nameKey: "npc.thief.name",
    dialogStartKey: "npc.thief.start",
    quests: [{ questId: "dummy", requirement: { itemId: "dummy", amount: 1 }, xpReward: 0 }]
  },`;

content = content.replace(/export const NPCS: NPCDefinition\[\] = \[/, "export const NPCS: NPCDefinition[] = [" + newNPCs);

fs.writeFileSync(file, content, 'utf8');
console.log("Patched NPCData.ts");
