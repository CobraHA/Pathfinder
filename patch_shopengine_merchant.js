const fs = require('fs');
const file = 'src/services/ShopEngine.ts';
let content = fs.readFileSync(file, 'utf8');

const newMethods = `
  static async getMerchantInventory(merchantId: string): Promise<ShopItem[]> {
    try {
      const storageKey = \`@rpg_shop_merchant_\${merchantId}\`;
      const savedItems = await AsyncStorage.getItem(storageKey);
      
      if (savedItems) {
        return JSON.parse(savedItems);
      } else {
        // Generate random inventory
        const possibleItems = [
          { id: 'healing_potion', name: 'Heiltrank', type: 'consumable', basePrice: 20 },
          { id: 'lockpick', name: 'Dietrich', type: 'quest_item', basePrice: 15 },
          { id: 'clean_water', name: 'Trinkwasser', type: 'consumable', basePrice: 5 },
          { id: 'wood_log', name: 'Holzstamm', type: 'material', basePrice: 3 },
          { id: 'stone_block', name: 'Steinblock', type: 'material', basePrice: 3 },
          { id: 'iron_ore', name: 'Eisenerz', type: 'material', basePrice: 8 },
          { id: 'bread', name: 'Brot', type: 'consumable', basePrice: 10 },
          { id: 'roasted_meat', name: 'Gebratenes Fleisch', type: 'consumable', basePrice: 15 },
          { id: 'wheat', name: 'Weizen', type: 'material', basePrice: 4 },
        ];
        
        // Shuffle and pick 4-6 items
        const shuffled = possibleItems.sort(() => 0.5 - Math.random());
        const numItems = Math.floor(Math.random() * 3) + 4; // 4, 5, or 6
        const selected = shuffled.slice(0, numItems);
        
        const items: ShopItem[] = selected.map(item => {
          // 30% discount on base price
          const discountedPrice = Math.max(1, Math.floor(item.basePrice * 0.7));
          const stock = Math.floor(Math.random() * 3) + 1; // 1 to 3 items in stock
          return {
            id: item.id,
            name: item.name,
            type: item.type as any,
            price: discountedPrice,
            stock: stock,
            maxStock: stock
          };
        });
        
        await AsyncStorage.setItem(storageKey, JSON.stringify(items));
        return items;
      }
    } catch (e) {
      console.error("ShopEngine getMerchantInventory error:", e);
      return [];
    }
  }

  static async buyItem(itemId: string, merchantId?: string): Promise<boolean> {
    try {
      const items = merchantId ? await this.getMerchantInventory(merchantId) : await this.getShopInventory();
      const itemIndex = items.findIndex(i => i.id === itemId);
      
      if (itemIndex >= 0 && items[itemIndex].stock > 0) {
        items[itemIndex].stock -= 1;
        if (merchantId) {
           await AsyncStorage.setItem(\`@rpg_shop_merchant_\${merchantId}\`, JSON.stringify(items));
        } else {
           await AsyncStorage.setItem(SHOP_INVENTORY_KEY, JSON.stringify(items));
        }
        return true;
      }
      return false; // Out of stock or item not found
    } catch (e) {
      console.error("ShopEngine buy error:", e);
      return false;
    }
  }
`;

content = content.replace(/static async buyItem[\s\S]*?\}\s*\}/, newMethods + "\n}");
fs.writeFileSync(file, content, 'utf8');
console.log("Patched ShopEngine.ts for merchants");
