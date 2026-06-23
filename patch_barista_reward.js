const fs = require('fs');
let qe = fs.readFileSync('src/services/QuestEngine.ts', 'utf8');
qe = qe.replace(/rewardItem = 'coffee'/g, "rewardItem = 'strong_coffee'");
fs.writeFileSync('src/services/QuestEngine.ts', qe);
