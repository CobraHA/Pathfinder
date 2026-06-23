import AsyncStorage from '@react-native-async-storage/async-storage';

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  type: 'consumable' | 'material' | 'quest_item';
}

const INVENTORY_KEY = '@rpg_inventory';

export class InventoryEngine {
  static async getInventory(): Promise<InventoryItem[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(INVENTORY_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Error loading inventory', e);
      return [];
    }
  }

  static async saveInventory(inventory: InventoryItem[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(inventory);
      await AsyncStorage.setItem(INVENTORY_KEY, jsonValue);
    } catch (e) {
      console.error('Error saving inventory', e);
    }
  }

  static async addItem(item: Omit<InventoryItem, 'quantity'>, amount: number = 1): Promise<InventoryItem[]> {
    const inventory = await this.getInventory();
    const existingIndex = inventory.findIndex(i => i.id === item.id);
    
    if (existingIndex >= 0) {
      inventory[existingIndex].quantity += amount;
    } else {
      inventory.push({ ...item, quantity: amount });
    }
    
    await this.saveInventory(inventory);
    return inventory;
  }

  static async removeItem(itemId: string, amount: number = 1): Promise<InventoryItem[]> {
    let inventory = await this.getInventory();
    const existingIndex = inventory.findIndex(i => i.id === itemId);
    
    if (existingIndex >= 0) {
      inventory[existingIndex].quantity -= amount;
      if (inventory[existingIndex].quantity <= 0) {
        inventory.splice(existingIndex, 1);
      }
      await this.saveInventory(inventory);
    }
    
    return inventory;
  }

  static async hasItem(itemId: string, minAmount: number = 1): Promise<boolean> {
    const inventory = await this.getInventory();
    const item = inventory.find(i => i.id === itemId);
    return item ? item.quantity >= minAmount : false;
  }
}
