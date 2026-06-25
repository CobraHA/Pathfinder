const fs = require('fs');
let file = fs.readFileSync('src/services/QuestLogEngine.ts', 'utf8');

// Update Quest interface
const interfaceTarget = `export interface Quest {
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
}`;

const interfaceReplacement = `export interface Quest {
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
}`;

if (file.includes(interfaceTarget)) {
  file = file.replace(interfaceTarget, interfaceReplacement);
}

// Add sendPigeon and update methods
const classEnd = `  static async removeQuest(id: string): Promise<boolean> {`;

const newMethods = `  static async sendPigeon(id: string, arrivalTime: number): Promise<boolean> {
    try {
      const quests = await this.getQuests();
      const quest = quests.find(q => q.id === id);
      if (quest) {
        quest.pigeonStatus = 'flying';
        quest.pigeonDispatchTime = Date.now();
        quest.pigeonArrivalTime = arrivalTime;
        await AsyncStorage.setItem(QUESTS_KEY, JSON.stringify(quests));
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
        await AsyncStorage.setItem(QUESTS_KEY, JSON.stringify(quests));
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  static async removeQuest(id: string): Promise<boolean> {`;

file = file.replace(classEnd, newMethods);

fs.writeFileSync('src/services/QuestLogEngine.ts', file);
console.log("Patched QuestLogEngine.ts");
