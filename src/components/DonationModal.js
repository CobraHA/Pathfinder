import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import i18n from '../i18n';
import InventoryEngine from '../services/InventoryEngine';
import SurvivalEngine from '../services/SurvivalEngine';
import LevelEngine from '../services/LevelEngine';
import { Alert } from 'react-native';

const getItemIcon = (id) => {
  if (id.includes('coin')) return 'gold';
  if (id.includes('wood')) return 'pine-tree';
  if (id.includes('iron') || id.includes('copper')) return 'gold';
  if (id.includes('water')) return 'water';
  if (id.includes('bread')) return 'baguette';
  if (id.includes('berries') || id.includes('herb') || id.includes('mushroom')) return 'leaf';
  if (id.includes('amulet') || id.includes('ring')) return 'necklace';
  if (id.includes('map') || id.includes('note')) return 'map';
  return 'treasure-chest';
};

export default function DonationModal({ visible, onClose, onDonate }) {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    if (visible) {
      InventoryEngine.getInventory().then(inv => {
        setInventory(inv.filter(item => item.amount > 0));
      });
    }
  }, [visible]);

  const handleSelect = async (item) => {
    if (item.type !== 'consumable') return;

    // Deduct item
    await InventoryEngine.removeItem(item.id, 1);
    
    // Grant reward (20 XP + 20% chance of lockpick/copper_coins)
    const xpReward = 20;
    await LevelEngine.addXP(xpReward, 'quest');
    
    let bonusItem = null;
    const roll = Math.random();
    if (roll < 0.1) {
      bonusItem = 'lockpick';
      await InventoryEngine.addItem(bonusItem, 1);
    } else if (roll < 0.2) {
      bonusItem = 'copper_coins';
      await InventoryEngine.addItem(bonusItem, 5);
    }

    const msg = bonusItem ? `+20 XP und ein ${i18n.t('items.' + bonusItem, {defaultValue: bonusItem})} erhalten!` : '+20 XP erhalten!';
    Alert.alert('Spende erfolgreich', msg);

    onDonate();
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Etwas zu Essen geben</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color="#A67B38" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.modalSubtitle}>Wähle eine Essensration aus deinem Inventar.</Text>

          {inventory.length === 0 ? (
            <Text style={{color: '#888', textAlign: 'center', marginTop: 20}}>Dein Inventar ist leer.</Text>
          ) : (
            <FlatList
              data={inventory}
              keyExtractor={(item) => item.id}
              numColumns={4}
              contentContainerStyle={{ padding: 10 }}
              renderItem={({ item }) => {
                const isConsumable = item.type === 'consumable';
                return (
                  <TouchableOpacity 
                    style={[styles.inventorySlot, !isConsumable && styles.inventorySlotDisabled]}
                    onPress={() => handleSelect(item)}
                    disabled={!isConsumable}
                  >
                    <MaterialCommunityIcons 
                      name={getItemIcon(item.id)} 
                      size={38} 
                      color={isConsumable ? "#A67B38" : "#555"} 
                    />
                    <View style={styles.amountBadge}>
                      <Text style={styles.amountText}>{item.amount}</Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalContainer: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#A67B38',
    padding: 20
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  modalTitle: {
    color: '#E9BC62',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalSubtitle: {
    color: '#CCC',
    fontSize: 14,
    marginBottom: 15
  },
  closeButton: {
    padding: 5
  },
  inventorySlot: {
    width: 65,
    height: 65,
    backgroundColor: '#2A2A2A',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3A3A3A',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    position: 'relative'
  },
  inventorySlotDisabled: {
    opacity: 0.3
  },
  amountBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#A67B38',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4
  },
  amountText: {
    color: '#000',
    fontSize: 10,
    fontWeight: 'bold'
  }
});
