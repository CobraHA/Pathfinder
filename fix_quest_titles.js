const fs = require('fs');
const file = 'src/services/QuestEngine.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /questTitle: \`quest\.title\.\$\{randomQuest\.questId\}\`,/g,
  'questTitle: `npc.${randomNpcDef.id}.quest_title`,'
);

content = content.replace(
  /questDesc: \`quest\.desc\.\$\{randomQuest\.questId\}\`,/g,
  'questDesc: `npc.${randomNpcDef.id}.quest_desc`,'
);

fs.writeFileSync(file, content, 'utf8');
console.log("Fixed quest title keys in QuestEngine.ts!");
