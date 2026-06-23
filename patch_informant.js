const fs = require('fs');

let qe = fs.readFileSync('src/services/QuestEngine.ts', 'utf8');

// Replace trader coins with copper_coins
qe = qe.replace(/questRequirement = \{ itemId: 'coins', amount: 10 \}/g, "questRequirement = { itemId: 'copper_coins', amount: 10 }");
// Replace informant coins with copper_coins and amount 15
qe = qe.replace(/questRequirement = \{ itemId: 'coins', amount: 5 \}/g, "questRequirement = { itemId: 'copper_coins', amount: 15 }");

fs.writeFileSync('src/services/QuestEngine.ts', qe);
