const fs = require('fs');
const file = 'src/services/CraftingEngine.ts';
let content = fs.readFileSync(file, 'utf8');

// The base recipes that are always visible
const baseRecipes = "['campfire', 'clean_water', 'wooden_board', 'stone_axe']";

const oldAvailable = `  static async getAvailableRecipes(): Promise<CraftingRecipe[]> {
    const unlocked = await this.getUnlockedRecipes();
    return CRAFTING_RECIPES.filter(r => 
      // Base recipes are always unlocked, specific recipes like 'bread' require unlock
      r.outputId !== 'bread' || unlocked.includes(r.outputId)
    );
  }`;

const newAvailable = `  static async getAvailableRecipes(): Promise<CraftingRecipe[]> {
    const unlocked = await this.getUnlockedRecipes();
    const baseRecipes = ${baseRecipes};
    return CRAFTING_RECIPES.filter(r => 
      baseRecipes.includes(r.outputId) || unlocked.includes(r.outputId)
    );
  }

  static async checkAndUnlockRecipes(itemId: string): Promise<string[]> {
    const unlockedNow: string[] = [];
    for (const recipe of CRAFTING_RECIPES) {
       // Ignore base recipes
       if (${baseRecipes}.includes(recipe.outputId)) continue;
       
       // If the picked up item is an ingredient for this recipe
       if (recipe.ingredients.some(ing => ing.id === itemId)) {
          const didUnlock = await this.unlockRecipe(recipe.outputId);
          if (didUnlock) {
             unlockedNow.push(recipe.outputName);
          }
       }
    }
    return unlockedNow;
  }`;

content = content.replace(oldAvailable, newAvailable);
fs.writeFileSync(file, content, 'utf8');
console.log("Patched CraftingEngine.ts for all recipes");
