const fs = require('fs');
let path = 'src/screens/MapScreen.js';
let content = fs.readFileSync(path, 'utf8');

const oldLine = `              case 'fabric': iconName = 'tshirt-crew'; iconColor = '#00BCD4'; break;`;
const newLine = `              case 'fabric': 
                if (npc.title?.includes('Geplündertes') || npc.data?.resource?.name?.includes('Geplündertes') || npc.data?.name?.includes('Geplündertes')) {
                  iconName = 'tshirt-crew-outline';
                  iconColor = '#666666';
                } else {
                  iconName = 'tshirt-crew'; 
                  iconColor = '#00BCD4';
                }
                break;`;

content = content.replace(oldLine, newLine);
fs.writeFileSync(path, content, 'utf8');
console.log("Patched floating text icon for abandoned clothes");
