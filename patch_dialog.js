const fs = require('fs');
let file = fs.readFileSync('src/services/questEngine.ts', 'utf8');

const target1 = `        const npcData = {
          name: npcTitle,
          baseKey: randomNpcDef.id,
          quest: randomQuest,
          dialog: { start: { text: dialogStart } }
        };`;

const replacement1 = `        const npcData = {
          name: npcTitle,
          baseKey: randomNpcDef.id,
          quest: randomQuest,
          dialog: {
            start: {
              text: dialogStart,
              options: [
                { label: "Kann ich irgendwie helfen?", next: "offer_quest" },
                { label: "Auf Wiedersehen.", next: "end" }
              ]
            },
            offer_quest: {
              text: "Gut, dass du fragst! Ich brauche dringend diese Items. Besorge sie mir und ich werde dich belohnen.",
              action: "give_quest",
              questTitle: "Auftrag von " + npcTitle,
              questDesc: "Sammle die geforderten Gegenstände.",
              questRequirement: randomQuest.requirement,
              xpReward: randomQuest.xpReward,
              rewardItem: randomQuest.rewardItem,
              options: [
                { label: "Verstanden!", next: "end" }
              ]
            }
          }
        };`;

file = file.replace(target1, replacement1);

const target2 = `        nodeData = {
          name: title,
          baseKey: randomNpcDef.id,
          quest: randomQuest,
          dialog: { start: { text: randomNpcDef.dialogStartKey } }
        };`;

const replacement2 = `        nodeData = {
          name: title,
          baseKey: randomNpcDef.id,
          quest: randomQuest,
          dialog: {
            start: {
              text: randomNpcDef.dialogStartKey,
              options: [
                { label: "Kann ich irgendwie helfen?", next: "offer_quest" },
                { label: "Auf Wiedersehen.", next: "end" }
              ]
            },
            offer_quest: {
              text: "Gut, dass du fragst! Ich brauche dringend diese Items. Besorge sie mir und ich werde dich belohnen.",
              action: "give_quest",
              questTitle: "Auftrag von " + title,
              questDesc: "Sammle die geforderten Gegenstände.",
              questRequirement: randomQuest.requirement,
              xpReward: randomQuest.xpReward,
              rewardItem: randomQuest.rewardItem,
              options: [
                { label: "Verstanden!", next: "end" }
              ]
            }
          }
        };`;

file = file.replace(target2, replacement2);

fs.writeFileSync('src/services/questEngine.ts', file);
console.log("Patched dialog tree for new NPCs");
