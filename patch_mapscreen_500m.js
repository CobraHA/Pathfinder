const fs = require('fs');
const file = 'src/screens/MapScreen.js';
let content = fs.readFileSync(file, 'utf8');

const regex1 = /if \(p\.distance_meters === undefined \|\| p\.distance_meters < 1500 \|\| p\.id === pinnedQuestId \|\| activeQuestIds\.includes\(p\.id\)\) \{/g;
const replacement1 = `if (p.distance_meters === undefined || p.distance_meters < 500 || p.id === pinnedQuestId || activeQuestIds.includes(p.id)) {`;

content = content.replace(regex1, replacement1);

fs.writeFileSync(file, content, 'utf8');
console.log("Patched MapScreen.js filtering to 500m!");
