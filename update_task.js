const fs = require('fs');
const file = '/Users/kilian/.gemini/antigravity-ide/brain/ec9cebcb-65aa-4555-99d7-d59851eae6ee/task.md';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/- \[ \] Add \`drunkard\` and \`thief\`/g, '- [x] Add `drunkard` and `thief`');
content = content.replace(/- \[ \] Add strings to \`src\/i18n\/de\.json\`/g, '- [x] Add strings to `src/i18n/de.json`');
content = content.replace(/- \[ \] Drunkard insults/g, '- [x] Drunkard insults');
content = content.replace(/- \[ \] Thief threats and reactions/g, '- [x] Thief threats and reactions');
content = content.replace(/- \[ \] Update \`QuestEngine\.ts\`/g, '- [x] Update `QuestEngine.ts`');
content = content.replace(/- \[ \] Implement \`rob_player\` logic/g, '- [x] Implement `rob_player` logic');
content = content.replace(/- \[ \] Get inventory/g, '- [x] Get inventory');
content = content.replace(/- \[ \] Filter out quest items/g, '- [x] Filter out quest items');
content = content.replace(/- \[ \] Handle empty vs non-empty/g, '- [x] Handle empty vs non-empty');
content = content.replace(/- \[ \] Mark node as completed/g, '- [x] Mark node as completed');

fs.writeFileSync(file, content, 'utf8');
console.log("Updated task list");
