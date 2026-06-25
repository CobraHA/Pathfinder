const fs = require('fs');
const file = 'src/screens/CraftingScreen.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/setRecipes\(CraftingEngine\.getRecipes\(\)\);/, "setRecipes(await CraftingEngine.getAvailableRecipes());");

fs.writeFileSync(file, content, 'utf8');
console.log("Patched CraftingScreen.js");
