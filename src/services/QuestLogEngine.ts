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
}

export class QuestLogEngine {
  static async getQuests(): Promise<Quest[]> {
    try {
      const data = await AsyncStorage.getItem(QUEST_LOG_KEY);
      if (data) {
        return JSON.parse(data);
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
