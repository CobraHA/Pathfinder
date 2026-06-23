const fs = require('fs');

const de = JSON.parse(fs.readFileSync('src/i18n/de.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('src/i18n/en.json', 'utf8'));

const infoDe = {
  garrosh: "Garrosh ist ein stämmiger Schmied, der Waffen und Rüstungen herstellt.",
  alkuin: "Mönch Alkuin widmet sein Leben der Heilkunst und der Suche nach einem Gegenmittel.",
  leif: "Wache Leif beschützt die Überlebenden vor Banditen und wilden Tieren.",
  beggar: "Ein verzweifelter Überlebender, der um Essen und Trinken bettelt.",
  barista: "Ein Überlebender, der irgendwie immer noch frischen Kaffee aufbrühen kann.",
  trader: "Ein stoischer Händler, der die seltensten Waren anbietet.",
  informant: "Ein zwielichtiger Informant. Er weiß viel, wenn der Preis stimmt."
};

const infoEn = {
  garrosh: "Garrosh is a sturdy blacksmith crafting weapons and armor.",
  alkuin: "Monk Alkuin dedicates his life to healing and finding a cure.",
  leif: "Guard Leif protects the survivors from bandits and wild animals.",
  beggar: "A desperate survivor begging for food and water.",
  barista: "A survivor who somehow still manages to brew fresh coffee.",
  trader: "A stoic trader offering the rarest of goods.",
  informant: "A shady informant. He knows a lot, for the right price."
};

for (const npc in infoDe) {
  if (de.map.dialogs[npc]) {
    de.map.dialogs[npc].info = infoDe[npc];
  }
}

for (const npc in infoEn) {
  if (en.map.dialogs[npc]) {
    en.map.dialogs[npc].info = infoEn[npc];
  }
}

fs.writeFileSync('src/i18n/de.json', JSON.stringify(de, null, 2));
fs.writeFileSync('src/i18n/en.json', JSON.stringify(en, null, 2));
