const fs = require('fs');

let mapScreenPath = 'src/screens/MapScreen.js';
let mapScreenContent = fs.readFileSync(mapScreenPath, 'utf8');

const oldFabricCase = `case 'fabric': 
        if (q.data?.resource?.name === 'Geplündertes Kleidungsgeschäft') {
          iconName = 'tshirt-crew-outline';
          iconColor = '#666666';
        } else {
          iconName = 'tshirt-crew'; 
          iconColor = '#00BCD4';
        }
        break;`;

const newFabricCase = `case 'fabric': 
        const isAbandonedClothes = q.title?.includes('Geplündertes') || q.data?.resource?.name?.includes('Geplündertes') || q.data?.name?.includes('Geplündertes');
        if (isAbandonedClothes) {
          iconName = 'tshirt-crew-outline';
          iconColor = '#666666';
        } else {
          iconName = 'tshirt-crew'; 
          iconColor = '#00BCD4';
        }
        break;`;

mapScreenContent = mapScreenContent.replace(oldFabricCase, newFabricCase);

fs.writeFileSync(mapScreenPath, mapScreenContent, 'utf8');
console.log("Patched MapScreen.js for Geplündertes Kleidungsgeschäft");
