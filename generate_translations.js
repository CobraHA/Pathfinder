const fs = require('fs');

const npcs = [
  { id: "blacksmith", de: "Schmied", en: "Blacksmith" },
  { id: "herbalist", de: "Kräuterkundler", en: "Herbalist" },
  { id: "lumberjack", de: "Holzfäller", en: "Lumberjack" },
  { id: "beggar", de: "Bettler", en: "Beggar" },
  { id: "barista", de: "Barista", en: "Barista" },
  { id: "trader", de: "Händler", en: "Trader" },
  { id: "informant", de: "Informant", en: "Informant" },
  { id: "guard_captain", de: "Wachhauptmann", en: "Guard Captain" },
  { id: "miner", de: "Minenarbeiter", en: "Miner" },
  { id: "farmer", de: "Bauer", en: "Farmer" },
  { id: "cook", de: "Koch", en: "Cook" },
  { id: "hunter", de: "Jäger", en: "Hunter" },
  { id: "scout", de: "Späher", en: "Scout" },
  { id: "mayor", de: "Bürgermeister", en: "Mayor" },
  { id: "priest", de: "Priester", en: "Priest" },
  { id: "alchemist", de: "Alchemist", en: "Alchemist" },
  { id: "carpenter", de: "Zimmermann", en: "Carpenter" },
  { id: "mason", de: "Steinmetz", en: "Mason" },
  { id: "merchant", de: "Kaufmann", en: "Merchant" },
  { id: "tailor", de: "Schneider", en: "Tailor" }
];

const quests = [
  { id: "q1", deT: "Aufgabe 1", enT: "Task 1", deD: "Besorge die benötigten Materialien.", enD: "Gather the required materials." },
  { id: "q2", deT: "Aufgabe 2", enT: "Task 2", deD: "Ich brauche Vorräte.", enD: "I need supplies." },
  { id: "q3", deT: "Aufgabe 3", enT: "Task 3", deD: "Hilf mir bei meiner Arbeit.", enD: "Help me with my work." }
];

function updateLang(file, lang) {
  let content = JSON.parse(fs.readFileSync(file, 'utf8'));
  
  if (!content.npc) content.npc = {};
  if (!content.npc_quests) content.npc_quests = {};
  if (!content.npc.common) {
    content.npc.common = {
      opt_tell_more: lang === 'de' ? "Erzähl mir mehr." : "Tell me more.",
      opt_no_time: lang === 'de' ? "Ich habe keine Zeit." : "I have no time.",
      opt_help: lang === 'de' ? "Wie kann ich helfen?" : "How can I help?",
      opt_no_thanks: lang === 'de' ? "Nein danke." : "No thanks.",
      opt_farewell: lang === 'de' ? "Ich mache mich auf den Weg." : "I will be on my way.",
      give_items: lang === 'de' ? "Hier sind die Items." : "Here are the items.",
      not_yet: lang === 'de' ? "Ich arbeite noch daran." : "I'm still working on it.",
      you_are_welcome: lang === 'de' ? "Gern geschehen." : "You're welcome."
    };
  }

  npcs.forEach(npc => {
    content.npc[npc.id] = {
      name: lang === 'de' ? npc.de : npc.en,
      start: lang === 'de' ? `Sei gegrüßt. Ich bin der ${npc.de} dieser Gegend.` : `Greetings. I am the local ${npc.en}.`,
      ask_trade: lang === 'de' ? `Ich brauche dringend Hilfe bei einer Aufgabe.` : `I urgently need help with a task.`,
      accept_quest: lang === 'de' ? `Klasse! Besorge mir die Materialien, dann wirst du belohnt.` : `Great! Get me the materials, and you will be rewarded.`,
      check_quest_progress: lang === 'de' ? `Hast du die Sachen dabei?` : `Do you have the items with you?`,
      complete_quest: lang === 'de' ? `Perfekt! Hier ist dein Lohn.` : `Perfect! Here is your reward.`,
      quest_title: lang === 'de' ? `Auftrag vom ${npc.de}` : `Task from the ${npc.en}`,
      quest_desc: lang === 'de' ? `Besorge die benötigten Materialien.` : `Gather the required materials.`
    };

    quests.forEach(q => {
      content.npc_quests[`${npc.id}_${q.id}`] = {
        title: lang === 'de' ? `${npc.de}: ${q.deT}` : `${npc.en}: ${q.enT}`,
        desc: lang === 'de' ? q.deD : q.enD
      };
    });
  });

  fs.writeFileSync(file, JSON.stringify(content, null, 2));
}

updateLang('src/i18n/de.json', 'de');
updateLang('src/i18n/en.json', 'en');
console.log("Translations updated!");
