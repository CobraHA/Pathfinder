import AsyncStorage from '@react-native-async-storage/async-storage';

const SHOP_INVENTORY_KEY = '@rpg_shop_inventory';
const SHOP_LAST_RESTOCK_KEY = '@rpg_shop_last_restock';

export interface ShopItem {
  id: string;
  name: string;
  type: 'consumable' | 'material' | 'quest_item';
  price: number;
  stock: number;
  maxStock: number;
}

const DEFAULT_SHOP_ITEMS: ShopItem[] = [
  { id: 'healing_potion', name: 'Heiltrank', type: 'consumable', price: 20, stock: 1, maxStock: 1 },
  { id: 'lockpick', name: 'Dietrich', type: 'quest_item', price: 15, stock: 2, maxStock: 2 },
  { id: 'clean_water', name: 'Trinkwasser', type: 'consumable', price: 5, stock: 3, maxStock: 3 },
  { id: 'wood_log', name: 'Holzstamm', type: 'material', price: 3, stock: 5, maxStock: 5 },
];

export class ShopEngine {
  /**
   * Retrieves the current shop inventory.
   * If it's a new real-world day, it automatically restocks the items to maxStock.
   */
  static async getShopInventory(): Promise<ShopItem[]> {
    try {
      const today = new Date().toDateString(); // e.g. "Mon Jun 22 2026"
      const lastRestock = await AsyncStorage.getItem(SHOP_LAST_RESTOCK_KEY);
      
      let items: ShopItem[] = [];
      const savedItems = await AsyncStorage.getItem(SHOP_INVENTORY_KEY);
      
      if (savedItems) {
        items = JSON.parse(savedItems);
      } else {
        items = [...DEFAULT_SHOP_ITEMS].map(i => ({...i}));
      }

      // Check if we need a daily restock
      if (lastRestock !== today) {
        items = [...DEFAULT_SHOP_ITEMS].map(i => ({...i})); // Restock completely
        await AsyncStorage.setItem(SHOP_LAST_RESTOCK_KEY, today);
        await AsyncStorage.setItem(SHOP_INVENTORY_KEY, JSON.stringify(items));
      }

      return items;
    } catch (e) {
      console.error("ShopEngine error:", e);
      return [...DEFAULT_SHOP_ITEMS];
    }
  }

  /**
   * Attempts to buy 1 piece of an item.
   * Decrements the shop stock if available. Does NOT handle player inventory.
   */
  static async buyItem(itemId: string): Promise<boolean> {
    try {
      const items = await this.getShopInventory();
      const itemIndex = items.findIndex(i => i.id === itemId);
      
      if (itemIndex >= 0 && items[itemIndex].stock > 0) {
        items[itemIndex].stock -= 1;
        await AsyncStorage.setItem(SHOP_INVENTORY_KEY, JSON.stringify(items));
        return true;
      }
      return false; // Out of stock or item not found
    } catch (e) {
      console.error("ShopEngine buy error:", e);
      return false;
    }
  }
}
