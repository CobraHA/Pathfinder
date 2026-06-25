const fs = require('fs');

const path = 'src/config/osm_mapping.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const newLocations = {
  "amenity=pharmacy": { type: "resource", itemId: "medicine", name: "Apotheke", amount: [1, 2], spawnChance: 0.6 },
  "amenity=cafe": { type: "resource", itemId: "coffee_beans", name: "Café", amount: [2, 5], spawnChance: 0.5 },
  "amenity=fast_food": { type: "resource", itemId: "burger", name: "Fast Food Laden", amount: [1, 2], spawnChance: 0.4 },
  "shop=supermarket": { type: "resource", itemId: "canned_beans", name: "Supermarkt", amount: [2, 4], spawnChance: 0.8 },
  "leisure=park": { type: "resource", itemId: "flower", name: "Park", amount: [1, 3], spawnChance: 0.5 },
  "amenity=bank": { type: "resource", itemId: "gold_coin", name: "Bank", amount: [1, 5], spawnChance: 0.2 },
  "amenity=pub": { type: "resource", itemId: "beer", name: "Kneipe", amount: [1, 3], spawnChance: 0.6 },
  "amenity=library": { type: "resource", itemId: "book", name: "Bibliothek", amount: [1, 2], spawnChance: 0.4 },
  "shop=clothes": { type: "resource", itemId: "fabric", name: "Bekleidungsgeschäft", amount: [2, 6], spawnChance: 0.5 },
  "amenity=fuel": { type: "resource", itemId: "gasoline", name: "Tankstelle", amount: [1, 3], spawnChance: 0.4 }
};

Object.assign(data, newLocations);

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log("Updated osm_mapping.json");
