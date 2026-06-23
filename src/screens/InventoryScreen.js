import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
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
      case 'stone_block': return 'cube';
      case 'healing_potion': return 'bottle-tonic-plus';
      case 'iron_ingot': return 'gold';
      case 'wooden_board': return 'tools';
      case 'iron_sword': 
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
      case 'bread': return 'baguette';
      case 'flint': return 'flare';
      default: return 'bag-personal';
    }
  };

  const handleUseItem = async () => {
    if (!selectedItem) return;
    
    // Try to consume for survival stats first
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

        <View style={styles.contentContainer}>
          <View style={styles.gridContainer}>
            <ScrollView contentContainerStyle={styles.inventoryGrid}>
              {inventory.length === 0 && (
                <Text style={styles.emptyText}>{i18n.t('inventory.empty')}</Text>
              )}
              {inventory.map(item => (
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
              ))}
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
    width: 75,
    height: 75,
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
});
