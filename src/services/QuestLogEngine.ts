import AsyncStorage from '@react-native-async-storage/async-storage';

const QUEST_LOG_KEY = '@rpg_quest_log';

export interface Quest {
  id: string; // z.B. "quest_alkuin_1"
  npcId: string; // Der NPC, der die Quest vergeben hat
  titleKey: string; // Translation Key für den Titel
  descKey: string; // Translation Key für die Beschreibung
  status: 'active' | 'completed';
  timestamp: number; // Wann wurde sie angenommen
  requirement?: {
    itemId: string;
    amount: number;
  };
  turnedInAmount?: number;
  rewardItem?: string;
  rewardXP?: number;
  npcLocation?: { lat: number; lon: number };
  pigeonStatus?: 'idle' | 'flying';
  pigeonDispatchTime?: number;
  pigeonArrivalTime?: number;
}

export class QuestLogEngine {
  static async getQuests(): Promise<Quest[]> {
    try {
      const data = await AsyncStorage.getItem(QUEST_LOG_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        // Backward compatibility: migrate 'coins' to 'copper_coins' and fix broken titles
        return parsed.map((q: Quest) => {
          if (q.requirement && q.requirement.itemId === 'coins') {
            q.requirement.itemId = 'copper_coins';
          }
          if ((q.titleKey && q.titleKey.startsWith('quest_title_')) || (q.descKey && q.descKey.startsWith('quest_desc_'))) {
            const req = q.requirement?.itemId;
            if (req === 'iron_ore') { q.titleKey = 'map.dialogs.garrosh.quest_title'; q.descKey = 'map.dialogs.garrosh.quest_desc'; }
            else if (req === 'mushrooms') { q.titleKey = 'map.dialogs.alkuin.quest_title'; q.descKey = 'map.dialogs.alkuin.quest_desc'; }
            else if (req === 'wood_log') { q.titleKey = 'map.dialogs.leif.quest_title'; q.descKey = 'map.dialogs.leif.quest_desc'; }
            else if (req === 'bread') { q.titleKey = 'map.dialogs.beggar.quest_title'; q.descKey = 'map.dialogs.beggar.quest_desc'; }
            else if (req === 'clean_water') { q.titleKey = 'map.dialogs.barista.quest_title'; q.descKey = 'map.dialogs.barista.quest_desc'; }
            else if (req === 'copper_coins') { 
              // Either trader (10) or informant (15 or historically 5). 
              // We'll guess based on amount if possible, but fallback to informant.
              if (q.requirement?.amount === 10) {
                q.titleKey = 'map.dialogs.trader.quest_title'; q.descKey = 'map.dialogs.trader.quest_desc';
              } else {
                q.titleKey = 'map.dialogs.informant.quest_title'; q.descKey = 'map.dialogs.informant.quest_desc';
              }
            }
          }
          return q;
        });
      }
    } catch (e) {
      console.error('Error reading QuestLog', e);
    }
    return [];
  }

  static async saveQuests(quests: Quest[]): Promise<void> {
    try {
      await AsyncStorage.setItem(QUEST_LOG_KEY, JSON.stringify(quests));
    } catch (e) {
      console.error('Error saving QuestLog', e);
    }
  }

  static async addQuest(quest: Omit<Quest, 'status' | 'timestamp'>): Promise<boolean> {
    const quests = await this.getQuests();
    
    // Check if already exists
    if (quests.find(q => q.id === quest.id)) {
      return false; // Bereits angenommen
    }

    const newQuest: Quest = {
      ...quest,
      status: 'active',
      timestamp: Date.now()
    };

    quests.push(newQuest);
    await this.saveQuests(quests);
    return true;
  }

  
  static async removeQuest(questId: string): Promise<boolean> {
    const quests = await this.getQuests();
    const filtered = quests.filter(q => q.id !== questId);
    if (filtered.length !== quests.length) {
      await this.saveQuests(filtered);
      return true;
    }
    return false;
  }

  static async completeQuest(questId: string): Promise<boolean> {
    const quests = await this.getQuests();
    let found = false;
    
    const updated = quests.map(q => {
      if (q.id === questId) {
        found = true;
        return { ...q, status: 'completed' as const };
      }
      return q;
    });

    if (found) {
      await this.saveQuests(updated);
    }
    return found;
  }

  static async addProgress(questId: string, amount: number): Promise<boolean> {
    const quests = await this.getQuests();
    let found = false;
    
    const updated = quests.map(q => {
      if (q.id === questId) {
        found = true;
        const current = q.turnedInAmount || 0;
        return { ...q, turnedInAmount: current + amount };
      }
      return q;
    });

    if (found) {
      await this.saveQuests(updated);
    }
    return found;
  }

  static async hasQuest(questId: string): Promise<boolean> {
    const quests = await this.getQuests();
    return !!quests.find(q => q.id === questId);
  }

  static async isQuestCompleted(questId: string): Promise<boolean> {
    const quests = await this.getQuests();
    const q = quests.find(q => q.id === questId);
    return q?.status === 'completed';
  }
}
