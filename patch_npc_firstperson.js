const fs = require('fs');

const de = JSON.parse(fs.readFileSync('src/i18n/de.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('src/i18n/en.json', 'utf8'));

const infoDe = {
  garrosh: {
    info: "Ich bin Schmied Garrosh. Bring mir Eisenerz, damit ich meine Esse befeuern und dir eine vernünftige Ausrüstung schmieden kann.",
    opt_tell_more: "Was genau brauchst du für die Schmiede?",
    opt_help: "Ich werde dir das Eisenerz besorgen."
  },
  alkuin: {
    info: "Ich bin Mönch Alkuin. Ich brauche dringend Pilze und Heilwurzeln aus dem Wald, um ein Heilmittel gegen diese schreckliche Pestilenz herzustellen.",
    opt_tell_more: "Was für Kräuter suchst du?",
    opt_help: "Ich suche dir die Heilwurzeln im Wald."
  },
  leif: {
    info: "Hier spricht Wache Leif. Ich suche nach Freiwilligen, die mir Holz für die Barrikaden besorgen oder helfen, die Banditen vor den Toren zu bekämpfen.",
    opt_tell_more: "Gibt es Probleme mit Banditen?",
    opt_help: "Ich besorge das Holz für die Barrikaden."
  },
  beggar: {
    info: "Bitte... Ich bin am Verhungern. Hast du vielleicht ein Stück Brot oder etwas Salz für mich?",
    opt_tell_more: "Wie kann ich dir helfen?",
    opt_help: "Ich werde versuchen, etwas Essen zu finden."
  },
  barista: {
    info: "Hey, ich bin der Barista. Wenn du mir dein überschüssiges Wasser überlässt, brühe ich dir einen heißen, aufputschenden Kaffee.",
    opt_tell_more: "Kaffee? Was willst du im Tausch?",
    opt_help: "Deal, ich bringe dir das Wasser."
  },
  trader: {
    info: "Ich bin Händler. Wenn du die nötigen Münzen hast, biete ich dir im Tausch meine besten Vorräte an.",
    opt_tell_more: "Was hast du im Angebot?",
    opt_help: "Lass uns handeln."
  },
  informant: {
    info: "Psst... ich weiß Dinge, die sonst niemand weiß. Für ein paar Kupfermünzen teile ich meine Geheimnisse mit dir.",
    opt_tell_more: "Was für Geheimnisse kennst du?",
    opt_help: "Hier sind die Münzen, lass hören."
  }
};

const infoEn = {
  garrosh: {
    info: "I am Garrosh the blacksmith. Bring me iron ore so I can fuel my forge and craft you some proper equipment.",
    opt_tell_more: "What exactly do you need for the forge?",
    opt_help: "I will get the iron ore for you."
  },
  alkuin: {
    info: "I am Monk Alkuin. I urgently need mushrooms and healing roots from the forest to brew a cure against this terrible pestilence.",
    opt_tell_more: "What kind of herbs are you looking for?",
    opt_help: "I'll find the healing roots in the forest."
  },
  leif: {
    info: "Guard Leif here. I am looking for volunteers to gather wood for the barricades or help fight the bandits outside the gates.",
    opt_tell_more: "Are there problems with bandits?",
    opt_help: "I'll get the wood for the barricades."
  },
  beggar: {
    info: "Please... I am starving. Do you perhaps have a piece of bread or some salt for me?",
    opt_tell_more: "How can I help you?",
    opt_help: "I will try to find some food."
  },
  barista: {
    info: "Hey, I'm the barista. If you give me your excess water, I'll brew you a hot, energizing coffee.",
    opt_tell_more: "Coffee? What do you want in return?",
    opt_help: "Deal, I'll bring you the water."
  },
  trader: {
    info: "I am a trader. If you have the necessary coins, I'll offer you my best supplies in exchange.",
    opt_tell_more: "What do you have for sale?",
    opt_help: "Let's trade."
  },
  informant: {
    info: "Psst... I know things no one else knows. For a few copper coins, I'll share my secrets with you.",
    opt_tell_more: "What kind of secrets do you know?",
    opt_help: "Here are the coins, let's hear it."
  }
};

for (const npc in infoDe) {
  if (de.map.dialogs[npc]) {
    de.map.dialogs[npc].info = infoDe[npc].info;
    de.map.dialogs[npc].opt_tell_more = infoDe[npc].opt_tell_more;
    de.map.dialogs[npc].opt_help = infoDe[npc].opt_help;
  }
}

for (const npc in infoEn) {
  if (en.map.dialogs[npc]) {
    en.map.dialogs[npc].info = infoEn[npc].info;
    en.map.dialogs[npc].opt_tell_more = infoEn[npc].opt_tell_more;
    en.map.dialogs[npc].opt_help = infoEn[npc].opt_help;
  }
}

fs.writeFileSync('src/i18n/de.json', JSON.stringify(de, null, 2));
fs.writeFileSync('src/i18n/en.json', JSON.stringify(en, null, 2));

let qe = fs.readFileSync('src/services/QuestEngine.ts', 'utf8');

// Replace mock1 Garrosh generic options with specific ones
qe = qe.replace(/"label": "map\.dialogs\.common\.tell_more",[\s\S]*?"next": "ask_trade"/g, (match, offset) => {
    // Determine which NPC block we are in by finding the closest "title": "map.markers.XXX" before this offset
    const textBefore = qe.substring(0, offset);
    const titleMatches = [...textBefore.matchAll(/"title": "map\.markers\.(\w+)"/g)];
    if (titleMatches.length > 0) {
        let npcId = titleMatches[titleMatches.length - 1][1];
        if (npcId === 'survivor_barista') npcId = 'barista';
        if (npcId === 'trader_bot') npcId = 'trader';
        if (npcId === 'drunk_informant') npcId = 'informant';
        if (infoEn[npcId]) {
             return `"label": "map.dialogs.${npcId}.opt_tell_more",\n              "next": "ask_trade"`;
        }
    }
    return match; // fallback
});

qe = qe.replace(/"label": "map\.dialogs\.common\.help_quest",[\s\S]*?"next": "accept_quest"/g, (match, offset) => {
    const textBefore = qe.substring(0, offset);
    const titleMatches = [...textBefore.matchAll(/"title": "map\.markers\.(\w+)"/g)];
    if (titleMatches.length > 0) {
        let npcId = titleMatches[titleMatches.length - 1][1];
        if (npcId === 'survivor_barista') npcId = 'barista';
        if (npcId === 'trader_bot') npcId = 'trader';
        if (npcId === 'drunk_informant') npcId = 'informant';
        if (infoEn[npcId]) {
             return `"label": "map.dialogs.${npcId}.opt_help",\n              "next": "accept_quest"`;
        }
    }
    return match;
});

// Also replace the dynamic logic
qe = qe.replace(/\{ label: "map\.dialogs\.common\.tell_more", next: "ask_trade" \}/g, '{ label: `${baseKey}.opt_tell_more`, next: "ask_trade" }');
qe = qe.replace(/\{ label: "map\.dialogs\.common\.help_quest", next: "accept_quest" \}/g, '{ label: `${baseKey}.opt_help`, next: "accept_quest" }');

fs.writeFileSync('src/services/QuestEngine.ts', qe);
