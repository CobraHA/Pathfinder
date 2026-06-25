const fs = require('fs');

// Patch osm_mapping.json
let osmPath = 'src/config/osm_mapping.json';
let osm = JSON.parse(fs.readFileSync(osmPath, 'utf8'));
if (osm["natural=wood"]) {
    osm["natural=wood"].itemId = ["wood_log", "wood_log", "stick"];
}
fs.writeFileSync(osmPath, JSON.stringify(osm, null, 2), 'utf8');

// Patch QuestEngine.ts mock trees
let qePath = 'src/services/QuestEngine.ts';
let qe = fs.readFileSync(qePath, 'utf8');
qe = qe.replace(
    /if \(t === 'tree'\) \{ title = "Baum"; itemId = "wood_log"; \}/g,
    'if (t === "tree") { title = "Baum"; itemId = Math.random() > 0.5 ? "wood_log" : "stick"; }'
);
fs.writeFileSync(qePath, qe, 'utf8');

// Patch de.json
let dePath = 'src/i18n/de.json';
let de = JSON.parse(fs.readFileSync(dePath, 'utf8'));
if (!de.item) de.item = {};
de.item.stick = "Stock";
fs.writeFileSync(dePath, JSON.stringify(de, null, 2), 'utf8');

// Patch en.json
let enPath = 'src/i18n/en.json';
let en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
if (!en.item) en.item = {};
en.item.stick = "Stick";
fs.writeFileSync(enPath, JSON.stringify(en, null, 2), 'utf8');

// Patch InventoryScreen.js
let invPath = 'src/screens/InventoryScreen.js';
let inv = fs.readFileSync(invPath, 'utf8');
if (!inv.includes("case 'stick':")) {
    inv = inv.replace("case 'wood_log': return 'tree';", "case 'wood_log': return 'tree';\n      case 'stick': return 'slash-forward';");
    fs.writeFileSync(invPath, inv, 'utf8');
}

// Patch MapScreen.js
let mapPath = 'src/screens/MapScreen.js';
let map = fs.readFileSync(mapPath, 'utf8');
if (!map.includes("case 'stick': iconName = 'slash-forward';")) {
    map = map.replace("case 'wood_log': iconName = 'tree'; iconColor = '#D2691E'; break;", "case 'wood_log': iconName = 'tree'; iconColor = '#D2691E'; break;\n        case 'stick': iconName = 'slash-forward'; iconColor = '#D2691E'; break;");
    map = map.replace("case 'wood_log': \n                  iconName = 'tree';", "case 'wood_log': \n                  iconName = 'tree';\n                  iconColor = '#D2691E';\n                  break;\n                case 'stick':\n                  iconName = 'slash-forward';");
    fs.writeFileSync(mapPath, map, 'utf8');
}

console.log("Patched trees to drop sticks");
