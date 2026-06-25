const fs = require('fs');
let file = fs.readFileSync('src/screens/InventoryScreen.js', 'utf8');

if (!file.includes("import * as Location from 'expo-location'")) {
  file = file.replace("import { View,", "import * as Location from 'expo-location';\nimport { PinEngine } from '../services/PinEngine';\nimport { QuestEngine } from '../services/QuestEngine';\nimport { View,");
}

const customUseLogic = `
    // Custom use item logic for treasure map
    if (selectedItem.id === 'treasure_map') {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          alert(i18n.t('map.location_denied', { defaultValue: 'Kein GPS Zugriff' }));
          return;
        }
        let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        const newTreasureId = await QuestEngine.spawnTreasureMark(loc.coords.longitude, loc.coords.latitude);
        
        await PinEngine.setPinnedNodeId(newTreasureId);
        
        const newInv = await InventoryEngine.removeItem(selectedItem.id, 1);
        setInventory(newInv);
        setSelectedItem(null);
        
        alert(i18n.t('inventory.use_treasure_map_success', { defaultValue: 'Schatzkarte gelesen! Das Ziel wurde auf deiner Karte mit einem X markiert!' }));
        return;
      } catch (e) {
        console.error("Error using treasure map:", e);
        return;
      }
    }
`;

if (!file.includes("selectedItem.id === 'treasure_map'")) {
  file = file.replace("const { success, message } = await SurvivalEngine.consumeItem(selectedItem.id);", customUseLogic + "\n    const { success, message } = await SurvivalEngine.consumeItem(selectedItem.id);");
  fs.writeFileSync('src/screens/InventoryScreen.js', file);
  console.log("Patched InventoryScreen for treasure map use logic");
}
