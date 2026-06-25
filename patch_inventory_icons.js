const fs = require('fs');
let path = 'src/screens/InventoryScreen.js';
let content = fs.readFileSync(path, 'utf8');

const oldSwitch = "      case 'fabric': return 'tshirt-crew';";
const newSwitch = "      case 'fabric': return 'tshirt-crew';\n      case 'shirt': return 'tshirt-crew';\n      case 'pants': return 'hanger';\n      case 'broken_shirt': return 'tshirt-crew-outline';\n      case 'broken_pants': return 'hanger';";

content = content.replace(oldSwitch, newSwitch);
fs.writeFileSync(path, content, 'utf8');
console.log("Patched InventoryScreen icons");
