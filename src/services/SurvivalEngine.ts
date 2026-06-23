import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../i18n';
import { RoleEngine } from './RoleEngine';

const SURVIVAL_KEY = '@rpg_survival_stats';
const LAST_DRAIN_KEY = '@rpg_survival_last_drain';

export interface SurvivalStats {
  hunger: number; // 0 to 100
  thirst: number; // 0 to 100
}

export class SurvivalEngine {
  static async getStats(): Promise<SurvivalStats> {
    try {
      const data = await AsyncStorage.getItem(SURVIVAL_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return { hunger: 100, thirst: 100 }; // Default max
  }

  static async saveStats(stats: SurvivalStats): Promise<void> {
    try {
      await AsyncStorage.setItem(SURVIVAL_KEY, JSON.stringify(stats));
    } catch (e) {
      console.error(e);
    }
  }

  // Wird aufgerufen, wenn man läuft oder Zeit vergeht
  static async drainStats(distanceTraveled: number = 0): Promise<SurvivalStats> {
    const stats = await this.getStats();
    
    let timeDrain = 0;
    try {
      const lastDrainStr = await AsyncStorage.getItem(LAST_DRAIN_KEY);
      const now = Date.now();
      if (lastDrainStr) {
        const lastDrain = parseInt(lastDrainStr, 10);
        const hoursPassed = (now - lastDrain) / (1000 * 60 * 60);
        // 5% Hunger/Durst pro Stunde offline drain
        timeDrain = hoursPassed * 5;
      }
      await AsyncStorage.setItem(LAST_DRAIN_KEY, now.toString());
    } catch(e) {}

    // Aktiver Drain durch Bewegung (z.B. 1% pro 100 Meter)
    // distanceTraveled ist in Metern
    const activeDrain = distanceTraveled / 100;

    let totalDrain = timeDrain + activeDrain;
    totalDrain *= RoleEngine.getSurvivalDrainMultiplier();

    if (totalDrain > 0) {
      stats.hunger = Math.max(0, stats.hunger - (totalDrain * 0.8)); // Hunger sinkt minimal langsamer
      stats.thirst = Math.max(0, stats.thirst - totalDrain);
      await this.saveStats(stats);
    }

    return stats;
  }

  // Definition der Konsumgüter
  static readonly consumptionValues: Record<string, { hunger: number; thirst: number; msg: string; sideEffect?: string }> = {
    'clean_water': { hunger: 0, thirst: 30, msg: "survival.drink_clean_water" },
    'dirty_water': { hunger: -15, thirst: 10, msg: "survival.drink_dirty_water", sideEffect: "30% Risiko für Krankheit" },
    'berries': { hunger: 15, thirst: 5, msg: "survival.eat_berries" },
    'mushrooms': { hunger: 20, thirst: 0, msg: "survival.eat_mushrooms", sideEffect: "10% Risiko für Vergiftung" },
    'roasted_meat': { hunger: 40, thirst: -5, msg: "survival.eat_roasted_meat" },
    'bread': { hunger: 50, thirst: -5, msg: "survival.eat_bread" },
    'herbal_tea': { hunger: 5, thirst: 40, msg: "survival.drink_herbal_tea" },
    'healing_potion': { hunger: 0, thirst: 10, msg: "survival.drink_healing_potion" },
    'coffee': { hunger: 50, thirst: 50, msg: "survival.drink_coffee" },
    'strong_coffee': { hunger: 100, thirst: 100, msg: "survival.drink_strong_coffee" },
  };

  // Wird aufgerufen, wenn man im Inventar auf "Benutzen" drückt
  static async consumeItem(itemId: string): Promise<{ success: boolean; message: string; newStats: SurvivalStats }> {
    const stats = await this.getStats();
    let restored = false;
    let msg = "";

    const effect = this.consumptionValues[itemId];
    if (effect) {
      let finalHungerEffect = effect.hunger;
      let finalThirstEffect = effect.thirst;
      let finalMsgKey = effect.msg;

      if (itemId === 'dirty_water') {
        if (Math.random() < 0.30) {
          // 30% chance to get sick
          finalHungerEffect = -15;
          finalThirstEffect = 10;
          finalMsgKey = "survival.drink_dirty_water_sick";
        } else {
          // 70% chance to be fine
          finalHungerEffect = 0;
          finalThirstEffect = 10;
          finalMsgKey = "survival.drink_dirty_water_safe";
        }
      } else if (itemId === 'mushrooms') {
        if (Math.random() < 0.10) {
          // 10% chance to be poisonous
          finalHungerEffect = -10;
          finalThirstEffect = -10;
          finalMsgKey = "survival.eat_mushrooms_poisonous";
        } else {
          // 90% chance to be fine
          finalHungerEffect = 20;
          finalThirstEffect = 0;
          finalMsgKey = "survival.eat_mushrooms_safe";
        }
      }

      stats.hunger = Math.min(100, stats.hunger + finalHungerEffect);
      stats.thirst = Math.min(100, stats.thirst + finalThirstEffect);
      // Wenn man Fleisch isst, kann man durstiger werden, aber nicht unter 0
      stats.thirst = Math.max(0, stats.thirst); 
      
      await this.saveStats(stats);
      return { success: true, message: i18n.t(finalMsgKey), newStats: stats };
    }

    return { success: false, message: i18n.t("survival.cannot_consume", { defaultValue: "Dieser Gegenstand kann nicht konsumiert werden." }), newStats: stats };
  }
}
