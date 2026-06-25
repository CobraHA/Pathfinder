const fs = require('fs');
const mapFile = 'src/screens/MapScreen.js';
let mapContent = fs.readFileSync(mapFile, 'utf8');

if (!mapContent.includes("case 'wheat':")) {
  mapContent = mapContent.replace(/case 'bread': case 'stale_bread':/, "case 'wheat': iconName = 'barley'; iconColor = '#DAA520'; break;\n      case 'bread': case 'stale_bread':");
  fs.writeFileSync(mapFile, mapContent, 'utf8');
}

const craftFile = 'src/screens/CraftingScreen.js';
let craftContent = fs.readFileSync(craftFile, 'utf8');

if (!craftContent.includes("case 'wheat':")) {
  craftContent = craftContent.replace(/case 'salt': return 'sun';/, "case 'salt': return 'sun';\n      case 'wheat': return 'sun';\n      case 'bread': return 'sun';");
  // wait, CraftingScreen uses Feather icons! There is no barley or baguette in Feather!
  // I will just map them to something simple. wheat -> wind or edit-2, bread -> circle.
  craftContent = craftContent.replace(/case 'wheat': return 'sun';\n      case 'bread': return 'sun';/, "case 'wheat': return 'wind';\n      case 'bread': return 'disc';");
  fs.writeFileSync(craftFile, craftContent, 'utf8');
}

console.log("Patched MapScreen and CraftingScreen icons");
