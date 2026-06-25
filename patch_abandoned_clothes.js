const fs = require('fs');

// --- 1. Add to osm_mapping.json ---
let mappingPath = 'src/config/osm_mapping.json';
let mappingData = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));

mappingData["abandoned:shop=clothes"] = {
  "type": "resource",
  "itemId": "fabric",
  "name": "Geplündertes Kleidungsgeschäft",
  "amount": [1, 2],
  "spawnChance": 0.4
};

fs.writeFileSync(mappingPath, JSON.stringify(mappingData, null, 2), 'utf8');

// --- 2. Patch MapScreen.js ---
let mapScreenPath = 'src/screens/MapScreen.js';
let mapScreenContent = fs.readFileSync(mapScreenPath, 'utf8');

const oldFabricCase = `case 'fabric': iconName = 'tshirt-crew'; iconColor = '#00BCD4'; break;`;
const newFabricCase = `case 'fabric': 
        if (q.data?.resource?.name === 'Geplündertes Kleidungsgeschäft') {
          iconName = 'tshirt-crew-outline';
          iconColor = '#666666';
        } else {
          iconName = 'tshirt-crew'; 
          iconColor = '#00BCD4';
        }
        break;`;

mapScreenContent = mapScreenContent.replace(oldFabricCase, newFabricCase);
fs.writeFileSync(mapScreenPath, mapScreenContent, 'utf8');

console.log("Added Geplündertes Kleidungsgeschäft logic");
