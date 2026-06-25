const fs = require('fs');
const file = 'src/services/InventoryEngine.ts';
let content = fs.readFileSync(file, 'utf8');

const oldLogic = `    if (itemId === 'wheat') {
      const unlocked = await CraftingEngine.unlockRecipe('bread');
      if (unlocked) {
        Alert.alert(
          i18n.t('crafting.new_recipe_title', { defaultValue: 'Neues Rezept!' }),
          i18n.t('crafting.new_recipe_desc', { defaultValue: 'Du hast gelernt, wie man Brot herstellt!' })
        );
      }
    }`;

const newLogic = `    const newlyUnlocked = await CraftingEngine.checkAndUnlockRecipes(itemId);
    if (newlyUnlocked.length > 0) {
      Alert.alert(
        i18n.t('crafting.new_recipe_title', { defaultValue: 'Neues Rezept!' }),
        i18n.t('crafting.new_recipe_desc_multi', { defaultValue: 'Du hast neue Rezepte gelernt: ' }) + newlyUnlocked.join(', ')
      );
    }`;

content = content.replace(oldLogic, newLogic);
fs.writeFileSync(file, content, 'utf8');
console.log("Patched InventoryEngine.ts for all recipes");
