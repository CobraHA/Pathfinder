import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
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

  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    if (isFocused) {
      loadQuests();
      const interval = setInterval(() => {
        setCurrentTime(Date.now());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isFocused]);

  const loadQuests = async () => {
    const allQuests = await QuestLogEngine.getQuests();
    const inv = await InventoryEngine.getInventory();
    setInventory(inv);

    const mockDbData = await AsyncStorage.getItem('@mock_db');
    if (mockDbData) {
      const mockDb = JSON.parse(mockDbData);
      const treasureMarks = mockDb.filter(n => n.type === 'treasure_mark');
      let questsAdded = false;
      for (const tm of treasureMarks) {
        if (!allQuests.find(q => q.id === 'quest_' + tm.id || q.id === tm.id)) {
          await QuestLogEngine.addQuest({
            id: 'quest_' + tm.id,
            npcId: 'system',
            titleKey: 'map.markers.treasure_mark',
            descKey: 'inventory.treasure_map_desc',
          });
          questsAdded = true;
        }
      }
      if (questsAdded) {
        const updatedQuests = await QuestLogEngine.getQuests();
        setQuests(updatedQuests);
        return;
      }
    }

    setQuests(allQuests);

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
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity 
                onPress={() => {
                  const isPinned = pinnedNodeId === quest.npcId;
                  const newId = isPinned ? null : quest.npcId;
                  setPinnedNodeId(newId);
                  PinEngine.setPinnedNodeId(newId);
                  if (!isPinned) {
                    navigation.goBack();
                  }
                }}
                style={{ padding: 4, marginRight: 10 }}
              >
                <Feather name="map-pin" size={20} color={pinnedNodeId === quest.npcId ? "#FFD700" : "#666"} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ padding: 4 }}
                onPress={() => {
                  Alert.alert(
                    "Aufgabe abbrechen",
                    "Bist du sicher, dass du diese Aufgabe abbrechen möchtest? Du kannst sie später wieder annehmen.",
                    [
                      { text: "Nein", style: "cancel" },
                      { 
                        text: "Ja", 
                        style: "destructive",
                        onPress: async () => {
                          if (pinnedNodeId === quest.npcId || pinnedNodeId === quest.id.replace('quest_', '')) {
                            setPinnedNodeId(null);
                            PinEngine.setPinnedNodeId(null);
                          }
                          await QuestLogEngine.removeQuest(quest.id);
                          loadQuests();
                        }
                      }
                    ]
                  );
                }}
              >
                <Feather name="x" size={22} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
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

          <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <Text style={styles.dateText}>
              {new Date(quest.timestamp).toLocaleDateString()}
            </Text>

            {/* Pigeon Logic */}
            {!isCompleted && (() => {
              if (quest.pigeonStatus === 'flying') {
                const totalFlightTime = quest.pigeonArrivalTime - quest.pigeonDispatchTime;
                const timePassed = currentTime - quest.pigeonDispatchTime;
                let progress = timePassed / totalFlightTime;
                let remainingSecs = Math.ceil((quest.pigeonArrivalTime - currentTime) / 1000);
                
                if (progress >= 1) {
                  progress = 1;
                  remainingSecs = 0;
                  // Auto-complete if time is up and not yet processed
                  QuestLogEngine.completePigeonFlight(quest.id).then((success) => {
                    if (success) {
                       if (quest.rewardItem) InventoryEngine.addItem({ id: quest.rewardItem, name: quest.rewardItem, type: 'quest_reward' }, 1);
                       Alert.alert("Brieftaube angekommen!", "Die Quest wurde erfolgreich abgeschlossen!");
                       loadQuests();
                    }
                  });
                }
                
                return (
                  <View style={{ width: 120, alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 10, color: '#A0A0A0', marginBottom: 2 }}>{remainingSecs}s verbleibend</Text>
                    <View style={{ width: '100%', height: 4, backgroundColor: '#333', borderRadius: 2, overflow: 'hidden' }}>
                       <View style={{ width: `${progress * 100}%`, height: '100%', backgroundColor: '#4CAF50' }} />
                    </View>
                    <Feather name="send" size={14} color="#4CAF50" style={{ position: 'absolute', left: `${Math.max(0, progress * 100 - 15)}%`, bottom: 6 }} />
                  </View>
                );
              }

              if (quest.requirement) {
                const invItem = inventory.find(i => i.id === quest.requirement.itemId);
                const hasAmount = invItem ? invItem.quantity : 0;
                const turnedIn = quest.turnedInAmount || 0;
                if (hasAmount + turnedIn >= quest.requirement.amount) {
                  // Player can send a pigeon!
                  return (
                    <TouchableOpacity
                      style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#3E2723', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, borderWidth: 1, borderColor: '#8B4513' }}
                      onPress={() => {
                        Alert.alert("Brieftaube senden?", "Willst du die Items per Brieftaube an den NPC schicken? Das dauert je nach Entfernung einen Moment.", [
                          { text: "Abbrechen", style: "cancel" },
                          { text: "Senden", onPress: async () => {
                            // Calculate Distance using a mock location or real location. We need player's current location here ideally.
                            // But since we are in QuestLog, we might not have it. Let's just assume a random distance or check if we can get it.
                            // Actually, distance from npcLocation to current location. If we don't have current location, just use a default time.
                            // Better: 60 seconds fixed if location unknown, else calc.
                            let flightSecs = 20 + Math.floor(Math.random() * 30); // Zufällig 20 bis 50 Sekunden für die Brieftaube
                            
                            const arrivalTime = Date.now() + flightSecs * 1000;
                            await InventoryEngine.removeItem(quest.requirement.itemId, quest.requirement.amount);
                            await QuestLogEngine.sendPigeon(quest.id, arrivalTime);
                            loadQuests();
                          }}
                        ]);
                      }}
                    >
                      <Feather name="send" size={14} color="#E9BC62" style={{ marginRight: 5 }} />
                      <Text style={{ color: '#E9BC62', fontSize: 12 }}>Senden</Text>
                    </TouchableOpacity>
                  );
                }
              }
              return null;
            })()}
          </View>
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
