const fs = require('fs');
let file = fs.readFileSync('src/services/questEngine.ts', 'utf8');

const target1 = `              questTitle: "Auftrag von " + npcTitle,
              questDesc: "Sammle die geforderten Gegenstände.",`;

const replacement1 = `              questTitle: \`npc.\${randomNpcDef.id}.quest_title\`,
              questDesc: \`npc.\${randomNpcDef.id}.quest_desc\`,`;

file = file.replace(target1, replacement1);

const target2 = `              questTitle: "Auftrag von " + title,
              questDesc: "Sammle die geforderten Gegenstände.",`;

const replacement2 = `              questTitle: \`npc.\${randomNpcDef.id}.quest_title\`,
              questDesc: \`npc.\${randomNpcDef.id}.quest_desc\`,`;

file = file.replace(target2, replacement2);

fs.writeFileSync('src/services/questEngine.ts', file);
console.log("Patched quest titles to use translation keys");
