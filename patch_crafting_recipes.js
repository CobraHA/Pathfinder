const fs = require('fs');
let path = 'src/services/CraftingEngine.ts';
let content = fs.readFileSync(path, 'utf8');

const newRecipes = `  {
    outputId: 'shirt',
    outputName: 'Intaktes T-Shirt',
    outputType: 'material',
    outputAmount: 1,
    ingredients: [{ id: 'broken_shirt', amount: 1 }, { id: 'fabric', amount: 2 }]
  },
  {
    outputId: 'pants',
    outputName: 'Intakte Hose',
    outputType: 'material',
    outputAmount: 1,
    ingredients: [{ id: 'broken_pants', amount: 1 }, { id: 'fabric', amount: 2 }]
  },
];`;

content = content.replace("];\n\nconst CRAFTING_XP", newRecipes + "\n\nconst CRAFTING_XP");

if (content.includes("Intaktes T-Shirt")) {
    fs.writeFileSync(path, content, 'utf8');
    console.log("Patched CraftingEngine.ts with new recipes");
} else {
    // try different replace
    content = content.replace("];\n\nexport class CraftingEngine", newRecipes + "\n\nexport class CraftingEngine");
    fs.writeFileSync(path, content, 'utf8');
    console.log("Patched CraftingEngine.ts with new recipes (fallback replace)");
}
