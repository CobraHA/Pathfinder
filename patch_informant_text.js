const fs = require('fs');

const de = JSON.parse(fs.readFileSync('src/i18n/de.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('src/i18n/en.json', 'utf8'));

if (de.map.dialogs.informant) {
  de.map.dialogs.informant.ask_trade = "Oh, ich weiß, wo man verborgene Schätze und seltene Materialien findet. Für 15 Kupfermünzen verrate ich dir die genauen Koordinaten.";
  de.map.dialogs.informant.check_quest_progress = "Hast du die 15 Kupfermünzen für meine Geheimnisse?";
  de.map.dialogs.informant.quest_desc = "Der Informant verkauft Geheimnisse für 15 Kupfermünzen.";
}

if (en.map.dialogs.informant) {
  en.map.dialogs.informant.ask_trade = "Oh, I know where to find hidden treasures and rare materials. For 15 copper coins, I'll share the exact coordinates with you.";
  en.map.dialogs.informant.check_quest_progress = "Do you have the 15 copper coins for my secrets?";
  en.map.dialogs.informant.quest_desc = "The informant sells secrets for 15 copper coins.";
}

fs.writeFileSync('src/i18n/de.json', JSON.stringify(de, null, 2));
fs.writeFileSync('src/i18n/en.json', JSON.stringify(en, null, 2));
