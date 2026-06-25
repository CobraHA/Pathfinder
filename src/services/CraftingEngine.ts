import { InventoryEngine, InventoryItem } from './InventoryEngine';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CraftingRecipe {
  outputId: string;
  outputName: string; // fallback if no translation
  outputType: 'consumable' | 'material' | 'quest_item';
  outputAmount: number;
  ingredients: { id: string; amount: number }[];
}

export const CRAFTING_RECIPES: CraftingRecipe[] = [
  {
    outputId: 'healing_potion',
    outputName: 'Heiltrank',
    outputType: 'consumable',
    outputAmount: 1,
    ingredients: [{ id: 'clean_water', amount: 1 }, { id: 'herb_root', amount: 2 }]
  },
  {
    outputId: 'iron_ingot',
    outputName: 'Eisenbarren',
    outputType: 'material',
    outputAmount: 1,
    ingredients: [{ id: 'iron_ore', amount: 2 }]
  },
  {
    outputId: 'wooden_board',
    outputName: 'Holzbrett',
    outputType: 'material',
    outputAmount: 1,
    ingredients: [{ id: 'wood_log', amount: 2 }]
  },
  {
    outputId: 'sword',
    outputName: 'Schwert',
    outputType: 'quest_item',
    outputAmount: 1,
    ingredients: [{ id: 'iron_ingot', amount: 2 }, { id: 'stone_block', amount: 1 }, { id: 'wooden_board', amount: 1 }]
  },
  {
    outputId: 'knife',
    outputName: 'Messer',
    outputType: 'quest_item',
    outputAmount: 1,
    ingredients: [{ id: 'iron_ingot', amount: 1 }, { id: 'stick', amount: 1 }]
  },
  {
    outputId: 'stone_axe',
    outputName: 'Steinaxt',
    outputType: 'quest_item',
    outputAmount: 1,
    ingredients: [{ id: 'stone_block', amount: 3 }, { id: 'wooden_board', amount: 1 }]
  },
  {
    outputId: 'iron_pickaxe',
    outputName: 'Eisenspitzhacke',
    outputType: 'quest_item',
    outputAmount: 1,
    ingredients: [{ id: 'iron_ingot', amount: 3 }, { id: 'wooden_board', amount: 1 }]
  },
  {
    outputId: 'stone_pickaxe',
    outputName: 'Steinspitzhacke',
    outputType: 'quest_item',
    outputAmount: 1,
    ingredients: [{ id: 'stone_block', amount: 3 }, { id: 'wooden_board', amount: 1 }]
  },
  {
    outputId: 'iron_axe',
    outputName: 'Eisenaxt',
    outputType: 'quest_item',
    outputAmount: 1,
    ingredients: [{ id: 'iron_ingot', amount: 3 }, { id: 'wooden_board', amount: 1 }]
  },
  {
    outputId: 'bandit_amulet',
    outputName: 'Banditen-Amulett',
    outputType: 'quest_item',
    outputAmount: 1,
    ingredients: [{ id: 'iron_ingot', amount: 1 }, { id: 'stone_block', amount: 1 }]
  },
  {
    outputId: 'campfire',
    outputName: 'Lagerfeuer',
    outputType: 'consumable',
    outputAmount: 1,
    ingredients: [{ id: 'wood_log', amount: 3 }, { id: 'stone_block', amount: 1 }]
  },
  {
    outputId: 'herbal_tea',
    outputName: 'Kräutertee',
    outputType: 'consumable',
    outputAmount: 1,
    ingredients: [{ id: 'clean_water', amount: 1 }, { id: 'herb_root', amount: 1 }, { id: 'wood_log', amount: 1 }]
  },
  {
    outputId: 'stone_pickaxe',
    outputName: 'Steinspitzhacke',
    outputType: 'quest_item',
    outputAmount: 1,
    ingredients: [{ id: 'stone_block', amount: 3 }, { id: 'wooden_board', amount: 1 }]
  },
  {
    outputId: 'lockpick',
    outputName: 'Dietrich',
    outputType: 'quest_item',
    outputAmount: 2,
    ingredients: [{ id: 'iron_ingot', amount: 1 }]
  },
  {
    outputId: 'roasted_meat',
    outputName: 'Gebratenes Fleisch',
    outputType: 'consumable',
    outputAmount: 1,
    ingredients: [{ id: 'raw_meat', amount: 1 }, { id: 'wood_log', amount: 1 }]
  },
  {
    outputId: 'clean_water',
    outputName: 'Trinkwasser',
    outputType: 'consumable',
    outputAmount: 1,
    ingredients: [{ id: 'dirty_water', amount: 1 }, { id: 'wood_log', amount: 1 }]
  },
  {
    outputId: 'salt',
    outputName: 'Salz',
    outputType: 'material',
    outputAmount: 1,
    ingredients: [{ id: 'salt_water', amount: 1 }, { id: 'wood_log', amount: 1 }]
  },
  {
    outputId: 'bread',
    outputName: 'Brot',
    outputType: 'consumable',
    outputAmount: 1,
    ingredients: [{ id: 'wheat', amount: 3 }, { id: 'clean_water', amount: 1 }, { id: 'wood_log', amount: 1 }]
  },
  {
    outputId: 'shirt',
    outputName: 'T-Shirt',
    outputType: 'material',
    outputAmount: 1,
    ingredients: [{ id: 'broken_shirt', amount: 1 }, { id: 'fabric', amount: 2 }]
  },
  {
    outputId: 'pants',
    outputName: 'Hose',
    outputType: 'material',
    outputAmount: 1,
    ingredients: [{ id: 'broken_pants', amount: 1 }, { id: 'fabric', amount: 2 }]
  },
];

export class CraftingEngine {
  static getRecipes(): CraftingRecipe[] {
    return CRAFTING_RECIPES;
  }

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
    const baseRecipes = ['campfire', 'clean_water', 'wooden_board', 'stone_axe'];
    return CRAFTING_RECIPES.filter(r =>
      baseRecipes.includes(r.outputId) || unlocked.includes(r.outputId)
    );
  }

  static async checkAndUnlockRecipes(itemId: string): Promise<string[]> {
    const unlockedNow: string[] = [];
    for (const recipe of CRAFTING_RECIPES) {
      // Ignore base recipes
      if (['campfire', 'clean_water', 'wooden_board', 'stone_axe'].includes(recipe.outputId)) continue;

      // If the picked up item is an ingredient for this recipe
      if (recipe.ingredients.some(ing => ing.id === itemId)) {
        const didUnlock = await this.unlockRecipe(recipe.outputId);
        if (didUnlock) {
          unlockedNow.push(recipe.outputName);
        }
      }
    }
    return unlockedNow;
  }


  static async canCraft(recipe: CraftingRecipe): Promise<boolean> {
    for (const ingredient of recipe.ingredients) {
      const hasEnough = await InventoryEngine.hasItem(ingredient.id, ingredient.amount);
      if (!hasEnough) return false;
    }
    return true;
  }

  static async craftItem(recipeId: string): Promise<{ success: boolean; message: string }> {
    const recipe = CRAFTING_RECIPES.find(r => r.outputId === recipeId);
    if (!recipe) return { success: false, message: 'Rezept nicht gefunden' };

    const canCraft = await this.canCraft(recipe);
    if (!canCraft) return { success: false, message: 'Nicht genug Materialien' };

    // Deduct ingredients
    for (const ingredient of recipe.ingredients) {
      await InventoryEngine.removeItem(ingredient.id, ingredient.amount);
    }

    // Add output
    await InventoryEngine.addItem({
      id: recipe.outputId,
      name: recipe.outputName,
      type: recipe.outputType
    }, recipe.outputAmount);

    return { success: true, message: 'Erfolgreich hergestellt!' };
  }
}
