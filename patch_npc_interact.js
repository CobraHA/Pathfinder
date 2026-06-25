const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/screens/MapScreen.js');

let content = fs.readFileSync(file, 'utf8');

const targetStr = `      } else {
        const req = npc.data?.dialog?.accept_quest?.questRequirement;`;

const replacementStr = `      } else {
        // FAILSAFE: Wenn der NPC gar keine Optionen hat (z.B. aus altem DB Cache), injiziere sie hier!
        if (npc.data?.dialog?.start && !npc.data.dialog.start.options) {
          npc.data.dialog.start.options = [
            { label: "Was genau machst du hier?", next: "explain_role" },
            { label: "Kann ich dir bei etwas helfen?", next: "offer_quest" },
            { label: "Auf Wiedersehen.", next: "end" }
          ];
          if (!npc.data.dialog.explain_role) {
            npc.data.dialog.explain_role = {
              text: "Ich versuche, in dieser rauen Welt zu überleben.",
              options: [
                { label: "Verstehe. Brauchst du dabei Hilfe?", next: "offer_quest" },
                { label: "Interessant. Bis bald!", next: "end" }
              ]
            };
          }
          if (!npc.data.dialog.offer_quest) {
            npc.data.dialog.offer_quest = {
              text: "Gut, dass du fragst! Ich brauche dringend diese Items.",
              action: "give_quest",
              questTitle: "Eine helfende Hand",
              questDesc: "Sammle Materialien, um diesem NPC zu helfen.",
              questRequirement: { itemId: "wood_log", amount: 3, maxGathers: 5 },
              xpReward: 50,
              rewardItem: "copper_coins",
              options: [{ label: "Verstanden!", next: "end" }]
            };
          }
          if (!npc.data.dialog.check_quest_progress) {
            npc.data.dialog.check_quest_progress = {
              text: "Hast du die Sachen dabei?",
              options: [
                { label: "map.dialogs.common.give_items", next: "complete_quest" },
                { label: "map.dialogs.common.not_yet", next: "end" }
              ]
            };
          }
          if (!npc.data.dialog.complete_quest) {
            npc.data.dialog.complete_quest = {
              text: "Perfekt! Hier ist dein Lohn.",
              action: "finish_quest",
              questRequirement: { itemId: "wood_log", amount: 3, maxGathers: 5 },
              xpReward: 50,
              rewardItem: "copper_coins",
              options: [{ label: "map.dialogs.common.you_are_welcome", next: "end" }]
            };
          }
        }

        const req = npc.data?.dialog?.accept_quest?.questRequirement || npc.data?.dialog?.offer_quest?.questRequirement;`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replacementStr);
  fs.writeFileSync(file, content, 'utf8');
  console.log("Patched MapScreen.js to fully inject missing dialog trees!");
} else {
  console.log("Target string not found in MapScreen.js");
}
