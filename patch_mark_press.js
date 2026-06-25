const fs = require('fs');
let file = fs.readFileSync('src/screens/MapScreen.js', 'utf8');

// Update markerDesc
if (!file.includes("isTreasureMark ? i18n.t('map.markers.treasure_mark', { defaultValue: 'Schatzmarkierung' })")) {
  file = file.replace(
    "const markerDesc = isChest ? (q.data?.isLocked ? i18n.t('chest.locked_title') : i18n.t('chest.title')) : isNPC ?",
    "const markerDesc = isTreasureMark ? i18n.t('map.markers.treasure_mark', { defaultValue: 'Verborgener Schatz' }) : isChest ? (q.data?.isLocked ? i18n.t('chest.locked_title') : i18n.t('chest.title')) : isNPC ?"
  );
}

// Update onPress
if (!file.includes("q.type === 'chest' || q.type === 'treasure_mark'")) {
  file = file.replace(
    "if (q.type === 'chest') {",
    "if (q.type === 'chest' || q.type === 'treasure_mark') {"
  );
}

fs.writeFileSync('src/screens/MapScreen.js', file);
console.log("Patched MapScreen for treasure mark descriptions and click handling");
