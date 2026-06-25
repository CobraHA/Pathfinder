const fs = require('fs');
let file = fs.readFileSync('src/services/QuestEngine.ts', 'utf8');

// Ensure import
if (!file.includes("import { NPCS }")) {
  file = file.replace("import AsyncStorage", "import { NPCS } from '../config/NPCData';\nimport AsyncStorage");
}

// Patch injectRandomSpawns
const oldInjectStart = `      const npcNames = [
        'map.markers.survivor_barista',
        'map.markers.trader_bot',
        'map.markers.drunk_informant',
        'Alkuin der Alchemist',
        'Leif der Holzfäller',
        'Garrosh der Schmied',
        'Einsamer Wanderer'
      ];`;

const newInjectStart = `      for (let i = 0; i < npcCount; i++) {
        const offsetLat = (Math.random() - 0.5) * 0.008;
        const offsetLon = (Math.random() - 0.5) * 0.008;
        const npcLat = latitude + offsetLat;
        const npcLon = longitude + offsetLon;
        
        const randomNpcDef = NPCS[Math.floor(Math.random() * NPCS.length)];
        const randomQuest = randomNpcDef.quests[Math.floor(Math.random() * randomNpcDef.quests.length)];
        const npcTitle = randomNpcDef.nameKey;
        const dialogStart = randomNpcDef.dialogStartKey;

        const npcOsmId = 'rnd_npc_' + Date.now() + '_' + i;
        const npcData = {
          name: npcTitle,
          baseKey: randomNpcDef.id,
          quest: randomQuest,
          dialog: { start: { text: dialogStart } }
        };`;

// We'll just replace the loop in injectRandomSpawns.
const oldLoopRegex = /const npcNames = \[\s*[\s\S]*?const npcData = \{\s*name: npcTitle,\s*dialog: \{ start: \{ text: dialogStart \} \}\s*\};/m;
if (file.match(oldLoopRegex)) {
  file = file.replace(oldLoopRegex, newInjectStart);
}

// Patch checkInteraction logic
const oldInteractionRegex = /if \(!injectedQ\.data\.dialog\.accept_quest\) \{[\s\S]*?\}\s*\}\s*return injectedQ;/m;
const newInteractionCode = `if (!injectedQ.data.dialog.accept_quest) {
            let baseKey = injectedQ.data.baseKey || injectedQ.data.dialog.start?.text?.replace('.start', '') || 'map.dialogs.trader';
            let questRequirement = { itemId: 'copper_coins', amount: 10 };
            let xpReward = 50;
            let rewardItem = 'tool';
            let questTitle = \`npc.\${baseKey}.quest_title\`;
            let questDesc = \`npc.\${baseKey}.quest_desc\`;
            
            // Legacy fallbacks
            if (baseKey.includes('garrosh')) { questRequirement = { itemId: 'iron_ore', amount: 3 }; xpReward = 100; rewardItem = 'sword'; }
            else if (baseKey.includes('alkuin')) { questRequirement = { itemId: 'mushrooms', amount: 3 }; xpReward = 100; rewardItem = 'healing_potion'; }
            else if (baseKey.includes('leif')) { questRequirement = { itemId: 'wood_log', amount: 5 }; xpReward = 150; rewardItem = 'copper_coins'; }
            else if (baseKey.includes('beggar')) { questRequirement = { itemId: 'bread', amount: 1 }; xpReward = 50; }
            else if (baseKey.includes('barista')) { questRequirement = { itemId: 'clean_water', amount: 1 }; xpReward = 75; rewardItem = 'strong_coffee'; }

            if (injectedQ.data.quest) {
              const q = injectedQ.data.quest;
              questRequirement = q.requirement;
              xpReward = q.xpReward;
              rewardItem = q.rewardItem;
              questTitle = \`npc_quests.\${q.questId}.title\`;
              questDesc = \`npc_quests.\${q.questId}.desc\`;
            }

            injectedQ.data.dialog = {
              start: { 
                text: \`npc.\${baseKey}.start\`, 
                options: [
                  { label: "npc.common.opt_tell_more", next: "ask_trade" },
                  { label: "npc.common.opt_no_time", next: "end" }
                ] 
              },
              ask_trade: {
                text: \`npc.\${baseKey}.ask_trade\`,
                options: [
                  { label: "npc.common.opt_help", next: "accept_quest" },
                  { label: "npc.common.opt_no_thanks", next: "end" }
                ]
              },
              accept_quest: {
                text: \`npc.\${baseKey}.accept_quest\`,
                action: "give_quest",
                questRequirement,
                xpReward,
                rewardItem,
                questTitle,
                questDesc,
                options: [{ label: "npc.common.opt_farewell", next: "end" }]
              },
              check_quest_progress: {
                text: \`npc.\${baseKey}.check_quest_progress\`,
                options: [
                  { label: "npc.common.give_items", next: "complete_quest" },
                  { label: "npc.common.not_yet", next: "end" }
                ]
              },
              complete_quest: {
                text: \`npc.\${baseKey}.complete_quest\`,
                action: "finish_quest",
                questRequirement,
                xpReward,
                rewardItem,
                options: [{ label: "npc.common.you_are_welcome", next: "end" }]
              }
            };
          }
        }
        return injectedQ;`;

if (file.match(oldInteractionRegex)) {
  file = file.replace(oldInteractionRegex, newInteractionCode);
} else {
  // Try alternative replacement if regex failed
  console.log("Failed to match oldInteractionRegex. Trying alternative...");
  const fallbackRegex = /if \(!injectedQ\.data\.dialog\.accept_quest\) \{[\s\S]*?return injectedQ;/g;
  file = file.replace(fallbackRegex, newInteractionCode);
}

fs.writeFileSync('src/services/QuestEngine.ts', file);
console.log("Patched QuestEngine.ts successfully!");
