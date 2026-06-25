const fs = require('fs');
let file = fs.readFileSync('src/screens/QuestLogScreen.js', 'utf8');

const syncCode = `
    const mockDbData = await AsyncStorage.getItem('@mock_db');
    if (mockDbData) {
      const mockDb = JSON.parse(mockDbData);
      const treasureMarks = mockDb.filter(n => n.type === 'treasure_mark');
      let questsAdded = false;
      for (const tm of treasureMarks) {
        if (!allQuests.find(q => q.id === 'quest_' + tm.id || q.id === tm.id)) {
          await QuestLogEngine.addQuest({
            id: 'quest_' + tm.id,
            npcId: 'system',
            titleKey: 'map.markers.treasure_mark',
            descKey: 'inventory.treasure_map_desc',
          });
          questsAdded = true;
        }
      }
      if (questsAdded) {
        const updatedQuests = await QuestLogEngine.getQuests();
        setQuests(updatedQuests);
        return;
      }
    }
`;

if (!file.includes('const mockDbData')) {
  file = file.replace(
    "const allQuests = await QuestLogEngine.getQuests();",
    "const allQuests = await QuestLogEngine.getQuests();\n" + syncCode
  );
  
  if (!file.includes("import AsyncStorage")) {
    file = file.replace("import { View", "import AsyncStorage from '@react-native-async-storage/async-storage';\nimport { View");
  }
}

fs.writeFileSync('src/screens/QuestLogScreen.js', file);
console.log("Patched QuestLogScreen.js to sync legacy treasure marks");
