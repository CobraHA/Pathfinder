const fs = require('fs');
const file = 'src/config/osm_mapping.json';
let data = JSON.parse(fs.readFileSync(file, 'utf8'));

const newMappings = {
  "shop=hardware": {
    "type": "workbench",
    "title": "map.markers.workbench",
    "spawnChance": 0.8
  },
  "craft=carpenter": {
    "type": "workbench",
    "title": "map.markers.workbench",
    "spawnChance": 0.9
  },
  "craft=blacksmith": {
    "type": "workbench",
    "title": "map.markers.workbench",
    "spawnChance": 0.9
  },
  "building=garages": {
    "type": "workbench",
    "title": "map.markers.workbench",
    "spawnChance": 0.15
  },
  "building=industrial": {
    "type": "workbench",
    "title": "map.markers.workbench",
    "spawnChance": 0.1
  },
  "man_made=works": {
    "type": "workbench",
    "title": "map.markers.workbench",
    "spawnChance": 0.4
  }
};

Object.assign(data, newMappings);

fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
console.log("Patched osm_mapping.json for workbenches");
