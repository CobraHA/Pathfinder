const fs = require('fs');
let file = fs.readFileSync('src/services/questEngine.ts', 'utf8');

const target1 = `              options: [
                { label: "Verstanden!", next: "end" }
              ]
            }
          }
        };

        newNodes.push({`;

const replacement1 = `              options: [
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
          }
        };

        newNodes.push({`;

file = file.replace(target1, replacement1);

const target2 = `              options: [
                { label: "Verstanden!", next: "end" }
              ]
            }
          }
        };
      }

      nodes.push({`;

const replacement2 = `              options: [
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
          }
        };
      }

      nodes.push({`;

file = file.replace(target2, replacement2);

fs.writeFileSync('src/services/questEngine.ts', file);
console.log("Patched missing quest progress nodes");
