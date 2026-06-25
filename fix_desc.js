const fs = require('fs');
const file = 'src/services/QuestLogEngine.ts';
let content = fs.readFileSync(file, 'utf8');

const regex = /return q;/g;
const replacement = `// Force sync descKey with titleKey
          if (q.titleKey && q.titleKey.startsWith('npc.') && q.titleKey.endsWith('.quest_title')) {
            const npcId = q.titleKey.split('.')[1];
            q.descKey = \`npc.\${npcId}.quest_desc\`;
          }
          return q;`;

content = content.replace(regex, replacement);

fs.writeFileSync(file, content, 'utf8');
console.log("Patched QuestLogEngine.ts to force sync descKey!");
