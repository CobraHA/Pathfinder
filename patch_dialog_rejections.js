const fs = require('fs');

const de = JSON.parse(fs.readFileSync('src/i18n/de.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('src/i18n/en.json', 'utf8'));

const updatesDe = {
  garrosh: {
    opt_no_time: "Ich habe gerade keine Zeit für Schmiedearbeiten.",
    opt_no_thanks: "Tut mir leid, die Minen sind mir zu gefährlich."
  },
  alkuin: {
    opt_no_time: "Ich muss weiter, viel Glück.",
    opt_no_thanks: "Ich kenne mich mit Kräutern leider nicht aus."
  },
  leif: {
    opt_no_time: "Ich halte mich aus euren Problemen raus.",
    opt_no_thanks: "Dafür riskiere ich nicht mein Leben."
  },
  beggar: {
    opt_no_time: "Lass mich in Ruhe.",
    opt_no_thanks: "Ich habe selbst kaum genug zum Überleben."
  },
  barista: {
    opt_no_time: "Nein, mein Wasser brauche ich selbst.",
    opt_no_thanks: "Ich trinke lieber mein Wasser, als es für Kaffee wegzugeben."
  },
  trader: {
    opt_no_time: "Nein, ich bin wunschlos glücklich.",
    opt_no_thanks: "Ich behalte meine Münzen lieber."
  },
  informant: {
    opt_no_time: "Verschwinde, ich brauche keine zwielichtigen Tipps.",
    opt_no_thanks: "Meine Münzen sind mir zu schade für Gerüchte."
  }
};

const updatesEn = {
  garrosh: {
    opt_no_time: "I don't have time for blacksmithing right now.",
    opt_no_thanks: "Sorry, the mines are too dangerous for me."
  },
  alkuin: {
    opt_no_time: "I must move on, good luck.",
    opt_no_thanks: "I'm afraid I don't know much about herbs."
  },
  leif: {
    opt_no_time: "I'm staying out of your problems.",
    opt_no_thanks: "I won't risk my life for that."
  },
  beggar: {
    opt_no_time: "Leave me alone.",
    opt_no_thanks: "I barely have enough to survive myself."
  },
  barista: {
    opt_no_time: "No, I need my water for myself.",
    opt_no_thanks: "I prefer keeping my water over a cup of coffee."
  },
  trader: {
    opt_no_time: "No, I have everything I need.",
    opt_no_thanks: "I'd rather keep my coins."
  },
  informant: {
    opt_no_time: "Get lost, I don't need shady tips.",
    opt_no_thanks: "My coins are too precious for rumors."
  }
};

for (const npc in updatesDe) {
  if (de.map.dialogs[npc]) {
    de.map.dialogs[npc].opt_no_time = updatesDe[npc].opt_no_time;
    de.map.dialogs[npc].opt_no_thanks = updatesDe[npc].opt_no_thanks;
  }
}

for (const npc in updatesEn) {
  if (en.map.dialogs[npc]) {
    en.map.dialogs[npc].opt_no_time = updatesEn[npc].opt_no_time;
    en.map.dialogs[npc].opt_no_thanks = updatesEn[npc].opt_no_thanks;
  }
}

fs.writeFileSync('src/i18n/de.json', JSON.stringify(de, null, 2));
fs.writeFileSync('src/i18n/en.json', JSON.stringify(en, null, 2));

let qe = fs.readFileSync('src/services/QuestEngine.ts', 'utf8');

// Replace mock NPC generic decline options
qe = qe.replace(/"label": "map\.dialogs\.common\.no_time",[\s\S]*?"next": "end"/g, (match, offset) => {
    const textBefore = qe.substring(0, offset);
    const titleMatches = [...textBefore.matchAll(/"title": "map\.markers\.(\w+)"/g)];
    if (titleMatches.length > 0) {
        let npcId = titleMatches[titleMatches.length - 1][1];
        if (npcId === 'survivor_barista') npcId = 'barista';
        if (npcId === 'trader_bot') npcId = 'trader';
        if (npcId === 'drunk_informant') npcId = 'informant';
        if (updatesEn[npcId]) {
             return `"label": "map.dialogs.${npcId}.opt_no_time",\n              "next": "end"`;
        }
    }
    return match;
});

qe = qe.replace(/"label": "map\.dialogs\.common\.no_thanks",[\s\S]*?"next": "end"/g, (match, offset) => {
    const textBefore = qe.substring(0, offset);
    const titleMatches = [...textBefore.matchAll(/"title": "map\.markers\.(\w+)"/g)];
    if (titleMatches.length > 0) {
        let npcId = titleMatches[titleMatches.length - 1][1];
        if (npcId === 'survivor_barista') npcId = 'barista';
        if (npcId === 'trader_bot') npcId = 'trader';
        if (npcId === 'drunk_informant') npcId = 'informant';
        if (updatesEn[npcId]) {
             return `"label": "map.dialogs.${npcId}.opt_no_thanks",\n              "next": "end"`;
        }
    }
    return match;
});

// Also replace the dynamic logic
qe = qe.replace(/\{ label: "map\.dialogs\.common\.no_time", next: "end" \}/g, '{ label: `${baseKey}.opt_no_time`, next: "end" }');
qe = qe.replace(/\{ label: "map\.dialogs\.common\.no_thanks", next: "end" \}/g, '{ label: `${baseKey}.opt_no_thanks`, next: "end" }');

fs.writeFileSync('src/services/QuestEngine.ts', qe);
