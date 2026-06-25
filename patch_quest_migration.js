const fs = require('fs');
let file = fs.readFileSync('src/services/QuestLogEngine.ts', 'utf8');

const target = `          if ((q.titleKey && q.titleKey.startsWith('quest_title_')) || (q.descKey && q.descKey.startsWith('quest_desc_'))) {`;

const replacement = `          // Fix broken generic NPC quests
          if (q.titleKey && q.titleKey.startsWith('Auftrag von npc.')) {
            const parts = q.titleKey.split('.');
            if (parts.length >= 2) {
              const npcId = parts[1];
              q.titleKey = \`npc.\${npcId}.quest_title\`;
              q.descKey = \`npc.\${npcId}.quest_desc\`;
            }
          }

          if ((q.titleKey && q.titleKey.startsWith('quest_title_')) || (q.descKey && q.descKey.startsWith('quest_desc_'))) {`;

file = file.replace(target, replacement);

fs.writeFileSync('src/services/QuestLogEngine.ts', file);
console.log("Patched migration for generic NPC quests");
