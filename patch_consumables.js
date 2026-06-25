const fs = require('fs');

// Patch QuestEngine.ts
let qe = fs.readFileSync('src/services/QuestEngine.ts', 'utf8');
qe = qe.replace(
  "['clean_water', 'dirty_water', 'bread', 'stale_bread', 'moldy_bread', 'canned_food', 'berries', 'mushrooms']",
  "['clean_water', 'dirty_water', 'bread', 'stale_bread', 'moldy_bread', 'canned_food', 'berries', 'mushrooms', 'medicine', 'burger', 'canned_beans', 'beer']"
);
fs.writeFileSync('src/services/QuestEngine.ts', qe);

// Patch InventoryEngine.ts
let ie = fs.readFileSync('src/services/InventoryEngine.ts', 'utf8');
ie = ie.replace(
  "'raw_meat', 'roasted_meat', 'coffee', 'strong_coffee', 'herbal_tea'",
  "'raw_meat', 'roasted_meat', 'coffee', 'strong_coffee', 'herbal_tea', 'medicine', 'burger', 'canned_beans', 'beer'"
);
fs.writeFileSync('src/services/InventoryEngine.ts', ie);

console.log("Updated QuestEngine and InventoryEngine consumable types");
