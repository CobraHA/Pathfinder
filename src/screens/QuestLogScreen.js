import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { QuestLogEngine } from '../services/QuestLogEngine';
import { InventoryEngine } from '../services/InventoryEngine';
import { PinEngine } from '../services/PinEngine';
import i18n from '../i18n';

export default function QuestLogScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [quests, setQuests] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [activeTab, setActiveTab] = useState('active');
  const [pinnedNodeId, setPinnedNodeId] = useState(null);

  useEffect(() => {
    if (isFocused) {
      loadQuests();
    }
  }, [isFocused]);

  const loadQuests = async () => {
    const allQuests = await QuestLogEngine.getQuests();
    setQuests(allQuests);
    const inv = await InventoryEngine.getInventory();
    setInventory(inv);
    const pinned = await PinEngine.getPinnedNodeId();
    setPinnedNodeId(pinned);
  };

  const filteredQuests = quests.filter(q => q.status === activeTab).sort((a, b) => b.timestamp - a.timestamp);

  const renderQuestCard = (quest) => {
    const isCompleted = quest.status === 'completed';
    let progressText = null;
    let isGoalMet = false;
    
    // Fallback for old quests accepted before the update
    let req = quest.requirement;
    if (!req) {
      if (quest.npcId === 'mock2') req = { itemId: 'mushrooms', amount: 3 };
      if (quest.npcId === 'mock3') req = { itemId: 'wood_log', amount: 5 };
    }

    if (req && !isCompleted) {
      const invItem = inventory.find(i => i.id === req.itemId);
      const inventoryAmount = invItem ? invItem.quantity : 0;
      const turnedIn = quest.turnedInAmount || 0;
      const totalAmount = inventoryAmount + turnedIn;
      
      isGoalMet = totalAmount >= req.amount;
      const itemName = i18n.t(`items.${req.itemId}`, { defaultValue: req.itemId });
      progressText = `${itemName}: ${totalAmount} / ${req.amount}`;
    }

    return (
      <View key={quest.id} style={[styles.questCard, isCompleted && styles.questCardCompleted]}>
        <View style={styles.questHeader}>
          <Feather name={isCompleted ? "check-circle" : "book-open"} size={24} color={isCompleted ? "#4CAF50" : "#E9BC62"} style={{ marginRight: 10 }} />
          <Text style={[styles.questTitle, isCompleted && styles.textCompleted]}>
            {i18n.t(quest.titleKey, { defaultValue: 'Quest' })}
          </Text>
          {!isCompleted && (
            <TouchableOpacity 
              onPress={() => {
                const isPinned = pinnedNodeId === quest.npcId;
                const newId = isPinned ? null : quest.npcId;
                setPinnedNodeId(newId);
                PinEngine.setPinnedNodeId(newId);
              }}
              style={{ padding: 4 }}
            >
              <Feather name="map-pin" size={20} color={pinnedNodeId === quest.npcId ? "#FFD700" : "#666"} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.questBody}>
          <Text style={[styles.questDesc, isCompleted && styles.textCompleted]}>
            {i18n.t(quest.descKey, { defaultValue: '...' })}
          </Text>
          
          {progressText && (
            <View style={styles.progressContainer}>
              <Text style={[styles.progressText, isGoalMet ? styles.progressMet : styles.progressNotMet]}>
                {progressText}
              </Text>
              {isGoalMet && <Feather name="check" size={16} color="#4CAF50" style={{ marginLeft: 5 }} />}
            </View>
          )}

          <Text style={styles.dateText}>
            {new Date(quest.timestamp).toLocaleDateString()}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.background, { backgroundColor: '#1a100a' }]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={28} color="#E9BC62" />
          </TouchableOpacity>
          <Text style={styles.title}>{i18n.t('questlog.title', { defaultValue: 'Tagebuch' })}</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'active' && styles.activeTab]}
            onPress={() => setActiveTab('active')}
          >
            <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
              {i18n.t('questlog.tab_active', { defaultValue: 'Aktiv' })}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
            onPress={() => setActiveTab('completed')}
          >
            <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
              {i18n.t('questlog.tab_completed', { defaultValue: 'Abgeschlossen' })}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollContainer} contentContainerStyle={{ paddingBottom: 50 }}>
          {filteredQuests.length === 0 ? (
            <Text style={styles.emptyText}>{i18n.t('questlog.empty', { defaultValue: 'Keine Quests vorhanden.' })}</Text>
          ) : (
            filteredQuests.map(renderQuestCard)
          )}
        </ScrollView>
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
    backgroundColor: 'rgba(0,0,0,0.6)', 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
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
    fontFamily: 'Courier',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
  },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#8B4513',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: 'rgba(30, 18, 12, 0.8)',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#3E1C0D',
  },
  tabText: {
    color: '#888',
    fontSize: 16,
    fontFamily: 'Courier',
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#E9BC62',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  questCard: {
    backgroundColor: 'rgba(30, 18, 12, 0.85)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#8B4513',
    padding: 15,
    marginBottom: 15,
  },
  questCardCompleted: {
    borderColor: '#333',
    backgroundColor: 'rgba(20, 20, 20, 0.85)',
  },
  questHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#4A2511',
    paddingBottom: 8,
  },
  questTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F5E6CE',
    fontFamily: 'Courier',
    flex: 1,
  },
  textCompleted: {
    color: '#888',
    textDecorationLine: 'line-through',
  },
  questBody: {
    paddingTop: 5,
  },
  questDesc: {
    fontSize: 15,
    color: '#CCC',
    fontFamily: 'Courier',
    lineHeight: 22,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Courier',
    textAlign: 'right',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Courier',
    fontWeight: 'bold',
  },
  progressMet: {
    color: '#4CAF50',
  },
  progressNotMet: {
    color: '#E9BC62',
  }
});
