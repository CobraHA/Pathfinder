import AsyncStorage from '@react-native-async-storage/async-storage';

const PIN_KEY = '@rpg_pinned_node';

export class PinEngine {
  static async getPinnedNodeId(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(PIN_KEY);
    } catch (e) {
      console.error('Error reading PinEngine', e);
      return null;
    }
  }

  static async setPinnedNodeId(nodeId: string | null): Promise<void> {
    try {
      if (nodeId) {
        await AsyncStorage.setItem(PIN_KEY, nodeId);
      } else {
        await AsyncStorage.removeItem(PIN_KEY);
      }
    } catch (e) {
      console.error('Error saving PinEngine', e);
    }
  }
}
