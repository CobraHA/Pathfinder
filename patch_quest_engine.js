const fs = require('fs');
let path = 'src/services/QuestEngine.ts';
let content = fs.readFileSync(path, 'utf8');

// Modify the logic where itemId is assigned to resource nodes
const oldItemLogic = `        if (matchedMapping.type === 'resource') {
          formattedData = {
            resource: {
              itemId: matchedMapping.itemId,
              name: matchedMapping.title || matchedMapping.name,`;

const newItemLogic = `        if (matchedMapping.type === 'resource') {
          const isArray = Array.isArray(matchedMapping.itemId);
          const itemRandom = isArray ? Math.abs(Math.imul(31, hash + 1)) / 2147483647 : 0;
          const selectedItemId = isArray ? matchedMapping.itemId[Math.floor(itemRandom * matchedMapping.itemId.length)] : matchedMapping.itemId;
          
          formattedData = {
            resource: {
              itemId: selectedItemId,
              name: matchedMapping.title || matchedMapping.name,`;

content = content.replace(oldItemLogic, newItemLogic);
fs.writeFileSync(path, content, 'utf8');
console.log("Patched QuestEngine.ts to support array of itemIds");
