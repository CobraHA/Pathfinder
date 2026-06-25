const fs = require('fs');
let path = 'src/screens/MapScreen.js';
let content = fs.readFileSync(path, 'utf8');

const oldSwitch = "case 'fabric': iconName = 'tshirt-crew'; iconColor = '#00BCD4'; break;";
const newSwitch = "case 'fabric': iconName = 'tshirt-crew'; iconColor = '#00BCD4'; break;\n        case 'shirt': iconName = 'tshirt-crew'; iconColor = '#00BCD4'; break;\n        case 'pants': iconName = 'hanger'; iconColor = '#00BCD4'; break;\n        case 'broken_shirt': iconName = 'broken-tshirt'; iconColor = '#9E9E9E'; break;\n        case 'broken_pants': iconName = 'hanger'; iconColor = '#9E9E9E'; break;";

content = content.replace(oldSwitch, newSwitch);

// floating text part
const oldFloatingSwitch = "case 'fabric': \n                  iconName = 'tshirt-crew'; \n                  iconColor = '#00BCD4'; \n                  break;";
const newFloatingSwitch = "case 'fabric': \n                  iconName = 'tshirt-crew'; \n                  iconColor = '#00BCD4'; \n                  break;\n                case 'shirt': \n                  iconName = 'tshirt-crew'; \n                  iconColor = '#00BCD4'; \n                  break;\n                case 'pants': \n                  iconName = 'hanger'; \n                  iconColor = '#00BCD4'; \n                  break;\n                case 'broken_shirt': \n                  iconName = 'broken-tshirt'; \n                  iconColor = '#9E9E9E'; \n                  break;\n                case 'broken_pants': \n                  iconName = 'hanger'; \n                  iconColor = '#9E9E9E'; \n                  break;";

content = content.replace(oldFloatingSwitch, newFloatingSwitch);

fs.writeFileSync(path, content, 'utf8');
console.log("Patched MapScreen icons");
