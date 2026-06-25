import React, { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { PinEngine } from '../services/PinEngine';
import { QuestLogEngine } from '../services/QuestLogEngine';
import { QuestEngine } from '../services/QuestEngine';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { InventoryEngine } from '../services/InventoryEngine';
import { SurvivalEngine } from '../services/SurvivalEngine';
import i18n from '../i18n';

export default function InventoryScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [inventory, setInventory] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState('name'); // name, amount, type
  const [sortAscending, setSortAscending] = useState(true);

  useEffect(() => {
    if (isFocused) {
      InventoryEngine.getInventory().then(items => {
        setInventory(items.filter(i => i && i.id && i.quantity > 0));
      });
    }
  }, [isFocused]);

  const getItemIcon = (id) => {
    switch(id) {
      case 'clean_water': return 'flask';
      case 'dirty_water': return 'flask-empty';
      case 'iron_ore': return 'diamond-stone';
      case 'herb_root': return 'sprout';
      case 'wood_log': return 'tree';
      case 'stick': return 'slash-forward';
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
      case 'salt': return 'shaker';
      case 'salt_water': return 'water-percent';
      case 'bread': 
      case 'stale_bread':
      case 'moldy_bread': return 'baguette';
      case 'canned_food': return 'food-apple';
      case 'cloth_scrap': return 'tshirt-crew-outline';
      case 'old_currency': return 'cash-multiple';
      case 'flint': return 'flare';
      case 'coffee': return 'coffee';
      case 'strong_coffee': return 'coffee-outline';
      case 'medicine': return 'pill';
      case 'coffee_beans': return 'seed';
      case 'burger': return 'hamburger';
      case 'canned_beans': return 'food-apple';
      case 'flower': return 'flower';
      case 'gold_coin': return 'coin';
      case 'beer': return 'beer';
      case 'book': return 'book-open-page-variant';
      case 'fabric': return 'tshirt-crew';
      case 'shirt': return 'tshirt-crew';
      case 'pants': return 'hanger';
      case 'broken_shirt': return 'tshirt-crew-outline';
      case 'broken_pants': return 'hanger';
      case 'gasoline': return 'gas-station';
      default: return 'bag-personal';
    }
  };

  const filteredAndSortedInventory = React.useMemo(() => {
    let result = inventory.filter(item => {
      if (!searchQuery) return true;
      const translatedName = i18n.t(`items.${item.id}`, { defaultValue: item.name || '' }).toLowerCase();
      return translatedName.includes(searchQuery.toLowerCase());
    });

    result.sort((a, b) => {
      let comparison = 0;
      if (sortMode === 'name') {
        const nameA = i18n.t(`items.${a.id}`, { defaultValue: a.name || '' });
        const nameB = i18n.t(`items.${b.id}`, { defaultValue: b.name || '' });
        comparison = nameA.localeCompare(nameB);
      } else if (sortMode === 'amount') {
        comparison = a.quantity - b.quantity;
      } else if (sortMode === 'type') {
        const typeA = a.type || '';
        const typeB = b.type || '';
        comparison = typeA.localeCompare(typeB);
      }
      return sortAscending ? comparison : -comparison;
    });

    return result;
  }, [inventory, searchQuery, sortMode, sortAscending]);

  const handleUseItem = async () => {
    if (!selectedItem) return;
    
    // Try to consume for survival stats first
    
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
        await QuestLogEngine.addQuest({
          id: 'quest_' + newTreasureId,
          npcId: 'system',
          titleKey: 'map.markers.treasure_mark',
          descKey: 'inventory.treasure_map_desc',
        });
        
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

    const { success, message } = await SurvivalEngine.consumeItem(selectedItem.id);
    
    if (success) {
      const newInv = await InventoryEngine.removeItem(selectedItem.id, 1);
      setInventory(newInv);
      
      const updatedItem = newInv.find(i => i.id === selectedItem.id);
      if (updatedItem && updatedItem.quantity > 0) {
        setSelectedItem(updatedItem);
      } else {
        setSelectedItem(null);
      }
    } else {
      // General usage fallback (e.g. quest items)
      const newInv = await InventoryEngine.removeItem(selectedItem.id, 1);
      setInventory(newInv);
      
      const updatedItem = newInv.find(i => i.id === selectedItem.id);
      if (updatedItem && updatedItem.quantity > 0) {
        setSelectedItem(updatedItem);
      } else {
        setSelectedItem(null);
      }
    }
  };

  const handleDropItem = async () => {
    if (!selectedItem) return;
    const newInv = await InventoryEngine.removeItem(selectedItem.id, 1);
    setInventory(newInv);
    
    const translatedName = i18n.t(`items.${selectedItem.id}`, { defaultValue: selectedItem.name || 'Item' });
    alert(i18n.t('inventory.dropped_item', { name: translatedName }));
    
    // Clear selection if item is completely gone
    const updatedItem = newInv.find(i => i.id === selectedItem.id);
    if (!updatedItem) setSelectedItem(null);
    else setSelectedItem(updatedItem);
  };

  return (
    <View style={[styles.background, { backgroundColor: '#1a100a' }]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={28} color="#E9BC62" />
          </TouchableOpacity>
          <Text style={styles.title}>{i18n.t('inventory.title')}</Text>
          <View style={{ width: 40 }} /> {/* Spacer */}
        </View>

        <View style={styles.filterContainer}>
          <View style={styles.searchBox}>
            <Feather name="search" size={20} color="#888" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder={i18n.t('inventory.search', { defaultValue: 'Suchen...' })}
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Feather name="x-circle" size={18} color="#888" />
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.sortControls}>
            <TouchableOpacity 
              style={styles.sortButton} 
              onPress={() => {
                const modes = ['name', 'amount', 'type'];
                const nextIndex = (modes.indexOf(sortMode) + 1) % modes.length;
                setSortMode(modes[nextIndex]);
              }}
            >
              <Text style={styles.sortButtonText}>
                {sortMode === 'name' ? 'Name' : sortMode === 'amount' ? 'Menge' : 'Typ'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.sortDirectionButton}
              onPress={() => setSortAscending(!sortAscending)}
            >
              <Feather name={sortAscending ? "arrow-down" : "arrow-up"} size={20} color="#E9BC62" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.gridContainer}>
            <ScrollView contentContainerStyle={styles.inventoryGrid}>
              {filteredAndSortedInventory.length === 0 && (
                <Text style={styles.emptyText}>{i18n.t('inventory.empty')}</Text>
              )}
              {filteredAndSortedInventory.flatMap((item, index, array) => {
                const elements = [];
                if (sortMode === 'type') {
                  const prevType = index === 0 ? null : array[index - 1].type;
                  if (item.type !== prevType) {
                    const translatedType = item.type === 'consumable' ? i18n.t('inventory.type_consumable', {defaultValue: 'Verbrauchsgut'}) : 
                                           item.type === 'material' ? i18n.t('inventory.type_material', {defaultValue: 'Material'}) : 
                                           i18n.t('inventory.type_quest', {defaultValue: 'Quest-Item'});
                    elements.push(
                      <View key={`header-${item.type}`} style={styles.typeHeader}>
                        <Text style={styles.typeHeaderText}>{translatedType}</Text>
                      </View>
                    );
                  }
                }
                elements.push(
                  <TouchableOpacity 
                    key={item.id} 
                    style={[styles.inventorySlot, selectedItem?.id === item.id && styles.inventorySlotSelected]}
                    onPress={() => setSelectedItem(item)}
                  >
                    <MaterialCommunityIcons name={getItemIcon(item.id)} size={38} color={selectedItem?.id === item.id ? "#E9BC62" : "#A67B38"} />
                    <View style={styles.quantityBadge}>
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                    </View>
                  </TouchableOpacity>
                );
                return elements;
              })}
            </ScrollView>
          </View>

          {/* Details Panel fixed at bottom */}
          <View style={styles.detailsPanel}>
            {selectedItem ? (
              <>
                <Text style={styles.detailTitle}>
                  {i18n.t(`items.${selectedItem.id || 'unknown'}`, { defaultValue: selectedItem.name || 'Unbekanntes Item' })}
                </Text>
                <Text style={styles.detailType}>
                  {selectedItem.type === 'consumable' ? i18n.t('inventory.type_consumable') : selectedItem.type === 'material' ? i18n.t('inventory.type_material') : i18n.t('inventory.type_quest')}
                </Text>
                
                {SurvivalEngine.consumptionValues[selectedItem.id] && (
                  <View style={styles.nutritionContainer}>
                    <View style={styles.nutritionRow}>
                      {SurvivalEngine.consumptionValues[selectedItem.id].hunger !== 0 && (
                        <>
                          <MaterialCommunityIcons name="food-drumstick" size={16} color="#A5D6A7" />
                          <Text style={[styles.nutritionText, { color: SurvivalEngine.consumptionValues[selectedItem.id].hunger < 0 ? '#FF6B6B' : '#A5D6A7' }]}>
                            {SurvivalEngine.consumptionValues[selectedItem.id].hunger > 0 ? '+' : ''}{SurvivalEngine.consumptionValues[selectedItem.id].hunger} Hunger
                          </Text>
                        </>
                      )}
                      
                      {SurvivalEngine.consumptionValues[selectedItem.id].thirst !== 0 && (
                        <>
                          <MaterialCommunityIcons name="water" size={16} color="#4169E1" style={{marginLeft: SurvivalEngine.consumptionValues[selectedItem.id].hunger !== 0 ? 15 : 0}} />
                          <Text style={[styles.nutritionText, { color: SurvivalEngine.consumptionValues[selectedItem.id].thirst < 0 ? '#FF6B6B' : '#6495ED' }]}>
                            {SurvivalEngine.consumptionValues[selectedItem.id].thirst > 0 ? '+' : ''}{SurvivalEngine.consumptionValues[selectedItem.id].thirst} Durst
                          </Text>
                        </>
                      )}
                    </View>
                    {SurvivalEngine.consumptionValues[selectedItem.id].sideEffect && (
                      <Text style={styles.sideEffectText}>
                        ⚠ {SurvivalEngine.consumptionValues[selectedItem.id].sideEffect}
                      </Text>
                    )}
                  </View>
                )}
                
                <View style={styles.actionButtons}>
                  {selectedItem.type === 'consumable' && (
                    <TouchableOpacity style={styles.useButton} onPress={handleUseItem}>
                      <Text style={styles.useButtonText}>{i18n.t('inventory.use_button')}</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity style={styles.dropButton} onPress={handleDropItem}>
                    <Feather name="trash-2" size={18} color="#FF6B6B" />
                    <Text style={styles.dropButtonText}>{i18n.t('inventory.drop_button')}</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <Text style={styles.emptyText}>{i18n.t('inventory.select_item', { defaultValue: 'Wähle einen Gegenstand aus' })}</Text>
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Dim background to make UI pop
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(44, 26, 18, 0.8)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#5D4037',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#E9BC62',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
  },
  contentContainer: {
    flex: 1,
    padding: 15,
  },
  gridContainer: {
    flex: 1,
    backgroundColor: 'rgba(30, 18, 12, 0.85)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#8B4513',
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  inventoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  inventorySlot: {
    width: '21%',
    aspectRatio: 1,
    margin: '2%',
    backgroundColor: 'rgba(20, 10, 5, 0.9)',
    borderWidth: 2,
    borderColor: '#4A2511',
    borderRadius: 12,
    margin: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  nutritionContainer: {
    backgroundColor: 'rgba(20, 15, 10, 0.6)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#4a3525',
  },
  nutritionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  nutritionText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  sideEffectText: {
    color: '#FFD700',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
  },
  inventorySlotSelected: {
    backgroundColor: '#3E1C0D',
    borderColor: '#E9BC62',
    transform: [{ scale: 1.05 }],
    shadowColor: '#E9BC62',
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  quantityBadge: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    backgroundColor: '#8B0000',
    borderColor: '#E9BC62',
    borderWidth: 1,
    borderRadius: 14,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  quantityText: {
    color: '#F5E6CE',
    fontSize: 13,
    fontWeight: 'bold',
  },
  useButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  dropButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3E2723',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF6B6B',
    flex: 1,
  },
  dropButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  emptyText: {
    color: '#A67B38',
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
    width: '100%',
    marginTop: 20,
  },
  detailsPanel: {
    backgroundColor: 'rgba(44, 26, 18, 0.95)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E9BC62',
    padding: 20,
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  detailTitle: {
    color: '#E9BC62',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  detailType: {
    color: '#A67B38',
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 15,
  },
  useButton: {
    backgroundColor: '#8B0000',
    borderColor: '#E9BC62',
    borderWidth: 2,
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  useButtonText: {
    color: '#F5E6CE',
    fontWeight: 'bold',
    fontSize: 18,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 18, 12, 0.8)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#5D4037',
    paddingHorizontal: 10,
    height: 40,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#F5E6CE',
    fontFamily: 'Courier',
    height: '100%',
  },
  sortControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortButton: {
    backgroundColor: 'rgba(44, 26, 18, 0.8)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#5D4037',
    paddingHorizontal: 12,
    height: 40,
    justifyContent: 'center',
    marginRight: 6,
  },
  sortButtonText: {
    color: '#E9BC62',
    fontFamily: 'Courier',
    fontWeight: 'bold',
  },
  sortDirectionButton: {
    backgroundColor: 'rgba(44, 26, 18, 0.8)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#5D4037',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeHeader: {
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginTop: 10,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#8B4513',
  },
  typeHeaderText: {
    color: '#E9BC62',
    fontFamily: 'Courier',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});
