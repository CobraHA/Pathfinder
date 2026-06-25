const fs = require('fs');
const file = 'src/services/QuestEngine.ts';
let content = fs.readFileSync(file, 'utf8');

const regex = /let npcDialog = \{\s*start: \{[\s\S]*?quest_already_completed: \{\s*text: "Vielen Dank für deine Hilfe zuvor!",\s*options: \[\{ label: "Kein Problem.", next: "end" \}\]\s*\}\s*\}\s*\};/g;

const newDialogs = `let npcDialog = {};
        if (randomNpcDef.id === 'drunkard_hostile') {
          npcDialog = {
            start: {
              text: \`npc.\${randomNpcDef.id}.start\`,
              options: [
                { label: \`npc.\${randomNpcDef.id}.opt_calm\`, next: "insult_back" },
                { label: \`npc.\${randomNpcDef.id}.opt_insult\`, next: "fight_back" }
              ]
            },
            insult_back: {
              text: \`npc.\${randomNpcDef.id}.insult_back\`,
              options: [{ label: "Weitergehen", next: "end" }]
            },
            fight_back: {
              text: \`npc.\${randomNpcDef.id}.fight_back\`,
              options: [{ label: "Kopfschüttelnd weitergehen", next: "end" }]
            }
          };
        } else if (randomNpcDef.id === 'thief') {
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
        } else {
          npcDialog = {
            start: {
              text: \`npc.\${randomNpcDef.id}.start\`,
              options: [
                { label: "Was genau machst du hier?", next: "explain_role" },
                { label: "Kann ich dir bei etwas helfen?", next: "offer_quest" },
                ...(randomNpcDef.id === 'beggar' ? [{ label: "npc.beggar.opt_give_food", action: "open_donation_modal" }] : []),
                { label: "Auf Wiedersehen.", next: "end" }
              ]
            },
            explain_role: {
              text: \`npc.\${randomNpcDef.id}.explain_role\`,
              options: [
                { label: \`npc.\${randomNpcDef.id}.opt_explain_1\`, next: "explain_role_1" },
                { label: "npc.common.opt_farewell", next: "end" }
              ]
            },
            ...((randomNpcDef.dialogExchanges !== 1) ? {
              explain_role_1: {
                text: \`npc.\${randomNpcDef.id}.explain_role_1\`,
                options: [
                  { label: \`npc.\${randomNpcDef.id}.opt_explain_1_1\`, next: "explain_role_2" },
                  { label: "npc.common.opt_farewell", next: "end" }
                ]
              }
            } : {}),
            ...((randomNpcDef.dialogExchanges === 3) ? {
              explain_role_2: {
                text: \`npc.\${randomNpcDef.id}.explain_role_2\`,
                options: [
                  { label: \`npc.\${randomNpcDef.id}.opt_explain_2_1\`, next: "explain_role_3" },
                  { label: "npc.common.opt_farewell", next: "end" }
                ]
              },
              explain_role_3: {
                text: \`npc.\${randomNpcDef.id}.explain_role_3\`,
                options: [
                  { label: \`npc.\${randomNpcDef.id}.opt_explain_3_1\`, next: "offer_quest" },
                  { label: "npc.common.opt_farewell", next: "end" }
                ]
              }
            } : ((randomNpcDef.dialogExchanges !== 1) ? {
              explain_role_2: {
                text: \`npc.\${randomNpcDef.id}.explain_role_2\`,
                options: [
                  { label: \`npc.\${randomNpcDef.id}.opt_explain_2_1\`, next: "offer_quest" },
                  { label: "npc.common.opt_farewell", next: "end" }
                ]
              }
            } : {})),
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
        }`;

content = content.replace(regex, newDialogs);
fs.writeFileSync(file, content, 'utf8');
console.log("Patched QuestEngine.ts custom dialogs");
