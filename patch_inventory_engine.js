const fs = require('fs');
const file = 'src/services/InventoryEngine.ts';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes("import { CraftingEngine } from './CraftingEngine';")) {
  content = content.replace(/import AsyncStorage from '@react-native-async-storage\/async-storage';/, "import AsyncStorage from '@react-native-async-storage/async-storage';\nimport { CraftingEngine } from './CraftingEngine';\nimport { Alert } from 'react-native';\nimport i18n from '../i18n';");
}

const oldAddItem = `  static async addItem(item: any, quantity: number = 1): Promise<void> {`;
const newAddItem = `  static async addItem(item: any, quantity: number = 1): Promise<void> {
    const itemId = typeof item === 'string' ? item : item.id;
    if (itemId === 'wheat') {
      const unlocked = await CraftingEngine.unlockRecipe('bread');
      if (unlocked) {
        Alert.alert(
          i18n.t('crafting.new_recipe_title', { defaultValue: 'Neues Rezept!' }),
          i18n.t('crafting.new_recipe_desc', { defaultValue: 'Du hast gelernt, wie man Brot herstellt!' })
        );
      }
    }
`;

if (!content.includes("CraftingEngine.unlockRecipe('bread')")) {
  content = content.replace(oldAddItem, newAddItem);
  fs.writeFileSync(file, content, 'utf8');
}

console.log("Patched InventoryEngine.ts");
