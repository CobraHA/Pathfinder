const fs = require('fs');
const file = 'src/services/QuestEngine.ts';
let content = fs.readFileSync(file, 'utf8');

const regex = /else if \(randomNpcDef.id === 'thief'\) \{[\s\S]*?\}\s*else\s*\{/g;

const replacement = `else if (randomNpcDef.id === 'thief') {
          npcDialog = {
            start: {
              text: \`npc.\${randomNpcDef.id}.start\`,
              options: [
                { label: \`npc.\${randomNpcDef.id}.opt_rob\`, action: "rob_player" }
              ]
            },
            robbed_success: {
              text: \`npc.\${randomNpcDef.id}.robbed_success\`,
              options: [{ label: "...", next: "end" }]
            },
            robbed_empty: {
              text: \`npc.\${randomNpcDef.id}.robbed_empty\`,
              options: [{ label: "...", next: "end" }]
            }
          };
        } else if (randomNpcDef.id === 'merchant' || randomNpcDef.id === 'trader') {
          npcDialog = {
            start: {
              text: \`npc.\${randomNpcDef.id}.start\`,
              options: [
                { label: "Lass mich deine Waren sehen.", action: "open_merchant_shop" },
                { label: "Was genau machst du hier?", next: "explain_role" },
                { label: "Kann ich dir bei etwas helfen?", next: "offer_quest" },
                { label: "Auf Wiedersehen.", next: "end" }
              ]
            },
            explain_role: {
              text: \`npc.\${randomNpcDef.id}.explain_role\`,
              options: [
                { label: "npc.common.opt_farewell", next: "end" }
              ]
            },
            offer_quest: {
              text: "Gut, dass du fragst! Ich brauche dringend diese Items. Besorge sie mir und ich werde dich angemessen entlohnen.",
              action: "give_quest",
              questTitle: \`npc.\${randomNpcDef.id}.quest_title\`,
              questDesc: \`npc.\${randomNpcDef.id}.quest_desc\`,
              questRequirement: randomQuest.requirement,
              xpReward: randomQuest.xpReward,
              rewardItem: randomQuest.rewardItem,
              options: [
                { label: "Verstanden!", next: "end" }
              ]
            },
            check_quest_progress: {
              text: \`npc.\${randomNpcDef.id}.check_quest_progress\`,
              options: [
                { label: "map.dialogs.common.give_items", next: "complete_quest" },
                { label: "map.dialogs.common.not_yet", next: "end" }
              ]
            },
            complete_quest: {
              text: \`npc.\${randomNpcDef.id}.complete_quest\`,
              action: "finish_quest",
              questRequirement: randomQuest.requirement,
              xpReward: randomQuest.xpReward,
              rewardItem: randomQuest.rewardItem,
              options: [{ label: "map.dialogs.common.you_are_welcome", next: "end" }]
            },
            quest_already_completed: {
              text: "Vielen Dank für deine Hilfe zuvor!",
              options: [{ label: "Kein Problem.", next: "end" }]
            }
          };
        } else {`;

content = content.replace(regex, replacement);
fs.writeFileSync(file, content, 'utf8');
console.log("Patched QuestEngine.ts for merchant shop action!");
