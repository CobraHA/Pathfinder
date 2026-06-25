const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/screens/MapScreen.js');

let content = fs.readFileSync(file, 'utf8');

const targetFastComplete = `                  fast_complete_node: {
                    text: npc.data.dialog.complete_quest?.text || "Perfekt! Hier ist dein Lohn.",
                    action: "fast_complete_quest",
                    questRequirement: req,
                    xpReward: npc.data.dialog.accept_quest?.xpReward,
                    rewardItem: npc.data.dialog.accept_quest?.rewardItem,
                    questTitle: npc.data.dialog.accept_quest?.questTitle,
                    questDesc: npc.data.dialog.accept_quest?.questDesc,
                    options: [{ label: "npc.common.you_are_welcome", next: "end" }]
                  }`;

const replacementFastComplete = `                  fast_complete_node: {
                    text: npc.data.dialog.complete_quest?.text || "Perfekt! Hier ist dein Lohn.",
                    action: "fast_complete_quest",
                    questRequirement: req,
                    xpReward: npc.data.dialog.accept_quest?.xpReward || npc.data.dialog.offer_quest?.xpReward,
                    rewardItem: npc.data.dialog.accept_quest?.rewardItem || npc.data.dialog.offer_quest?.rewardItem,
                    questTitle: npc.data.dialog.accept_quest?.questTitle || npc.data.dialog.offer_quest?.questTitle,
                    questDesc: npc.data.dialog.accept_quest?.questDesc || npc.data.dialog.offer_quest?.questDesc,
                    options: [{ label: "npc.common.you_are_welcome", next: "end" }]
                  }`;

if (content.includes(targetFastComplete)) {
  content = content.replace(targetFastComplete, replacementFastComplete);
  fs.writeFileSync(file, content, 'utf8');
  console.log("Patched MapScreen.js fast complete node successfully.");
} else {
  console.log("fast_complete_node block not found for replacement.");
}
