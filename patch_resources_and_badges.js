const fs = require('fs');
const file = 'src/screens/MapScreen.js';
let content = fs.readFileSync(file, 'utf8');

// 1. Enlarge the badge
const oldBadge = `{badgeIcon && (
          <View style={{ position: 'absolute', bottom: -4, right: -4, backgroundColor: 'rgba(20,20,20,0.8)', borderRadius: 8, padding: 2 }}>
            <MaterialCommunityIcons name={badgeIcon} size={10} color={badgeColor} />
          </View>
        )}`;
const newBadge = `{badgeIcon && (
          <View style={{ position: 'absolute', bottom: -6, right: -6, backgroundColor: 'rgba(20,20,20,0.95)', borderRadius: 10, padding: 3, borderWidth: 1, borderColor: '#555' }}>
            <MaterialCommunityIcons name={badgeIcon} size={14} color={badgeColor} />
          </View>
        )}`;
content = content.replace(oldBadge, newBadge);

// 2. Add resource icons
const oldSwitch = `switch (itemId) {
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
      case 'bread': iconName = 'baguette'; iconColor = '#D2B48C'; break;
      case 'raw_meat': iconName = 'food-steak'; iconColor = '#CD5C5C'; break;
      case 'roasted_meat': iconName = 'food-drumstick'; iconColor = '#8B4513'; break;
      default: iconName = 'package-variant'; iconColor = '#E9BC62'; break;
    }`;

const newSwitch = `switch (itemId) {
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
      case 'fabric': iconName = 'tshirt-crew'; iconColor = '#FFFFFF'; break;
      case 'burger': iconName = 'hamburger'; iconColor = '#FFA500'; break;
      case 'gasoline': iconName = 'gas-station'; iconColor = '#FF4500'; break;
      default: iconName = 'package-variant'; iconColor = '#E9BC62'; break;
    }`;

content = content.replace(oldSwitch, newSwitch);

fs.writeFileSync(file, content, 'utf8');
console.log("Patched MapScreen.js resources and badges!");
