import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LevelStats {
  level: number;
  currentXP: number;
  totalQuests: number;
  totalGathers: number;
  totalChests: number;
}

const LEVEL_KEY = '@rpg_level_stats';

export class LevelEngine {
  static getNextLevelXP(level: number): number {
    return level * 100;
  }

  static async getStats(): Promise<LevelStats> {
    try {
      const data = await AsyncStorage.getItem(LEVEL_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Error reading LevelStats:', e);
    }
    return {
      level: 1,
      currentXP: 0,
      totalQuests: 0,
      totalGathers: 0,
      totalChests: 0,
    };
  }

  static async saveStats(stats: LevelStats): Promise<void> {
    try {
      await AsyncStorage.setItem(LEVEL_KEY, JSON.stringify(stats));
    } catch (e) {
      console.error('Error saving LevelStats:', e);
    }
  }

  /**
   * Adds XP and updates stats. 
   * Returns true if a level up occurred.
   */
  static async addXP(amount: number, source: 'quest' | 'gather' | 'chest'): Promise<{ leveledUp: boolean, newLevel: number, stats: LevelStats }> {
    const stats = await this.getStats();
    
    // Update raw statistics
    if (source === 'quest') stats.totalQuests += 1;
    if (source === 'gather') stats.totalGathers += 1;
    if (source === 'chest') stats.totalChests += 1;

    stats.currentXP += amount;
    let leveledUp = false;

    // Check level up logic
    let requiredXP = this.getNextLevelXP(stats.level);
    while (stats.currentXP >= requiredXP) {
      stats.currentXP -= requiredXP;
      stats.level += 1;
      leveledUp = true;
      requiredXP = this.getNextLevelXP(stats.level);
    }

    await this.saveStats(stats);

    return { leveledUp, newLevel: stats.level, stats };
  }
}
