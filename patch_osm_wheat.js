const fs = require('fs');
const file = 'src/config/osm_mapping.json';
let data = JSON.parse(fs.readFileSync(file, 'utf8'));

if (!data["landuse=farmland"]) {
  data["landuse=farmland"] = {
    type: "resource",
    itemId: "wheat",
    name: "Weizenfeld",
    amount: [2, 5],
    spawnChance: 0.6
  };
}
if (!data["crop=wheat"]) {
  data["crop=wheat"] = {
    type: "resource",
    itemId: "wheat",
    name: "Weizenfeld",
    amount: [3, 6],
    spawnChance: 0.8
  };
}

fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
console.log("Patched osm_mapping.json");
