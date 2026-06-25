const fs = require('fs');
const file = 'src/services/QuestLogEngine.ts';
let content = fs.readFileSync(file, 'utf8');

const injection = `
          // Migrate missing dynamic titles
          if (q.titleKey && q.titleKey.startsWith('quest.title.')) {
            const parts = q.titleKey.split('.');
            if (parts.length >= 3) {
              const questIdFull = parts[2]; // e.g. informant_q1
              const npcId = questIdFull.split('_')[0]; // informant
              q.titleKey = \`npc.\${npcId}.quest_title\`;
              q.descKey = \`npc.\${npcId}.quest_desc\`;
            }
          }
`;

content = content.replace(
  "// Fix broken generic NPC quests",
  injection + "\n          // Fix broken generic NPC quests"
);

fs.writeFileSync(file, content, 'utf8');
console.log("Injected migration for dynamic quests!");
