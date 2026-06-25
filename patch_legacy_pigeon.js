const fs = require('fs');
let file = fs.readFileSync('src/screens/QuestLogScreen.js', 'utf8');

const target = `if (hasAmount + turnedIn >= quest.requirement.amount && quest.npcLocation) {`;
const replacement = `if (hasAmount + turnedIn >= quest.requirement.amount) {`;

file = file.replace(target, replacement);
fs.writeFileSync('src/screens/QuestLogScreen.js', file);
console.log("Patched legacy quests support for pigeons");
