const fs = require('fs');

const de = JSON.parse(fs.readFileSync('src/i18n/de.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('src/i18n/en.json', 'utf8'));

const updatesDe = {
  garrosh: {
    start: "Ah, ein Reisender! Mein Feuer erlischt fast und mir geht das Eisen aus.",
    opt_tell_more: "Was genau brauchst du für die Schmiede?",
    info: "Ich brauche unbedingt Eisenerz aus den nahen Minen, damit ich die Esse wieder anheizen kann. Wenn du mir welches bringst, schmiede ich dir im Gegenzug eine vernünftige Ausrüstung."
  },
  alkuin: {
    start: "Die Pestilenz greift um sich, wir benötigen dringend Kräuter.",
    opt_tell_more: "Was für Kräuter suchst du?",
    info: "Ich suche nach speziellen Pilzen und Heilwurzeln aus dem Wald. Nur damit kann ich ein wirksames Heilmittel brauen und den Kranken helfen."
  },
  leif: {
    start: "In letzter Zeit treiben sich Banditen vor den Toren herum.",
    opt_tell_more: "Gibt es Probleme mit Banditen?",
    info: "Ja, sie werden immer dreister. Wir müssen unsere Barrikaden verstärken. Wenn du mir Holz besorgst, zahle ich dir eine gute Belohnung."
  },
  beggar: {
    start: "Hast du etwas Brot oder Salz für mich?",
    opt_tell_more: "Wie kann ich dir helfen?",
    info: "Ich habe seit Tagen nichts gegessen und verliere meine Kraft. Bitte, schon eine kleine Portion würde mir helfen, den morgigen Tag zu überstehen."
  },
  barista: {
    start: "Hey! Hast du sauberes Wasser dabei?",
    opt_tell_more: "Was willst du im Tausch?",
    info: "Die Kaffeebohnen habe ich gerettet, aber mir fehlt sauberes Wasser. Wenn du mir welches abgibst, brühe ich dir einen extra starken Kaffee, der dir neue Energie verleiht."
  },
  trader: {
    start: "Sei gegrüßt. Suchst du nach nützlichen Vorräten?",
    opt_tell_more: "Was hast du im Angebot?",
    info: "Ich habe Werkzeuge, Nahrung und einige seltene Gegenstände gesammelt. Wenn du genug Kupfermünzen hast, werden wir sicher ins Geschäft kommen."
  },
  informant: {
    start: "Hehehe... du siehst aus, als könntest du einen guten Tipp gebrauchen.",
    opt_tell_more: "Was für Geheimnisse kennst du?",
    info: "Oh, ich weiß wo man verborgene Schätze und seltene Materialien findet. Für ein paar glänzende Münzen verrate ich dir die genauen Koordinaten."
  }
};

const updatesEn = {
  garrosh: {
    start: "Ah, a traveler! My fire is almost out and I'm running low on iron.",
    opt_tell_more: "What exactly do you need for the forge?",
    info: "I urgently need iron ore from the nearby mines so I can heat up the forge again. If you bring me some, I will craft you proper equipment in return."
  },
  alkuin: {
    start: "The pestilence is spreading, we urgently need herbs.",
    opt_tell_more: "What kind of herbs are you looking for?",
    info: "I am looking for special mushrooms and healing roots from the forest. It's the only way I can brew an effective cure and help the sick."
  },
  leif: {
    start: "Lately, bandits have been roaming outside the gates.",
    opt_tell_more: "Are there problems with bandits?",
    info: "Yes, they are getting bolder. We need to reinforce our barricades. If you get me some wood, I'll pay you a handsome reward."
  },
  beggar: {
    start: "Do you have any bread or salt for me?",
    opt_tell_more: "How can I help you?",
    info: "I haven't eaten in days and I'm losing my strength. Please, even a small portion would help me survive another day."
  },
  barista: {
    start: "Hey! Do you have any clean water?",
    opt_tell_more: "What do you want in return?",
    info: "I saved the coffee beans, but I'm out of clean water. If you spare some, I'll brew you an extra strong coffee that gives you new energy."
  },
  trader: {
    start: "Greetings. Are you looking for useful supplies?",
    opt_tell_more: "What do you have for sale?",
    info: "I've gathered tools, food, and some rare items. If you have enough copper coins, I'm sure we can make a deal."
  },
  informant: {
    start: "Hehehe... you look like you could use a good tip.",
    opt_tell_more: "What kind of secrets do you know?",
    info: "Oh, I know where to find hidden treasures and rare materials. For a few shiny coins, I'll share the exact coordinates with you."
  }
};

for (const npc in updatesDe) {
  if (!de.map.dialogs[npc]) de.map.dialogs[npc] = {};
  de.map.dialogs[npc].start = updatesDe[npc].start;
  de.map.dialogs[npc].opt_tell_more = updatesDe[npc].opt_tell_more;
  de.map.dialogs[npc].info = updatesDe[npc].info;
  de.map.dialogs[npc].ask_trade = updatesDe[npc].info; // Set ask_trade identically just in case
}

for (const npc in updatesEn) {
  if (!en.map.dialogs[npc]) en.map.dialogs[npc] = {};
  en.map.dialogs[npc].start = updatesEn[npc].start;
  en.map.dialogs[npc].opt_tell_more = updatesEn[npc].opt_tell_more;
  en.map.dialogs[npc].info = updatesEn[npc].info;
  en.map.dialogs[npc].ask_trade = updatesEn[npc].info; // Set ask_trade identically just in case
}

fs.writeFileSync('src/i18n/de.json', JSON.stringify(de, null, 2));
fs.writeFileSync('src/i18n/en.json', JSON.stringify(en, null, 2));
