const fs = require('fs');

const de = JSON.parse(fs.readFileSync('src/i18n/de.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('src/i18n/en.json', 'utf8'));

const updatesDe = {
  garrosh: { quest_title: "Erzbeschaffung für Garrosh", quest_desc: "Garrosh der Schmied benötigt dringend Eisenerz aus den Minen, um seine Esse anzuheizen." },
  leif: { quest_title: "Verstärkung der Barrikaden", quest_desc: "Wache Leif benötigt Holz, um die Barrikaden gegen die Banditen zu verstärken." },
  beggar: { quest_title: "Eine milde Gabe", quest_desc: "Ein Bettler hungert. Bringe ihm eine Portion Brot, um ihm zu helfen." },
  barista: { quest_title: "Kaffeepause", quest_desc: "Der Barista benötigt sauberes Wasser, um frischen Kaffee zu brühen." },
  trader: { quest_title: "Handelswaren", quest_desc: "Der Händler bietet Vorräte im Austausch für Kupfermünzen." },
  informant: { quest_title: "Erkaufte Geheimnisse", quest_desc: "Der Informant verkauft Geheimnisse für Kupfermünzen." },
  alkuin: { quest_title: "Heilkräuter für die Kranken", quest_desc: "Mönch Alkuin benötigt spezielle Pilze aus dem Wald, um eine Medizin gegen die Pestilenz zu brauen." }
};

const updatesEn = {
  garrosh: { quest_title: "Ore for Garrosh", quest_desc: "Garrosh the blacksmith urgently needs iron ore from the mines to heat up his forge." },
  leif: { quest_title: "Reinforcing the Barricades", quest_desc: "Guard Leif needs wood to reinforce the barricades against the bandits." },
  beggar: { quest_title: "An Act of Kindness", quest_desc: "A beggar is starving. Bring him a portion of bread to help him." },
  barista: { quest_title: "Coffee Break", quest_desc: "The barista needs clean water to brew fresh coffee." },
  trader: { quest_title: "Trade Goods", quest_desc: "The trader offers supplies in exchange for copper coins." },
  informant: { quest_title: "Purchased Secrets", quest_desc: "The informant sells secrets for copper coins." },
  alkuin: { quest_title: "Healing Herbs", quest_desc: "Monk Alkuin needs special mushrooms from the forest to brew a cure for the pestilence." }
};

for (const npc in updatesDe) {
  if (de.map.dialogs[npc]) Object.assign(de.map.dialogs[npc], updatesDe[npc]);
}

for (const npc in updatesEn) {
  if (en.map.dialogs[npc]) Object.assign(en.map.dialogs[npc], updatesEn[npc]);
}

fs.writeFileSync('src/i18n/de.json', JSON.stringify(de, null, 2));
fs.writeFileSync('src/i18n/en.json', JSON.stringify(en, null, 2));
