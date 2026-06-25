const fs = require('fs');
const dePath = 'src/i18n/de.json';
const deJson = JSON.parse(fs.readFileSync(dePath, 'utf8'));

if (!deJson.map.dialogs.common) {
  deJson.map.dialogs.common = {};
}
deJson.map.dialogs.common.give_items = "Hier sind die Gegenstände.";
deJson.map.dialogs.common.not_yet = "Ich brauche noch etwas Zeit.";
deJson.map.dialogs.common.you_are_welcome = "Gern geschehen!";

fs.writeFileSync(dePath, JSON.stringify(deJson, null, 2));
console.log("Added common dialog keys to de.json");
