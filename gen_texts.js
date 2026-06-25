const fs = require('fs');

const data = fs.readFileSync('src/config/NPCData.ts', 'utf8');

const itemNames = {
  iron_ore: "Eisenerz",
  wood_log: "Holzstämme",
  copper_coins: "Kupfermünzen",
  mushrooms: "Pilze",
  berries: "Beeren",
  clean_water: "sauberes Trinkwasser",
  bread: "Brote",
  bandit_amulet: "Banditen-Amulette",
  sword: "Schwerter",
  tool: "Werkzeuge",
  healing_potion: "Heiltränke",
  treasure_map: "Schatzkarten",
  lockpick: "Dietriche"
};

const npcFlavor = {
  blacksmith: "für meine Esse",
  herbalist: "für meine Medizin",
  lumberjack: "für das Sägewerk",
  beggar: "um über die Runden zu kommen",
  barista: "für den besten Kaffee",
  trader: "für meinen nächsten Handel",
  informant: "als Bezahlung für meine Geheimnisse",
  guard_captain: "für die Sicherheit der Stadt",
  miner: "für die harte Arbeit im Stollen",
  farmer: "für meinen Hof",
  cook: "für den nächsten Festtagsbraten",
  hunter: "für meine Ausrüstung",
  scout: "für meine nächste Expedition",
  mayor: "für das Wohl der Gemeinde",
  priest: "für den Segen der Götter",
  alchemist: "für ein streng geheimes Gebräu",
  carpenter: "für den Hausbau",
  mason: "für das neue Fundament",
  merchant: "für meinen Laden",
  tailor: "für meine neuen Stoffe",
  bard: "um meine Stimme geschmeidig zu halten"
};

const npcTitles = {
  blacksmith: "Schmied",
  herbalist: "Kräuterkundler",
  lumberjack: "Holzfäller",
  beggar: "Bettler",
  barista: "Barista",
  trader: "Händler",
  informant: "Informant",
  guard_captain: "Wachhauptmann",
  miner: "Minenarbeiter",
  farmer: "Bauer",
  cook: "Koch",
  hunter: "Jäger",
  scout: "Späher",
  mayor: "Bürgermeister",
  priest: "Priester",
  alchemist: "Alchemist",
  carpenter: "Zimmermann",
  mason: "Steinmetz",
  merchant: "Kaufmann",
  tailor: "Schneider",
  bard: "Barde"
};

const questsTitles = {};
const questsDescs = {};

const regex = /id: "([^"]+)"[\s\S]*?questId: "([^"]+)", requirement: \{ itemId: "([^"]+)", amount: (\d+) \}[\s\S]*?questId: "([^"]+)", requirement: \{ itemId: "([^"]+)", amount: (\d+) \}[\s\S]*?questId: "([^"]+)", requirement: \{ itemId: "([^"]+)", amount: (\d+) \}/g;

let match;
while ((match = regex.exec(data)) !== null) {
  const npcId = match[1];

  const quests = [
    { id: match[2], item: match[3], amount: match[4] },
    { id: match[5], item: match[6], amount: match[7] },
    { id: match[8], item: match[9], amount: match[10] }
  ];

  quests.forEach(q => {
    const iName = itemNames[q.item] || q.item;
    const flavor = npcFlavor[npcId] || "für meine Arbeit";
    const titleName = npcTitles[npcId] || npcId;

    questsTitles[q.id] = q.amount + "x " + iName + " für den " + titleName;
    questsDescs[q.id] = "Hallo Reisender! Ich benötige dringend " + q.amount + "x " + iName + " " + flavor + ". Kannst du mir das aus der Umgebung besorgen?";
  });
}

const dePath = 'src/i18n/de.json';
const deJson = JSON.parse(fs.readFileSync(dePath, 'utf8'));

deJson.quest = deJson.quest || {};
deJson.quest.title = { ...deJson.quest.title, ...questsTitles };
deJson.quest.desc = { ...deJson.quest.desc, ...questsDescs };

fs.writeFileSync(dePath, JSON.stringify(deJson, null, 2));
console.log("Generated " + Object.keys(questsTitles).length + " quests into de.json");
