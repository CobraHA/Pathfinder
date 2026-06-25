const fs = require('fs');

const fixFile = (p) => {
  let c = fs.readFileSync(p, 'utf8');
  c = c.replace(/"npc\.common\.goodbye"/g, '"npc.common.opt_farewell"');
  fs.writeFileSync(p, c, 'utf8');
};

fixFile('src/services/QuestEngine.ts');
fixFile('src/screens/MapScreen.js');

console.log("Fixed goodbye keys!");
