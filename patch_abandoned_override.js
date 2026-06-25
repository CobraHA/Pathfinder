const fs = require('fs');

let mapScreenPath = 'src/screens/MapScreen.js';
let mapScreenContent = fs.readFileSync(mapScreenPath, 'utf8');

const oldResourceStart = `  } else if (q.type === 'resource') {
    const itemId = q.data?.resource?.itemId || q.data?.itemId;
    bgColor = 'rgba(20, 25, 30, 0.9)';
    switch (itemId) {
      case 'clean_water': case 'dirty_water': case 'water_flask': iconName = 'water'; iconColor = '#4169E1'; break;`;

const newResourceStart = `  } else if (q.type === 'resource') {
    const itemId = q.data?.resource?.itemId || q.data?.itemId;
    bgColor = 'rgba(20, 25, 30, 0.9)';
    const isAbandonedClothes = q.title?.includes('Geplündertes') || q.data?.resource?.name?.includes('Geplündertes') || q.data?.name?.includes('Geplündertes');
    
    if (isAbandonedClothes) {
      iconName = 'tshirt-crew-outline';
      iconColor = '#9E9E9E';
    } else {
      switch (itemId) {
        case 'clean_water': case 'dirty_water': case 'water_flask': iconName = 'water'; iconColor = '#4169E1'; break;`;

mapScreenContent = mapScreenContent.replace(oldResourceStart, newResourceStart);

const oldFabricCase = `      case 'fabric': 
        const isAbandonedClothes = q.title?.includes('Geplündertes') || q.data?.resource?.name?.includes('Geplündertes') || q.data?.name?.includes('Geplündertes');
        if (isAbandonedClothes) {
          iconName = 'tshirt-crew-outline';
          iconColor = '#9E9E9E';
        } else {
          iconName = 'tshirt-crew'; 
          iconColor = '#00BCD4';
        }
        break;`;

const newFabricCase = `      case 'fabric': iconName = 'tshirt-crew'; iconColor = '#00BCD4'; break;`;

mapScreenContent = mapScreenContent.replace(oldFabricCase, newFabricCase);

// Also need to close the else block for the switch
const oldDefault = `      default: iconName = 'package-variant'; iconColor = '#E9BC62'; break;
    }
  }`;

const newDefault = `      default: iconName = 'package-variant'; iconColor = '#E9BC62'; break;
      }
    }
  }`;

mapScreenContent = mapScreenContent.replace(oldDefault, newDefault);

fs.writeFileSync(mapScreenPath, mapScreenContent, 'utf8');
console.log("Patched MapScreen.js to override icon based on title before checking itemId");
