const fs = require('fs');
const file = 'src/i18n/de.json';
let data = JSON.parse(fs.readFileSync(file, 'utf8'));

// Add NPC keys
if (!data.npc.drunkard_hostile) {
  data.npc.drunkard_hostile = {
    name: "Betrunkener",
    start: "Was guckst du so?! Hast du ein Problem?!",
    opt_calm: "Ganz ruhig, ich will keinen Ärger.",
    opt_insult: "Verpiss dich, du Trunkenbold.",
    insult_back: "Halt die Klappe! *hicks* Geh mir aus den Augen!",
    fight_back: "Du willst Ärger?! Komm doch her! ... *stolpert und fällt um*"
  };
}

if (!data.npc.thief) {
  data.npc.thief = {
    name: "Dieb",
    start: "Keine falsche Bewegung! Gib mir sofort all deine Wertsachen, oder du wirst es bereuen!",
    opt_rob: "Okay, nimm was du willst, aber lass mich in Ruhe!",
    robbed_success: "Haha, danke für die Spende! Und jetzt verschwinde!",
    robbed_empty: "Was?! Du hast ja gar nichts dabei! Was bist du für ein armer Schlucker?! Verschwinde!"
  };
}

fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
console.log("Patched de.json");
