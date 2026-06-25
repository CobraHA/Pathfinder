const fs = require('fs');
const file = 'src/services/CraftingEngine.ts';
let content = fs.readFileSync(file, 'utf8');

// Add bread recipe
if (!content.includes("outputId: 'bread'")) {
  const newRecipe = `  {
    outputId: 'bread',
    outputName: 'Brot',
    outputType: 'consumable',
    outputAmount: 1,
    ingredients: [{ id: 'wheat', amount: 3 }, { id: 'clean_water', amount: 1 }, { id: 'wood_log', amount: 1 }]
  },
];`;
  content = content.replace(/];/, newRecipe);
}

// Add Async Storage import and unlock logic
if (!content.includes('import AsyncStorage')) {
  content = content.replace(/import \{ InventoryEngine, InventoryItem \} from '.\/InventoryEngine';/, "import { InventoryEngine, InventoryItem } from './InventoryEngine';\nimport AsyncStorage from '@react-native-async-storage/async-storage';");
}

if (!content.includes('static async unlockRecipe')) {
  const newLogic = `
  static async getUnlockedRecipes(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem('@crafting_unlocked');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  static async unlockRecipe(recipeId: string): Promise<boolean> {
    try {
      const unlocked = await this.getUnlockedRecipes();
      if (!unlocked.includes(recipeId)) {
        unlocked.push(recipeId);
        await AsyncStorage.setItem('@crafting_unlocked', JSON.stringify(unlocked));
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  static async getAvailableRecipes(): Promise<CraftingRecipe[]> {
    const unlocked = await this.getUnlockedRecipes();
    return CRAFTING_RECIPES.filter(r => 
      // Base recipes are always unlocked, specific recipes like 'bread' require unlock
      r.outputId !== 'bread' || unlocked.includes(r.outputId)
    );
  }
`;
  content = content.replace(/static getRecipes\(\): CraftingRecipe\[\] \{[\s\S]*?\}/, "static getRecipes(): CraftingRecipe[] {\n    return CRAFTING_RECIPES;\n  }\n" + newLogic);
}

fs.writeFileSync(file, content, 'utf8');
console.log("Patched CraftingEngine.ts");
