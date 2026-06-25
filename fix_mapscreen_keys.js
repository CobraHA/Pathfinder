const fs = require('fs');
const file = 'src/screens/MapScreen.js';
let content = fs.readFileSync(file, 'utf8');

// 1. Update MemoizedQuestMarker to accept markerIndex
const memoDefRegex = /const MemoizedQuestMarker = React\.memo\(\(\{\s*q,\s*qLat,\s*qLon,\s*effectiveLocation,\s*onPress\s*\}\) => \{/g;
const newMemoDef = `const MemoizedQuestMarker = React.memo(({ q, qLat, qLon, effectiveLocation, onPress, markerIndex }) => {`;
content = content.replace(memoDefRegex, newMemoDef);

// 2. Change the key inside Marker to use markerIndex
const markerKeyRegex = /<Marker\n\s*key=\{q\.id\}/g;
const newMarkerKey = `<Marker\n      key={'marker_' + markerIndex}`;
content = content.replace(markerKeyRegex, newMarkerKey);

// 3. Update the map function to pass index and use it as key
const mapFuncRegex = /\.\.\.quests\.filter\(q => q && q\.id\)\.map\(\(q\) => \{/g;
const newMapFunc = `...quests.filter(q => q && q.id).map((q, index) => {`;
content = content.replace(mapFuncRegex, newMapFunc);

const memoUsageRegex = /<MemoizedQuestMarker\n\s*key=\{q\.id\}/g;
const newMemoUsage = `<MemoizedQuestMarker\n              key={'quest_' + index}\n              markerIndex={index}`;
content = content.replace(memoUsageRegex, newMemoUsage);

fs.writeFileSync(file, content, 'utf8');
console.log("Patched MapScreen.js keys to use array indices!");
