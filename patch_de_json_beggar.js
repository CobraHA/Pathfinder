const fs = require('fs');
const file = 'src/i18n/de.json';
let data = JSON.parse(fs.readFileSync(file, 'utf8'));

// Add beggar generic dialogue options
data.npc.beggar.start = "Hast du etwas Brot oder Salz für einen armen Tropf?";
data.npc.beggar.opt_give_food = "Hier, nimm etwas von meinen Vorräten.";
data.npc.beggar.thank_you = "Oh, danke! Tausend Dank! Mögen die Götter dich beschützen. Ich habe hier noch etwas gefunden, vielleicht nützt es dir.";

fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
console.log("Updated de.json for beggar donation.");
