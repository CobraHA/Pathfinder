const fs = require('fs');
const file = 'src/screens/MapScreen.js';
let content = fs.readFileSync(file, 'utf8');

const oldLogic = `  if (isNPC) {
    iconName = 'account'; iconColor = '#E9BC62'; bgColor = 'rgba(62, 39, 35, 0.9)';
  } else if (isColdCampfire) {`;

const newLogic = `  if (isNPC) {
    iconName = 'account'; iconColor = '#E9BC62'; bgColor = 'rgba(62, 39, 35, 0.9)';
    const npcId = q.data?.baseKey;
    switch (npcId) {
      case 'drunkard_hostile': iconName = 'glass-mug-variant'; iconColor = '#FF6347'; break;
      case 'thief': iconName = 'incognito'; iconColor = '#FF4500'; break;
      case 'blacksmith': iconName = 'anvil'; iconColor = '#A9A9A9'; break;
      case 'herbalist': iconName = 'leaf'; iconColor = '#32CD32'; break;
      case 'lumberjack': iconName = 'axe'; iconColor = '#D2691E'; break;
      case 'beggar': iconName = 'hand-extended'; iconColor = '#A9A9A9'; break;
      case 'barista': iconName = 'coffee'; iconColor = '#8B4513'; break;
      case 'trader': case 'merchant': iconName = 'storefront'; iconColor = '#FFD700'; break;
      case 'guard_captain': iconName = 'shield-sword'; iconColor = '#4682B4'; break;
      case 'miner': iconName = 'pickaxe'; iconColor = '#A9A9A9'; break;
      case 'farmer': iconName = 'pitchfork'; iconColor = '#DAA520'; break;
      case 'cook': iconName = 'chef-hat'; iconColor = '#FFFFFF'; break;
      case 'hunter': case 'scout': iconName = 'bow-arrow'; iconColor = '#556B2F'; break;
      case 'mayor': iconName = 'crown'; iconColor = '#FFD700'; break;
      case 'priest': iconName = 'book-cross'; iconColor = '#FFFFFF'; break;
      case 'alchemist': iconName = 'flask'; iconColor = '#9400D3'; break;
      case 'carpenter': case 'mason': iconName = 'hammer-wrench'; iconColor = '#D2B48C'; break;
      case 'tailor': iconName = 'needle'; iconColor = '#FFC0CB'; break;
      case 'bard': iconName = 'music-note'; iconColor = '#FF69B4'; break;
      case 'informant': iconName = 'eye'; iconColor = '#8A2BE2'; break;
    }
  } else if (isColdCampfire) {`;

content = content.replace(oldLogic, newLogic);
fs.writeFileSync(file, content, 'utf8');
console.log("Patched MapScreen.js NPC icons!");
