const fs = require('fs');
let path = 'src/config/osm_mapping.json';
let mappingData = JSON.parse(fs.readFileSync(path, 'utf8'));

// Update existing
if (mappingData["building=garages"]) mappingData["building=garages"].spawnChance = 0.4;
if (mappingData["building=industrial"]) mappingData["building=industrial"].spawnChance = 0.3;
if (mappingData["man_made=works"]) mappingData["man_made=works"].spawnChance = 0.7;

// Add new
const newWorkbenches = {
    "amenity=car_wash": 0.8,
    "shop=car_repair": 0.8,
    "shop=doityourself": 1.0,
    "building=commercial": 0.15,
    "building=shed": 0.3,
    "building=barn": 0.2,
    "building=warehouse": 0.25
};

for (const [key, chance] of Object.entries(newWorkbenches)) {
    mappingData[key] = {
        type: "workbench",
        title: "map.markers.workbench",
        spawnChance: chance
    };
}

fs.writeFileSync(path, JSON.stringify(mappingData, null, 2), 'utf8');
console.log("Added more workbenches to osm_mapping.json");
