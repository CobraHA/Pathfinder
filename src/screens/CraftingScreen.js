import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { CraftingEngine, CraftingRecipe } from '../services/CraftingEngine';
import { InventoryEngine, InventoryItem } from '../services/InventoryEngine';
import i18n from '../i18n';

export default function CraftingScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [recipes, setRecipes] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const loadData = async () => {
    setRecipes(CraftingEngine.getRecipes());
    const inv = await InventoryEngine.getInventory();
    setInventory(inv);
  };

  useEffect(() => {
    if (isFocused) {
      loadData();
    }
  }, [isFocused]);

  const getItemIcon = (id) => {
    switch(id) {
      case 'water_flask': return 'droplet';
      case 'iron_ore': return 'hexagon';
      case 'iron_ingot': return 'layers';
      case 'herb_root': return 'feather';
      case 'wood_log': return 'align-justify';
      case 'wooden_board': return 'layout';
      case 'stone_block': return 'box';
      case 'iron_sword': return 'crosshair';
      case 'stone_axe': return 'scissors';
      case 'bandit_amulet': return 'sun';
      case 'campfire': return 'thermometer';
      case 'herbal_tea': return 'coffee';
      case 'stone_pickaxe': return 'edit-2';
      case 'lockpick': return 'key';
      case 'raw_meat': return 'github';
      case 'roasted_meat': return 'gitlab';
      case 'salt': return 'sun';
      default: return 'package';
    }
  };

  const getInventoryCount = (itemId) => {
    const item = inventory.find(i => i.id === itemId);
    return item ? item.quantity : 0;
  };

  const handleCraft = async () => {
    if (!selectedRecipe) return;
    const { success, message } = await CraftingEngine.craftItem(selectedRecipe.outputId);
    if (success) {
      // Reload inventory
      await loadData();
      alert(i18n.t('crafting.success', { defaultValue: message }));
    } else {
      alert(i18n.t('crafting.error', { defaultValue: message }));
    }
  };

  const renderRecipeItem = (recipe) => {
    const isSelected = selectedRecipe?.outputId === recipe.outputId;
    return (
      <TouchableOpacity 
        key={recipe.outputId} 
        style={[styles.recipeSlot, isSelected && styles.recipeSlotSelected]}
        onPress={() => setSelectedRecipe(recipe)}
      >
        <Feather name={getItemIcon(recipe.outputId)} size={32} color={isSelected ? "#E9BC62" : "#A67B38"} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.background, { backgroundColor: '#1a100a' }]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={28} color="#E9BC62" />
          </TouchableOpacity>
          <Text style={styles.title}>{i18n.t('crafting.title', { defaultValue: 'Werkbank' })}</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.gridContainer}>
            <ScrollView contentContainerStyle={styles.inventoryGrid}>
              {recipes.map(renderRecipeItem)}
            </ScrollView>
          </View>

          {/* Details Panel fixed at bottom */}
          <View style={styles.detailsPanel}>
            {selectedRecipe ? (
              <>
                <Text style={styles.detailTitle}>
                  {i18n.t(`items.${selectedRecipe.outputId}`, { defaultValue: selectedRecipe.outputName })} (x{selectedRecipe.outputAmount})
                </Text>
                <View style={styles.ingredientsList}>
                  <Text style={styles.ingredientsTitle}>{i18n.t('crafting.ingredients', { defaultValue: 'Benötigt:' })}</Text>
                  {selectedRecipe.ingredients.map(ing => {
                    const hasCount = getInventoryCount(ing.id);
                    const enough = hasCount >= ing.amount;
                    return (
                      <View key={ing.id} style={styles.ingredientRow}>
                        <Feather name={getItemIcon(ing.id)} size={16} color="#E9BC62" style={{ marginRight: 8 }} />
                        <Text style={styles.ingredientName}>
                          {i18n.t(`items.${ing.id}`, { defaultValue: ing.id })}
                        </Text>
                        <Text style={[styles.ingredientAmount, !enough && { color: '#8B0000' }]}>
                          {hasCount} / {ing.amount}
                        </Text>
                      </View>
                    );
                  })}
                </View>
                
                <TouchableOpacity style={styles.craftButton} onPress={handleCraft}>
                  <Text style={styles.craftButtonText}>{i18n.t('crafting.craft_button', { defaultValue: 'Herstellen' })}</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text style={styles.emptyText}>{i18n.t('crafting.select_recipe', { defaultValue: 'Wähle ein Rezept' })}</Text>
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
    backgroundColor: '#1a100a',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(184, 134, 11, 0.3)',
  },
  title: {
    fontSize: 24,
    color: '#E9BC62',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  backButton: {
    padding: 5,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  gridContainer: {
    flex: 1,
  },
  inventoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    justifyContent: 'flex-start',
  },
  recipeSlot: {
    width: '21%',
    aspectRatio: 1,
    margin: '2%',
    backgroundColor: 'rgba(30, 20, 15, 0.8)',
    borderWidth: 1,
    borderColor: '#4a3525',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  recipeSlotSelected: {
    borderColor: '#E9BC62',
    backgroundColor: 'rgba(60, 40, 20, 0.9)',
    borderWidth: 2,
  },
  detailsPanel: {
    height: 280,
    backgroundColor: 'rgba(20, 15, 10, 0.95)',
    borderTopWidth: 2,
    borderTopColor: '#B8860B',
    padding: 20,
  },
  emptyText: {
    color: '#A67B38',
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 20,
  },
  detailTitle: {
    fontSize: 22,
    color: '#E9BC62',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  ingredientsList: {
    marginTop: 10,
    marginBottom: 20,
    flex: 1,
  },
  ingredientsTitle: {
    color: '#A67B38',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ingredientName: {
    color: '#F5E6CE',
    fontSize: 16,
    flex: 1,
  },
  ingredientAmount: {
    color: '#228B22', // Green if enough
    fontSize: 16,
    fontWeight: 'bold',
  },
  craftButton: {
    backgroundColor: '#8B0000',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9BC62',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  craftButtonText: {
    color: '#E9BC62',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
