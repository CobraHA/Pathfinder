import AsyncStorage from '@react-native-async-storage/async-storage';
import { RoleEngine } from './RoleEngine';

const NODE_STATE_KEY = '@rpg_node_state';
const RESPAWN_TIME_MS = 5 * 60 * 1000; // 5 minutes
const DEFAULT_MAX_GATHERS = 3;

export interface NodeState {
  gathersLeft: number;
  lastGatheredAt: number;
}

export class NodeStateEngine {
  static async getStates(): Promise<Record<string, NodeState>> {
    try {
      const data = await AsyncStorage.getItem(NODE_STATE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Error reading NodeState', e);
    }
    return {};
  }

  static async saveStates(states: Record<string, NodeState>): Promise<void> {
    try {
      await AsyncStorage.setItem(NODE_STATE_KEY, JSON.stringify(states));
    } catch (e) {
      console.error('Error saving NodeState', e);
    }
  }

  static async gatherNode(nodeId: string, maxGathers: number = DEFAULT_MAX_GATHERS): Promise<{ gathersLeft: number, isDepleted: boolean }> {
    const states = await this.getStates();
    const now = Date.now();
    let state = states[nodeId];

    // If node is not tracked, or was depleted but respawn time passed
    if (!state || (state.gathersLeft <= 0 && now - state.lastGatheredAt > RESPAWN_TIME_MS)) {
      const bonus = RoleEngine.getGatherBonus();
      state = { gathersLeft: maxGathers + bonus, lastGatheredAt: 0 };
    }

    if (state.gathersLeft > 0) {
      state.gathersLeft -= 1;
      state.lastGatheredAt = now;
      states[nodeId] = state;
      await this.saveStates(states);
      return { gathersLeft: state.gathersLeft, isDepleted: state.gathersLeft === 0 };
    }

    // Should not reach here if filtered properly, but just in case
    return { gathersLeft: 0, isDepleted: true };
  }

  static async getActiveNodes(allNodes: any[]): Promise<any[]> {
    const states = await this.getStates();
    const now = Date.now();

    return allNodes.filter(node => {
      if (node.type !== 'resource') return true; // Keep NPCs and chests

      const state = states[node.id];
      if (!state) return true; // Never gathered, fully active

      if (state.gathersLeft <= 0) {
        // Depleted, check if respawn time has passed
        if (now - state.lastGatheredAt > RESPAWN_TIME_MS) {
          return true; // Respawned
        }
        return false; // Still depleted
      }

      return true; // Has gathers left
    });
  }
}
