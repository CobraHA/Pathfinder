import AsyncStorage from '@react-native-async-storage/async-storage';

export type PlayerRole = 'gatherer' | 'explorer' | 'survivor' | 'trader';

const ROLE_KEY = '@rpg_player_role';

// Store the role in memory for fast synchronous access
let currentRole: PlayerRole | null = null;

export class RoleEngine {
  /**
   * Loads the role from AsyncStorage. Should be called at app startup.
   */
  static async loadRole(): Promise<PlayerRole | null> {
    try {
      const savedRole = await AsyncStorage.getItem(ROLE_KEY);
      if (savedRole) {
        currentRole = savedRole as PlayerRole;
        return currentRole;
      }
    } catch (e) {
      console.error('Failed to load role:', e);
    }
    return null;
  }

  /**
   * Sets the player's role permanently.
   */
  static async setRole(role: PlayerRole): Promise<void> {
    try {
      currentRole = role;
      await AsyncStorage.setItem(ROLE_KEY, role);
    } catch (e) {
      console.error('Failed to save role:', e);
    }
  }

  /**
   * Returns the current role synchronously (must have been loaded first).
   */
  static getCurrentRole(): PlayerRole | null {
    return currentRole;
  }

  /**
   * Boni Methods
   */

  // Explorer (+20m interaction distance)
  static getInteractionDistance(): number {
    return currentRole === 'explorer' ? 60 : 40;
  }

  // Gatherer (+1 max gathers for resource nodes)
  static getGatherBonus(): number {
    return currentRole === 'gatherer' ? 1 : 0;
  }

  // Survivor (20% slower hunger/thirst drain)
  static getSurvivalDrainMultiplier(): number {
    return currentRole === 'survivor' ? 0.8 : 1.0;
  }

  // Trader (20% shop discount)
  static getShopDiscountMultiplier(): number {
    return currentRole === 'trader' ? 0.8 : 1.0;
  }
}
