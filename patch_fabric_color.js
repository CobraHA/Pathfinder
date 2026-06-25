const fs = require('fs');
const file = 'src/screens/MapScreen.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/case 'fabric': iconName = 'tshirt-crew'; iconColor = '#FFFFFF'; break;/, "case 'fabric': iconName = 'tshirt-crew'; iconColor = '#00BCD4'; break;");

fs.writeFileSync(file, content, 'utf8');
console.log("Patched MapScreen.js fabric color");
