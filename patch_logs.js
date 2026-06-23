const fs = require('fs');
let code = fs.readFileSync('src/screens/MapScreen.js', 'utf8');

code = code.replace(
  'QuestEngine.checkNearbyQuests(longitude, latitude)',
  'console.log("[MapScreen] Fetching nearby quests..."); QuestEngine.checkNearbyQuests(longitude, latitude)'
);

code = code.replace(
  'setQuests(activeNodes);',
  'console.log(`[MapScreen] Updating quests state with ${activeNodes.length} nodes...`); setQuests(activeNodes);'
);

code = code.replace(
  'if (shouldUpdate || quests.length === 0) {',
  'console.log(`[MapScreen] useEffect triggered. shouldUpdate: ${shouldUpdate}`); if (shouldUpdate || quests.length === 0) {'
);

fs.writeFileSync('src/screens/MapScreen.js', code);
console.log("Logs injected!");
