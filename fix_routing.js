const fs = require('fs');

function fixQuestEngine() {
  const p = 'src/services/QuestEngine.ts';
  let c = fs.readFileSync(p, 'utf8');
  c = c.replace(
    'next: (randomNpcDef.dialogExchanges === 3) ? "explain_role_2" : "offer_quest"',
    'next: "explain_role_2"'
  );
  c = c.replace(
    'next: (randomNpcDef.dialogExchanges === 1) ? "offer_quest" : "explain_role_1"',
    'next: (randomNpcDef.dialogExchanges === 1) ? "offer_quest" : "explain_role_1"'
  );
  fs.writeFileSync(p, c, 'utf8');
}

function fixMapScreen() {
  const p = 'src/screens/MapScreen.js';
  let c = fs.readFileSync(p, 'utf8');
  c = c.replace(
    'next: (exchanges === 3) ? "explain_role_2" : "offer_quest"',
    'next: "explain_role_2"'
  );
  fs.writeFileSync(p, c, 'utf8');
}

fixQuestEngine();
fixMapScreen();
console.log("Fixed routing!");
