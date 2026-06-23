import { InventoryEngine, InventoryItem } from './InventoryEngine';

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
    outputId: 'iron_sword',
    outputName: 'Eisenschwert',
    outputType: 'quest_item',
    outputAmount: 1,
    ingredients: [{ id: 'iron_ingot', amount: 3 }, { id: 'wooden_board', amount: 1 }]
  },
  {
    outputId: 'stone_axe',
    outputName: 'Steinaxt',
    outputType: 'quest_item',
    outputAmount: 1,
    ingredients: [{ id: 'stone_block', amount: 2 }, { id: 'wooden_board', amount: 1 }]
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
  }
];

export class CraftingEngine {
  static getRecipes(): CraftingRecipe[] {
    return CRAFTING_RECIPES;
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
