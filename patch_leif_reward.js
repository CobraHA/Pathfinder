const fs = require('fs');

let qe = fs.readFileSync('src/services/QuestEngine.ts', 'utf8');

qe = qe.replace(/rewardItem = 'coins'/g, "rewardItem = 'copper_coins'");

fs.writeFileSync('src/services/QuestEngine.ts', qe);
