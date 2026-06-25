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
  rewardCoins?: number;      // Kupfermünzen-Belohnung
  rewardGold?: number;       // Goldmünzen-Belohnung (für schwierigere Quests)
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
          
          // Migrate missing dynamic titles
          if (q.titleKey && q.titleKey.startsWith('quest.title.')) {
            const parts = q.titleKey.split('.');
            if (parts.length >= 3) {
              const questIdFull = parts[2]; // e.g. informant_q1
              const npcId = questIdFull.split('_')[0]; // informant
              q.titleKey = `npc.${npcId}.quest_title`;
              q.descKey = `npc.${npcId}.quest_desc`;
            }
          }

          // Fix broken generic NPC quests
          if (q.titleKey && q.titleKey.startsWith('Auftrag von npc.')) {
            const parts = q.titleKey.split('.');
            if (parts.length >= 2) {
              const npcId = parts[1];
              q.titleKey = `npc.${npcId}.quest_title`;
              q.descKey = `npc.${npcId}.quest_desc`;
            }
          }

          // Force migration for generic/mock keys
          if (q.titleKey && (q.titleKey.includes('.generic.') || q.titleKey.includes('.mock1.') || q.titleKey.includes('.mock2.') || q.titleKey.includes('.mock3.'))) {
            q.titleKey = 'quest_title_broken';
          }
          if ((q.titleKey && q.titleKey.startsWith('quest_title_')) || (q.descKey && q.descKey.startsWith('quest_desc_')) || q.titleKey === 'quest.title.generic') {
            const req = q.requirement?.itemId;
            if (req === 'iron_ore') { q.titleKey = 'npc.miner.quest_title'; q.descKey = 'npc.miner.quest_desc'; }
            else if (req === 'mushrooms') { q.titleKey = 'npc.alchemist.quest_title'; q.descKey = 'npc.alchemist.quest_desc'; }
            else if (req === 'wood_log') { q.titleKey = 'npc.carpenter.quest_title'; q.descKey = 'npc.carpenter.quest_desc'; }
            else if (req === 'bread') { q.titleKey = 'npc.cook.quest_title'; q.descKey = 'npc.cook.quest_desc'; }
            else if (req === 'clean_water') { q.titleKey = 'npc.barista.quest_title'; q.descKey = 'npc.barista.quest_desc'; }
            else if (req === 'bandit_amulet') { q.titleKey = 'npc.guard_captain.quest_title'; q.descKey = 'npc.guard_captain.quest_desc'; }
            else if (req === 'berries') { q.titleKey = 'npc.hunter.quest_title'; q.descKey = 'npc.hunter.quest_desc'; }
            else if (req === 'copper_coins') { 
              // Either trader (10) or informant (15 or historically 5). 
              // We'll guess based on amount if possible, but fallback to informant.
              if (q.requirement?.amount === 30) {
                q.titleKey = 'npc.merchant.quest_title'; q.descKey = 'npc.merchant.quest_desc';
              } else if (q.requirement?.amount === 50) {
                q.titleKey = 'npc.mayor.quest_title'; q.descKey = 'npc.mayor.quest_desc';
              } else if (q.requirement?.amount === 10) {
                q.titleKey = 'npc.trader.quest_title'; q.descKey = 'npc.trader.quest_desc';
              } else {
                q.titleKey = 'npc.informant.quest_title'; q.descKey = 'npc.informant.quest_desc';
              }
            } else {
              q.titleKey = 'npc.merchant.quest_title'; q.descKey = 'npc.merchant.quest_desc';
            }
          }
          // Force sync descKey with titleKey
          if (q.titleKey && q.titleKey.startsWith('npc.') && q.titleKey.endsWith('.quest_title')) {
            const npcId = q.titleKey.split('.')[1];
            q.descKey = `npc.${npcId}.quest_desc`;
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

  
  static async sendPigeon(id: string, arrivalTime: number): Promise<boolean> {
    try {
      const quests = await this.getQuests();
      const quest = quests.find(q => q.id === id);
      if (quest) {
        quest.pigeonStatus = 'flying';
        quest.pigeonDispatchTime = Date.now();
        quest.pigeonArrivalTime = arrivalTime;
        await AsyncStorage.setItem(QUEST_LOG_KEY, JSON.stringify(quests));
        return true;
      }
      return false;
    } catch (e) {
      console.error("Error sending pigeon:", e);
      return false;
    }
  }

  static async completePigeonFlight(id: string): Promise<boolean> {
    try {
      const quests = await this.getQuests();
      const quest = quests.find(q => q.id === id);
      if (quest && quest.pigeonStatus === 'flying') {
        quest.pigeonStatus = 'idle';
        quest.status = 'completed';
        await AsyncStorage.setItem(QUEST_LOG_KEY, JSON.stringify(quests));
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
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
      // Force sync descKey with titleKey
          if (q.titleKey && q.titleKey.startsWith('npc.') && q.titleKey.endsWith('.quest_title')) {
            const npcId = q.titleKey.split('.')[1];
            q.descKey = `npc.${npcId}.quest_desc`;
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
      // Force sync descKey with titleKey
          if (q.titleKey && q.titleKey.startsWith('npc.') && q.titleKey.endsWith('.quest_title')) {
            const npcId = q.titleKey.split('.')[1];
            q.descKey = `npc.${npcId}.quest_desc`;
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
