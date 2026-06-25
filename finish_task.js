const fs = require('fs');
const file = '/Users/kilian/.gemini/antigravity-ide/brain/ec9cebcb-65aa-4555-99d7-d59851eae6ee/task.md';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/- \[ \] Add `landuse=farmland`/g, '- [x] Add `landuse=farmland`');
content = content.replace(/- \[ \] Add `wheat` icon/g, '- [x] Add `wheat` icon');
content = content.replace(/- \[ \] Update `CraftingEngine\.ts`/g, '- [x] Update `CraftingEngine.ts`');
content = content.replace(/- \[ \] Add `bread` recipe/g, '- [x] Add `bread` recipe');
content = content.replace(/- \[ \] Add `unlockRecipe`/g, '- [x] Add `unlockRecipe`');
content = content.replace(/- \[ \] Update `CraftingScreen\.js`/g, '- [x] Update `CraftingScreen.js`');
content = content.replace(/- \[ \] Update `InventoryEngine\.ts`/g, '- [x] Update `InventoryEngine.ts`');
content = content.replace(/- \[ \] Add translation strings/g, '- [x] Add translation strings');

fs.writeFileSync(file, content, 'utf8');
console.log("Updated task list");
