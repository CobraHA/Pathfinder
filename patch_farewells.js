const fs = require('fs');

const de = JSON.parse(fs.readFileSync('src/i18n/de.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('src/i18n/en.json', 'utf8'));

const updatesDe = {
  garrosh: { opt_farewell: "Ich werde mich beeilen." },
  alkuin: { opt_farewell: "Möge das Licht mit dir sein." },
  leif: { opt_farewell: "Ich passe auf mich auf." },
  beggar: { opt_farewell: "Viel Glück da draußen." },
  barista: { opt_farewell: "Mach den Kaffee schon mal warm!" },
  trader: { opt_farewell: "Bis zum nächsten Geschäft." },
  informant: { opt_farewell: "Ich werde die Augen offen halten." }
};

const updatesEn = {
  garrosh: { opt_farewell: "I will hurry." },
  alkuin: { opt_farewell: "May the light be with you." },
  leif: { opt_farewell: "I'll be careful." },
  beggar: { opt_farewell: "Good luck out there." },
  barista: { opt_farewell: "Keep the coffee warm!" },
  trader: { opt_farewell: "Until our next deal." },
  informant: { opt_farewell: "I'll keep my eyes open." }
};

for (const npc in updatesDe) {
  if (de.map.dialogs[npc]) {
    de.map.dialogs[npc].opt_farewell = updatesDe[npc].opt_farewell;
  }
}

for (const npc in updatesEn) {
  if (en.map.dialogs[npc]) {
    en.map.dialogs[npc].opt_farewell = updatesEn[npc].opt_farewell;
  }
}

fs.writeFileSync('src/i18n/de.json', JSON.stringify(de, null, 2));
fs.writeFileSync('src/i18n/en.json', JSON.stringify(en, null, 2));

let qe = fs.readFileSync('src/services/QuestEngine.ts', 'utf8');

// The dynamic logic replacement
qe = qe.replace(/\{ label: "map\.dialogs\.common\.see_you", next: "end" \}/g, '{ label: `${baseKey}.opt_farewell`, next: "end" }');

// We need to replace all instances of "map.dialogs.common.see_you" in mock NPCs with the specific NPC's opt_farewell
qe = qe.replace(/"label": "map\.dialogs\.common\.see_you",[\s\S]*?"next": "end"/g, (match, offset) => {
    const textBefore = qe.substring(0, offset);
    const titleMatches = [...textBefore.matchAll(/"title": "map\.markers\.(\w+)"/g)];
    if (titleMatches.length > 0) {
        let npcId = titleMatches[titleMatches.length - 1][1];
        if (npcId === 'survivor_barista') npcId = 'barista';
        if (npcId === 'trader_bot') npcId = 'trader';
        if (npcId === 'drunk_informant') npcId = 'informant';
        if (updatesEn[npcId]) {
             return `"label": "map.dialogs.${npcId}.opt_farewell",\n              "next": "end"`;
        }
    }
    return match;
});

// Replace hardcoded German strings in beggar mocks
qe = qe.replace(/"label": "Erzähl mir mehr\.",/g, '"label": "map.dialogs.beggar.opt_tell_more",');
qe = qe.replace(/"label": "Keine Zeit\.",/g, '"label": "map.dialogs.beggar.opt_no_time",');
qe = qe.replace(/"label": "Ich helfe dir\. \(Quest\)",/g, '"label": "map.dialogs.beggar.opt_help",');
qe = qe.replace(/"label": "Nein danke\.",/g, '"label": "map.dialogs.beggar.opt_no_thanks",');
qe = qe.replace(/"label": "Bis bald\.",/g, '"label": "map.dialogs.beggar.opt_farewell",');

// Also update hardcoded dialogue text to reference translation keys
qe = qe.replace(/"text": "Hast du etwas Brot oder Salz für mich\?"/g, '"text": "map.dialogs.beggar.start"');
qe = qe.replace(/"text": "Ich verhungere fast\."/g, '"text": "map.dialogs.beggar.ask_trade"');
qe = qe.replace(/"text": "Danke für deine Güte\."/g, '"text": "map.dialogs.beggar.accept_quest"');

fs.writeFileSync('src/services/QuestEngine.ts', qe);
