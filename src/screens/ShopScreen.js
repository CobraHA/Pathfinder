import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { InventoryEngine } from '../services/InventoryEngine';
import { ShopEngine, ShopItem } from '../services/ShopEngine';
import { RoleEngine } from '../services/RoleEngine';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import i18n from '../i18n';

// Definition of prices in copper coins for SELLING
const ITEM_PRICES = {
  'clean_water': 3,
  'dirty_water': 1,
  'iron_ore': 5,
  'herb_root': 4,
  'wood_log': 2,
  'stone_block': 2,
  'lockpick': 8,
  'raw_meat': 3,
  'roasted_meat': 6,
  'berries': 1,
  'mushrooms': 2,
  'sword': 25,
};

export default function ShopScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  
  const [activeTab, setActiveTab] = useState('sell'); // 'sell' or 'buy'
  
  const [playerInventory, setPlayerInventory] = useState([]);
  const [shopInventory, setShopInventory] = useState([]);
  const [copperCoins, setCopperCoins] = useState(0);

  useEffect(() => {
    if (isFocused) {
      loadData();
    }
  }, [isFocused, activeTab]);

  const loadData = async () => {
    // Load Player Inventory
    const items = await InventoryEngine.getInventory();
    const coinsItem = items.find(i => i.id === 'copper_coins');
    setCopperCoins(coinsItem ? coinsItem.quantity : 0);
    
    // Filter out coins and broken items so they don't appear in the sell list
    setPlayerInventory(items.filter(i => i && i.id && i.id !== 'copper_coins' && i.quantity > 0));

    // Load Shop Inventory
    const shopItems = await ShopEngine.getShopInventory();
    setShopInventory(shopItems);
  };

  const handleSellItem = async (item, sellAll = false) => {
    const amountToSell = sellAll ? item.quantity : 1;
    const pricePerItem = ITEM_PRICES[item.id] || 1; // Fallback price
    const totalEarnings = pricePerItem * amountToSell;

    await InventoryEngine.removeItem(item.id, amountToSell);
    await InventoryEngine.addItem({ id: 'copper_coins', name: 'Kupfermünzen', type: 'material' }, totalEarnings);
    
    const translatedName = i18n.t(`items.${item.id || 'unknown'}`, { defaultValue: item.name || 'Unbekannt' });
    alert(i18n.t('shop.sold', { name: `${amountToSell}x ${translatedName}`, price: totalEarnings }));
    
    loadData();
  };

  const handleBuyItem = async (item: ShopItem) => {
    const discountedPrice = Math.max(1, Math.floor(item.price * RoleEngine.getShopDiscountMultiplier()));
    if (copperCoins < discountedPrice) {
      alert(i18n.t('shop.not_enough_coins'));
      return;
    }

    const merchantId = route.params?.merchantId;
    const success = await ShopEngine.buyItem(item.id, merchantId);
    if (success) {
      // Deduct coins & give item
      await InventoryEngine.removeItem('copper_coins', discountedPrice);
      await InventoryEngine.addItem({ id: item.id, name: item.name, type: item.type }, 1);
      
      const translatedName = i18n.t(`items.${item.id || 'unknown'}`, { defaultValue: item.name || 'Unbekannt' });
      alert(i18n.t('shop.bought', { name: `1x ${translatedName}`, price: discountedPrice }));
      
      loadData();
    } else {
      alert(i18n.t('shop.sold_out'));
    }
  };

  const getItemIcon = (id) => {
    switch(id) {
      case 'clean_water': return 'flask';
      case 'dirty_water': return 'flask-empty';
      case 'iron_ore': return 'diamond-stone';
      case 'herb_root': return 'sprout';
      case 'wood_log': return 'tree';
      case 'stone_block': return 'cube';
      case 'healing_potion': return 'bottle-tonic-plus';
      case 'iron_ingot': return 'gold';
      case 'wooden_board': return 'tools';
      case 'sword': 
      case 'sword': return 'sword';
      case 'stone_axe': return 'axe';
      case 'bandit_amulet': return 'necklace';
      case 'campfire': return 'campfire';
      case 'herbal_tea': return 'coffee-outline';
      case 'stone_pickaxe': return 'pickaxe';
      case 'lockpick': return 'key-variant';
      case 'raw_meat': return 'food-steak';
      case 'roasted_meat': return 'food-drumstick';
      case 'berries': return 'fruit-cherries';
      case 'mushrooms': return 'mushroom';
      case 'copper_coins': return 'circle-multiple';
      default: return 'bag-personal';
    }
  };

  const renderSellItem = ({ item }) => {
    const price = ITEM_PRICES[item.id] || 1;
    const translatedName = i18n.t(`items.${item.id || 'unknown'}`, { defaultValue: item.name || 'Unbekannt' });

    return (
      <View style={styles.itemCard}>
        <View style={styles.itemInfo}>
          <MaterialCommunityIcons name={getItemIcon(item.id)} size={24} color="#E9BC62" style={{ marginRight: 10 }} />
          <View>
            <Text style={styles.itemName}>{translatedName}</Text>
            <Text style={styles.itemQuantity}>{i18n.t('shop.in_stock', { count: item.quantity, defaultValue: `${item.quantity}x vorhanden` })}</Text>
            <Text style={styles.itemPrice}>{i18n.t('shop.price_label')} {i18n.t('shop.copper_coins', { price, defaultValue: `${price} Kupfermünzen` })}</Text>
          </View>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.sellBtn} onPress={() => handleSellItem(item, false)}>
            <Text style={styles.sellBtnText}>{i18n.t('shop.sell_button')}</Text>
          </TouchableOpacity>
          {item.quantity > 1 && (
            <TouchableOpacity style={styles.sellAllBtn} onPress={() => handleSellItem(item, true)}>
              <Text style={styles.sellBtnText}>{i18n.t('shop.sell_all_button')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderBuyItem = ({ item }) => {
    const discountedPrice = Math.max(1, Math.floor(item.price * RoleEngine.getShopDiscountMultiplier()));
    const translatedName = i18n.t(`items.${item.id || 'unknown'}`, { defaultValue: item.name || 'Unbekannt' });
    const isOutOfStock = item.stock <= 0;
    const canAfford = copperCoins >= discountedPrice;

    return (
      <View style={[styles.itemCard, isOutOfStock && { opacity: 0.5 }]}>
        <View style={styles.itemInfo}>
          <MaterialCommunityIcons name={getItemIcon(item.id)} size={24} color="#E9BC62" style={{ marginRight: 10 }} />
          <View>
            <Text style={styles.itemName}>{translatedName}</Text>
            <Text style={styles.itemQuantity}>{i18n.t('shop.daily_stock')} {item.stock}/{item.maxStock}</Text>
          </View>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.buyBtn, (!canAfford || isOutOfStock) && { backgroundColor: '#333', borderColor: '#555' }]} 
            onPress={() => handleBuyItem(item)}
            disabled={isOutOfStock || !canAfford}
          >
            <Text style={[styles.buyBtnText, (!canAfford || isOutOfStock) && { color: '#888' }]}>
              {isOutOfStock ? i18n.t('shop.sold_out') : i18n.t('shop.buy_item_button', { price: discountedPrice })}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#F5E6CE" />
        </TouchableOpacity>
        <Text style={styles.title}>{i18n.t('shop.title')}</Text>
        <View style={styles.coinsBadge}>
          <Feather name="circle" size={16} color="#CD7F32" />
          <Text style={styles.coinsText}>{copperCoins}</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setActiveTab('sell')}>
          <Text style={[styles.tabText, activeTab === 'sell' && styles.activeTab]}>{i18n.t('shop.sell_tab')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('buy')}>
          <Text style={[styles.tabText, activeTab === 'buy' && styles.activeTab]}>{i18n.t('shop.buy_tab')}</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      {activeTab === 'sell' ? (
        <FlatList
          data={playerInventory}
          keyExtractor={i => i.id}
          renderItem={renderSellItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<Text style={styles.emptyText}>{i18n.t('shop.no_items')}</Text>}
        />
      ) : (
        <FlatList
          data={shopInventory}
          keyExtractor={i => i.id}
          renderItem={renderBuyItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<Text style={styles.emptyText}>-</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A1A' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: 20, 
    paddingTop: 20, 
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333'
  },
  backButton: { padding: 10 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#F5E6CE', fontFamily: 'Courier' },
  coinsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(205, 127, 50, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#CD7F32'
  },
  coinsText: { marginLeft: 6, color: '#CD7F32', fontWeight: 'bold', fontSize: 16 },
  tabs: { flexDirection: 'row', padding: 20, gap: 20 },
  tabText: { fontSize: 18, color: '#888', fontFamily: 'Courier' },
  activeTab: { color: '#E9BC62', fontWeight: 'bold', textDecorationLine: 'underline' },
  listContainer: { padding: 20, paddingBottom: 100 },
  itemCard: {
    backgroundColor: '#2A2A2A',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#E9BC62'
  },
  itemInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  itemName: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  itemQuantity: { color: '#AAA', marginTop: 4 },
  itemPrice: { color: '#CD7F32', marginTop: 4, fontWeight: 'bold' },
  actions: { flexDirection: 'row', gap: 10 },
  sellBtn: { flex: 1, backgroundColor: '#3E2723', padding: 10, borderRadius: 5, alignItems: 'center', borderWidth: 1, borderColor: '#E9BC62' },
  sellAllBtn: { flex: 1, backgroundColor: '#4A3E2A', padding: 10, borderRadius: 5, alignItems: 'center', borderWidth: 1, borderColor: '#E9BC62' },
  buyBtn: { flex: 1, backgroundColor: '#2E3B32', padding: 12, borderRadius: 5, alignItems: 'center', borderWidth: 1, borderColor: '#4CAF50' },
  sellBtnText: { color: '#E9BC62', fontWeight: 'bold' },
  buyBtnText: { color: '#4CAF50', fontWeight: 'bold', fontSize: 16 },
  emptyText: { color: '#888', textAlign: 'center', marginTop: 50, fontSize: 16 }
});
