const fs = require('fs');

const replaceInFile = (file, oldText, newText) => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(new RegExp(oldText, 'g'), newText);
  fs.writeFileSync(file, content, 'utf8');
};

// CraftingEngine.ts
replaceInFile('src/services/CraftingEngine.ts', "outputId: 'iron_sword',", "outputId: 'sword',");
replaceInFile('src/services/CraftingEngine.ts', "outputName: 'Eisenschwert',", "outputName: 'Schwert',");

// CraftingScreen.js
replaceInFile('src/screens/CraftingScreen.js', "case 'iron_sword': return 'crosshair';", "case 'sword': return 'crosshair';");

// ShopScreen.js
replaceInFile('src/screens/ShopScreen.js', "case 'iron_sword': ", "case 'sword': ");

// InventoryScreen.js
replaceInFile('src/screens/InventoryScreen.js', "case 'iron_sword': ", "case 'sword': ");

// de.json
replaceInFile('src/i18n/de.json', '"iron_sword": "Eisenschwert",', '"sword": "Schwert",');

// en.json
replaceInFile('src/i18n/en.json', '"iron_sword": "Iron Sword",', '"sword": "Sword",');

console.log("Patched all occurrences of iron_sword to sword");
