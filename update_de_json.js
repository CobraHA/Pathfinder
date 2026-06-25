const fs = require('fs');
const dePath = 'src/i18n/de.json';
const deJson = JSON.parse(fs.readFileSync(dePath, 'utf8'));

deJson.npc.bard = {
  name: "Barde",
  start: "Sei gegrüßt, Wanderer! Möchtest du einem einfachen Barden ein Lied abkaufen? Oder vielleicht hast du ja eine Aufgabe für mich?"
};

fs.writeFileSync(dePath, JSON.stringify(deJson, null, 2));
console.log("Added Bard to de.json");
