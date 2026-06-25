const fs = require('fs');

let path = 'src/screens/MapScreen.js';
let content = fs.readFileSync(path, 'utf8');

// The block starts exactly at "} else if (q.type === 'resource') {"
// And ends at the extra braces before "const markerTitle"
const regex = /\} else if \(q\.type === 'resource'\) \{([\s\S]*?)default: iconName = 'package-variant'; iconColor = '#E9BC62'; break;\n      \}\n    \}\n  \}/g;

const newBlock = `} else if (q.type === 'resource') {
    const itemId = q.data?.resource?.itemId || q.data?.itemId;
    bgColor = 'rgba(20, 25, 30, 0.9)';
    
    const isAbandonedClothes = q.title?.includes('Geplündertes') || q.data?.resource?.name?.includes('Geplündertes') || q.data?.name?.includes('Geplündertes');
    
    if (isAbandonedClothes) {
      iconName = 'tshirt-crew-outline';
      iconColor = '#9E9E9E';
    } else {
      switch (itemId) {
        case 'clean_water': case 'dirty_water': case 'water_flask': iconName = 'water'; iconColor = '#4169E1'; break;
        case 'iron_ore': iconName = 'diamond-stone'; iconColor = '#A9A9A9'; break;
        case 'herb_root': iconName = 'sprout'; iconColor = '#32CD32'; break;
        case 'wood_log': iconName = 'tree'; iconColor = '#D2691E'; break;
        case 'stone_block': iconName = 'cube-outline'; iconColor = '#808080'; break;
        case 'berries': iconName = 'fruit-cherries'; iconColor = '#FF1493'; break;
        case 'mushrooms': iconName = 'mushroom'; iconColor = '#FF6347'; break;
        case 'salt_water': iconName = 'water-percent'; iconColor = '#4169E1'; break;
        case 'flint': iconName = 'flare'; iconColor = '#D3D3D3'; break;
        case 'salt': iconName = 'shaker'; iconColor = '#FFFFFF'; break;
        case 'wheat': iconName = 'barley'; iconColor = '#DAA520'; break;
        case 'bread': case 'stale_bread': iconName = 'baguette'; iconColor = '#D2B48C'; break;
        case 'raw_meat': iconName = 'food-steak'; iconColor = '#CD5C5C'; break;
        case 'roasted_meat': iconName = 'food-drumstick'; iconColor = '#8B4513'; break;
        case 'gold_coin': case 'old_currency': iconName = 'cash'; iconColor = '#FFD700'; break;
        case 'medicine': iconName = 'pill'; iconColor = '#FF0000'; break;
        case 'canned_beans': case 'canned_food': case 'snacks': iconName = 'food-variant'; iconColor = '#CD5C5C'; break;
        case 'flower': iconName = 'flower'; iconColor = '#FF69B4'; break;
        case 'coffee_beans': iconName = 'coffee'; iconColor = '#8B4513'; break;
        case 'book': case 'notebook': iconName = 'book'; iconColor = '#A0522D'; break;
        case 'beer': iconName = 'glass-mug-variant'; iconColor = '#FFD700'; break;
        case 'energy_drink': iconName = 'flash'; iconColor = '#00FFFF'; break;
        case 'batteries': iconName = 'battery'; iconColor = '#32CD32'; break;
        case 'backpack': iconName = 'bag-personal'; iconColor = '#8B4513'; break;
        case 'pencil': iconName = 'pencil'; iconColor = '#FFD700'; break;
        case 'fabric': iconName = 'tshirt-crew'; iconColor = '#00BCD4'; break;
        case 'burger': iconName = 'hamburger'; iconColor = '#FFA500'; break;
        case 'gasoline': iconName = 'gas-station'; iconColor = '#FF4500'; break;
        default: iconName = 'package-variant'; iconColor = '#E9BC62'; break;
      }
    }
  }`;

const replaced = content.replace(regex, newBlock);
if (replaced === content) {
    console.error("Regex did not match!");
} else {
    fs.writeFileSync(path, replaced, 'utf8');
    console.log("Syntax fixed!");
}
