const fs = require('fs');
let path = 'src/services/QuestEngine.ts';
let content = fs.readFileSync(path, 'utf8');

const oldLine = "type: ['clean_water', 'dirty_water', 'bread', 'stale_bread', 'moldy_bread', 'canned_food', 'berries', 'mushrooms', 'medicine', 'burger', 'canned_beans', 'beer'].includes(matchedMapping.itemId) ? 'consumable' : 'material',";
const newLine = "type: ['clean_water', 'dirty_water', 'bread', 'stale_bread', 'moldy_bread', 'canned_food', 'berries', 'mushrooms', 'medicine', 'burger', 'canned_beans', 'beer'].includes(selectedItemId) ? 'consumable' : 'material',";

content = content.replace(oldLine, newLine);
fs.writeFileSync(path, content, 'utf8');
console.log("Patched QuestEngine.ts type assignment");
