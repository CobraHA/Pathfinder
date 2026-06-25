const fs = require('fs');
const file = 'src/screens/MapScreen.js';
let content = fs.readFileSync(file, 'utf8');

const oldLogic = `  let iconName = 'map-marker';
  let iconColor = '#228B22';
  let bgColor = 'rgba(20, 30, 20, 0.9)';

  if (isNPC) {
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

const newLogic = `  let iconName = 'map-marker';
  let iconColor = '#228B22';
  let bgColor = 'rgba(20, 30, 20, 0.9)';
  let badgeIcon = null;
  let badgeColor = '#FFFFFF';

  if (isNPC) {
    iconName = 'account'; iconColor = '#E9BC62'; bgColor = 'rgba(62, 39, 35, 0.9)';
    const npcId = q.data?.baseKey;
    switch (npcId) {
      case 'drunkard_hostile': badgeIcon = 'glass-mug-variant'; badgeColor = '#FF6347'; break;
      case 'thief': badgeIcon = 'incognito'; badgeColor = '#FF4500'; iconName = 'account-cowboy-hat'; break;
      case 'blacksmith': badgeIcon = 'anvil'; badgeColor = '#A9A9A9'; iconName = 'account-hard-hat'; break;
      case 'herbalist': badgeIcon = 'leaf'; badgeColor = '#32CD32'; break;
      case 'lumberjack': badgeIcon = 'axe'; badgeColor = '#D2691E'; break;
      case 'beggar': badgeIcon = 'hand-extended'; badgeColor = '#A9A9A9'; break;
      case 'barista': badgeIcon = 'coffee'; badgeColor = '#8B4513'; break;
      case 'trader': case 'merchant': badgeIcon = 'storefront'; badgeColor = '#FFD700'; break;
      case 'guard_captain': badgeIcon = 'shield-sword'; badgeColor = '#4682B4'; iconName = 'account-hard-hat'; break;
      case 'miner': badgeIcon = 'pickaxe'; badgeColor = '#A9A9A9'; iconName = 'account-hard-hat'; break;
      case 'farmer': badgeIcon = 'pitchfork'; badgeColor = '#DAA520'; iconName = 'account-cowboy-hat'; break;
      case 'cook': badgeIcon = 'chef-hat'; badgeColor = '#FFFFFF'; break;
      case 'hunter': case 'scout': badgeIcon = 'bow-arrow'; badgeColor = '#556B2F'; break;
      case 'mayor': badgeIcon = 'crown'; badgeColor = '#FFD700'; iconName = 'account-tie'; break;
      case 'priest': badgeIcon = 'book-cross'; badgeColor = '#FFFFFF'; break;
      case 'alchemist': badgeIcon = 'flask'; badgeColor = '#9400D3'; break;
      case 'carpenter': case 'mason': badgeIcon = 'hammer-wrench'; badgeColor = '#D2B48C'; iconName = 'account-hard-hat'; break;
      case 'tailor': badgeIcon = 'needle'; badgeColor = '#FFC0CB'; break;
      case 'bard': badgeIcon = 'music-note'; badgeColor = '#FF69B4'; iconName = 'account-music'; break;
      case 'informant': badgeIcon = 'eye'; badgeColor = '#8A2BE2'; break;
    }
  } else if (isColdCampfire) {`;

content = content.replace(oldLogic, newLogic);
fs.writeFileSync(file, content, 'utf8');
console.log("Fixed badgeIcon ReferenceError!");
