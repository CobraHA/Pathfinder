const fs = require('fs');
const dePath = 'src/i18n/de.json';
const deJson = JSON.parse(fs.readFileSync(dePath, 'utf8'));

// Tweak guard_captain to have 3 exchanges
deJson.npc.guard_captain.opt_explain_2_1 = "Gibt es einen Plan dagegen?";
deJson.npc.guard_captain.explain_role_3 = "Wir planen eine große Säuberungsaktion in den Wäldern. Aber dafür fehlt uns dringend gute Ausrüstung.";
deJson.npc.guard_captain.opt_explain_3_1 = "Ich bin kampferprobt. Ich kann die Ausrüstung besorgen.";

// Tweak beggar to have just 1 exchange
deJson.npc.beggar.opt_start_1 = "Du siehst hungrig aus. Brauchst du etwas?";

// Add a field in QuestEngine or define the tree structure in NPCData
// We will just let QuestEngine know how many exchanges each NPC has!
fs.writeFileSync(dePath, JSON.stringify(deJson, null, 2));
