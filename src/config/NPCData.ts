export interface QuestDefinition {
  questId: string;
  requirement: { itemId: string; amount: number };
  xpReward: number;
  rewardItem?: string;
}

export interface NPCDefinition {
  id: string;
  nameKey: string;
  dialogStartKey: string;
  quests: QuestDefinition[];
}

export const NPCS: NPCDefinition[] = [
  {
    id: "blacksmith",
    nameKey: "npc.blacksmith.name",
    dialogStartKey: "npc.blacksmith.start",
    quests: [
      { questId: "blacksmith_q1", requirement: { itemId: "iron_ore", amount: 5 }, xpReward: 150, rewardItem: "sword" },
      { questId: "blacksmith_q2", requirement: { itemId: "wood_log", amount: 3 }, xpReward: 100, rewardItem: "copper_coins" },
      { questId: "blacksmith_q3", requirement: { itemId: "copper_coins", amount: 15 }, xpReward: 100, rewardItem: "tool" },
    ]
  },
  {
    id: "herbalist",
    nameKey: "npc.herbalist.name",
    dialogStartKey: "npc.herbalist.start",
    quests: [
      { questId: "herbalist_q1", requirement: { itemId: "mushrooms", amount: 5 }, xpReward: 100, rewardItem: "healing_potion" },
      { questId: "herbalist_q2", requirement: { itemId: "berries", amount: 10 }, xpReward: 120, rewardItem: "healing_potion" },
      { questId: "herbalist_q3", requirement: { itemId: "clean_water", amount: 2 }, xpReward: 80, rewardItem: "copper_coins" },
    ]
  },
  {
    id: "lumberjack",
    nameKey: "npc.lumberjack.name",
    dialogStartKey: "npc.lumberjack.start",
    quests: [
      { questId: "lumberjack_q1", requirement: { itemId: "wood_log", amount: 8 }, xpReward: 200, rewardItem: "copper_coins" },
      { questId: "lumberjack_q2", requirement: { itemId: "iron_ore", amount: 2 }, xpReward: 100, rewardItem: "tool" },
      { questId: "lumberjack_q3", requirement: { itemId: "bread", amount: 2 }, xpReward: 80, rewardItem: "wood_log" },
    ]
  },
  {
    id: "beggar",
    nameKey: "npc.beggar.name",
    dialogStartKey: "npc.beggar.start",
    quests: [
      { questId: "beggar_q1", requirement: { itemId: "bread", amount: 1 }, xpReward: 50, rewardItem: "copper_coins" },
      { questId: "beggar_q2", requirement: { itemId: "clean_water", amount: 1 }, xpReward: 50, rewardItem: "bandit_amulet" },
      { questId: "beggar_q3", requirement: { itemId: "berries", amount: 5 }, xpReward: 50, rewardItem: "mushrooms" },
    ]
  },
  {
    id: "barista",
    nameKey: "npc.barista.name",
    dialogStartKey: "npc.barista.start",
    quests: [
      { questId: "barista_q1", requirement: { itemId: "clean_water", amount: 3 }, xpReward: 100, rewardItem: "copper_coins" },
      { questId: "barista_q2", requirement: { itemId: "berries", amount: 5 }, xpReward: 100, rewardItem: "copper_coins" },
      { questId: "barista_q3", requirement: { itemId: "copper_coins", amount: 5 }, xpReward: 50, rewardItem: "bread" },
    ]
  },
  {
    id: "trader",
    nameKey: "npc.trader.name",
    dialogStartKey: "npc.trader.start",
    quests: [
      { questId: "trader_q1", requirement: { itemId: "copper_coins", amount: 20 }, xpReward: 150, rewardItem: "tool" },
      { questId: "trader_q2", requirement: { itemId: "bandit_amulet", amount: 1 }, xpReward: 300, rewardItem: "sword" },
      { questId: "trader_q3", requirement: { itemId: "iron_ore", amount: 5 }, xpReward: 120, rewardItem: "healing_potion" },
    ]
  },
  {
    id: "informant",
    nameKey: "npc.informant.name",
    dialogStartKey: "npc.informant.start",
    quests: [
      { questId: "informant_q1", requirement: { itemId: "copper_coins", amount: 15 }, xpReward: 100, rewardItem: "treasure_map" },
      { questId: "informant_q2", requirement: { itemId: "bread", amount: 3 }, xpReward: 80, rewardItem: "lockpick" },
      { questId: "informant_q3", requirement: { itemId: "bandit_amulet", amount: 1 }, xpReward: 200, rewardItem: "treasure_map" },
    ]
  },
  {
    id: "guard_captain",
    nameKey: "npc.guard_captain.name",
    dialogStartKey: "npc.guard_captain.start",
    quests: [
      { questId: "guard_captain_q1", requirement: { itemId: "bandit_amulet", amount: 2 }, xpReward: 300, rewardItem: "copper_coins" },
      { questId: "guard_captain_q2", requirement: { itemId: "sword", amount: 1 }, xpReward: 150, rewardItem: "copper_coins" },
      { questId: "guard_captain_q3", requirement: { itemId: "iron_ore", amount: 5 }, xpReward: 120, rewardItem: "healing_potion" },
    ]
  },
  {
    id: "miner",
    nameKey: "npc.miner.name",
    dialogStartKey: "npc.miner.start",
    quests: [
      { questId: "miner_q1", requirement: { itemId: "tool", amount: 1 }, xpReward: 100, rewardItem: "iron_ore" },
      { questId: "miner_q2", requirement: { itemId: "bread", amount: 2 }, xpReward: 80, rewardItem: "iron_ore" },
      { questId: "miner_q3", requirement: { itemId: "wood_log", amount: 5 }, xpReward: 120, rewardItem: "iron_ore" },
    ]
  },
  {
    id: "farmer",
    nameKey: "npc.farmer.name",
    dialogStartKey: "npc.farmer.start",
    quests: [
      { questId: "farmer_q1", requirement: { itemId: "clean_water", amount: 5 }, xpReward: 150, rewardItem: "bread" },
      { questId: "farmer_q2", requirement: { itemId: "wood_log", amount: 4 }, xpReward: 100, rewardItem: "berries" },
      { questId: "farmer_q3", requirement: { itemId: "tool", amount: 1 }, xpReward: 100, rewardItem: "bread" },
    ]
  },
  {
    id: "cook",
    nameKey: "npc.cook.name",
    dialogStartKey: "npc.cook.start",
    quests: [
      { questId: "cook_q1", requirement: { itemId: "mushrooms", amount: 4 }, xpReward: 120, rewardItem: "bread" },
      { questId: "cook_q2", requirement: { itemId: "berries", amount: 8 }, xpReward: 120, rewardItem: "bread" },
      { questId: "cook_q3", requirement: { itemId: "clean_water", amount: 2 }, xpReward: 80, rewardItem: "copper_coins" },
    ]
  },
  {
    id: "hunter",
    nameKey: "npc.hunter.name",
    dialogStartKey: "npc.hunter.start",
    quests: [
      { questId: "hunter_q1", requirement: { itemId: "bandit_amulet", amount: 1 }, xpReward: 200, rewardItem: "wood_log" },
      { questId: "hunter_q2", requirement: { itemId: "berries", amount: 5 }, xpReward: 100, rewardItem: "copper_coins" },
      { questId: "hunter_q3", requirement: { itemId: "sword", amount: 1 }, xpReward: 150, rewardItem: "mushrooms" },
    ]
  },
  {
    id: "scout",
    nameKey: "npc.scout.name",
    dialogStartKey: "npc.scout.start",
    quests: [
      { questId: "scout_q1", requirement: { itemId: "bread", amount: 2 }, xpReward: 80, rewardItem: "treasure_map" },
      { questId: "scout_q2", requirement: { itemId: "healing_potion", amount: 1 }, xpReward: 150, rewardItem: "copper_coins" },
      { questId: "scout_q3", requirement: { itemId: "clean_water", amount: 3 }, xpReward: 100, rewardItem: "bandit_amulet" },
    ]
  },
  {
    id: "mayor",
    nameKey: "npc.mayor.name",
    dialogStartKey: "npc.mayor.start",
    quests: [
      { questId: "mayor_q1", requirement: { itemId: "copper_coins", amount: 50 }, xpReward: 500, rewardItem: "treasure_map" },
      { questId: "mayor_q2", requirement: { itemId: "wood_log", amount: 20 }, xpReward: 300, rewardItem: "tool" },
      { questId: "mayor_q3", requirement: { itemId: "iron_ore", amount: 10 }, xpReward: 300, rewardItem: "sword" },
    ]
  },
  {
    id: "priest",
    nameKey: "npc.priest.name",
    dialogStartKey: "npc.priest.start",
    quests: [
      { questId: "priest_q1", requirement: { itemId: "bandit_amulet", amount: 3 }, xpReward: 400, rewardItem: "healing_potion" },
      { questId: "priest_q2", requirement: { itemId: "clean_water", amount: 2 }, xpReward: 80, rewardItem: "healing_potion" },
      { questId: "priest_q3", requirement: { itemId: "bread", amount: 5 }, xpReward: 150, rewardItem: "copper_coins" },
    ]
  },
  {
    id: "alchemist",
    nameKey: "npc.alchemist.name",
    dialogStartKey: "npc.alchemist.start",
    quests: [
      { questId: "alchemist_q1", requirement: { itemId: "mushrooms", amount: 10 }, xpReward: 250, rewardItem: "healing_potion" },
      { questId: "alchemist_q2", requirement: { itemId: "berries", amount: 15 }, xpReward: 250, rewardItem: "healing_potion" },
      { questId: "alchemist_q3", requirement: { itemId: "clean_water", amount: 5 }, xpReward: 150, rewardItem: "copper_coins" },
    ]
  },
  {
    id: "carpenter",
    nameKey: "npc.carpenter.name",
    dialogStartKey: "npc.carpenter.start",
    quests: [
      { questId: "carpenter_q1", requirement: { itemId: "wood_log", amount: 15 }, xpReward: 300, rewardItem: "tool" },
      { questId: "carpenter_q2", requirement: { itemId: "iron_ore", amount: 5 }, xpReward: 150, rewardItem: "copper_coins" },
      { questId: "carpenter_q3", requirement: { itemId: "tool", amount: 2 }, xpReward: 200, rewardItem: "wood_log" },
    ]
  },
  {
    id: "mason",
    nameKey: "npc.mason.name",
    dialogStartKey: "npc.mason.start",
    quests: [
      { questId: "mason_q1", requirement: { itemId: "iron_ore", amount: 10 }, xpReward: 250, rewardItem: "copper_coins" },
      { questId: "mason_q2", requirement: { itemId: "tool", amount: 1 }, xpReward: 100, rewardItem: "iron_ore" },
      { questId: "mason_q3", requirement: { itemId: "clean_water", amount: 3 }, xpReward: 100, rewardItem: "copper_coins" },
    ]
  },
  {
    id: "merchant",
    nameKey: "npc.merchant.name",
    dialogStartKey: "npc.merchant.start",
    quests: [
      { questId: "merchant_q1", requirement: { itemId: "copper_coins", amount: 30 }, xpReward: 200, rewardItem: "lockpick" },
      { questId: "merchant_q2", requirement: { itemId: "sword", amount: 1 }, xpReward: 150, rewardItem: "copper_coins" },
      { questId: "merchant_q3", requirement: { itemId: "healing_potion", amount: 2 }, xpReward: 150, rewardItem: "copper_coins" },
    ]
  },
  {
    id: "tailor",
    nameKey: "npc.tailor.name",
    dialogStartKey: "npc.tailor.start",
    quests: [
      { questId: "tailor_q1", requirement: { itemId: "mushrooms", amount: 5 }, xpReward: 100, rewardItem: "copper_coins" },
      { questId: "tailor_q2", requirement: { itemId: "berries", amount: 10 }, xpReward: 150, rewardItem: "copper_coins" },
      { questId: "tailor_q3", requirement: { itemId: "bread", amount: 2 }, xpReward: 80, rewardItem: "copper_coins" },
    ]
  }
];
