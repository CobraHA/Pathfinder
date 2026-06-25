const fs = require('fs');

let osmPath = 'src/config/osm_mapping.json';
let osm = JSON.parse(fs.readFileSync(osmPath, 'utf8'));

// 1. All workbenches to 1.0 spawn chance
for (const key in osm) {
    if (osm[key].type === 'workbench') {
        osm[key].spawnChance = 1.0;
    }
}

// 2. Add/Modify functional shops
const shopKeys = [
    "shop=supermarket", "shop=convenience", "shop=kiosk", 
    "shop=general", "shop=mall", "shop=department_store"
];

for (const key of shopKeys) {
    osm[key] = {
        type: "shop",
        title: "map.markers.shop",
        spawnChance: 1.0
    };
}

// Keep abandoned shops as resources
osm["abandoned:shop=clothes"] = {
    type: "resource",
    itemId: ["fabric", "broken_shirt", "broken_pants"],
    name: "Geplündertes Bekleidungsgeschäft",
    amount: [1, 2],
    spawnChance: 1.0
};
osm["abandoned:shop=convenience"] = {
    type: "resource",
    itemId: ["stale_bread", "dirty_water"],
    name: "Geplünderter Kiosk",
    amount: [1, 2],
    spawnChance: 1.0
};

fs.writeFileSync(osmPath, JSON.stringify(osm, null, 2), 'utf8');

// Update i18n
let dePath = 'src/i18n/de.json';
let de = JSON.parse(fs.readFileSync(dePath, 'utf8'));
if (!de.map) de.map = {};
if (!de.map.markers) de.map.markers = {};
de.map.markers.shop = "Handelsposten";
fs.writeFileSync(dePath, JSON.stringify(de, null, 2), 'utf8');

let enPath = 'src/i18n/en.json';
let en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
if (!en.map) en.map = {};
if (!en.map.markers) en.map.markers = {};
en.map.markers.shop = "Trading Post";
fs.writeFileSync(enPath, JSON.stringify(en, null, 2), 'utf8');

console.log("Updated workbenches and shops");
