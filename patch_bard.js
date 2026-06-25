const fs = require('fs');
let file = fs.readFileSync('src/config/NPCData.ts', 'utf8');

const target = `    ]
  }
];`;

const replacement = `    ]
  },
  {
    id: "bard",
    nameKey: "npc.bard.name",
    dialogStartKey: "npc.bard.start",
    quests: [
      { questId: "bard_q1", requirement: { itemId: "clean_water", amount: 3 }, xpReward: 100, rewardItem: "copper_coins" },
      { questId: "bard_q2", requirement: { itemId: "berries", amount: 5 }, xpReward: 120, rewardItem: "copper_coins" },
      { questId: "bard_q3", requirement: { itemId: "copper_coins", amount: 5 }, xpReward: 50, rewardItem: "bread" },
    ]
  }
];`;

file = file.replace(target, replacement);

fs.writeFileSync('src/config/NPCData.ts', file);
console.log("Added Bard to NPCData.ts");
