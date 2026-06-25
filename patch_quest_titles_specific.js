const fs = require('fs');
let file = fs.readFileSync('src/services/questEngine.ts', 'utf8');

const target = `              questTitle: \`npc.\${randomNpcDef.id}.quest_title\`,
              questDesc: \`npc.\${randomNpcDef.id}.quest_desc\`,`;

const replacement = `              questTitle: \`quest.title.\${randomQuest.questId}\`,
              questDesc: \`quest.desc.\${randomQuest.questId}\`,`;

file = file.replaceAll(target, replacement);

fs.writeFileSync('src/services/questEngine.ts', file);
console.log("Patched questEngine to use specific questIds for titles");
