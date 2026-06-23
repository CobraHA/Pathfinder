const fs = require('fs');

const de = JSON.parse(fs.readFileSync('src/i18n/de.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('src/i18n/en.json', 'utf8'));

const infoDe = {
  garrosh: "Garrosh bittet dich, ihm Eisenerz zu bringen, damit er seine Esse befeuern und Ausrüstung für dich schmieden kann.",
  alkuin: "Mönch Alkuin benötigt dringend Pilze und Heilwurzeln aus dem Wald, um ein Heilmittel gegen die Pestilenz herzustellen.",
  leif: "Wache Leif sucht nach mutigen Helfern, die Holz für die Barrikaden sammeln oder die Banditen vor den Toren bekämpfen.",
  beggar: "Dieser ausgehungerte Überlebende fleht dich um ein Stück Brot oder etwas Salz an, um einen weiteren Tag zu überstehen.",
  barista: "Der Barista bietet dir an, dein überschüssiges Wasser gegen eine aufputschende Tasse Kaffee einzutauschen.",
  trader: "Dieser Händler bietet dir wertvolle Vorräte und seltene Gegenstände im Tausch gegen deine gesammelten Münzen an.",
  informant: "Gegen eine großzügige Bezahlung mit Kupfermünzen verrät dir der Informant nützliche Geheimnisse und versteckte Orte."
};

const infoEn = {
  garrosh: "Garrosh asks you to bring him iron ore so he can fuel his forge and craft equipment for you.",
  alkuin: "Monk Alkuin urgently needs mushrooms and healing roots from the forest to brew a cure for the pestilence.",
  leif: "Guard Leif is looking for brave helpers to gather wood for the barricades or fight the bandits outside the gates.",
  beggar: "This starving survivor begs you for a piece of bread or some salt to survive another day.",
  barista: "The barista offers to trade your excess water for an energizing cup of coffee.",
  trader: "This trader offers valuable supplies and rare items in exchange for your collected coins.",
  informant: "For a generous payment of copper coins, the informant will share useful secrets and hidden locations with you."
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
