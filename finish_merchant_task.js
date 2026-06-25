const fs = require('fs');
const file = '/Users/kilian/.gemini/antigravity-ide/brain/ec9cebcb-65aa-4555-99d7-d59851eae6ee/task.md';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/- \[ \] Update `QuestEngine\.ts`/g, '- [x] Update `QuestEngine.ts`');
content = content.replace(/- \[ \] Update `MapScreen\.js`/g, '- [x] Update `MapScreen.js`');
content = content.replace(/- \[ \] Update `ShopEngine\.ts`/g, '- [x] Update `ShopEngine.ts`');
content = content.replace(/- \[ \] Update `ShopScreen\.js`/g, '- [x] Update `ShopScreen.js`');
content = content.replace(/- \[ \] Update `de\.json`/g, '- [x] Update `de.json`');

fs.writeFileSync(file, content, 'utf8');
console.log("Updated task list");
