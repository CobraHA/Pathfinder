const fs = require('fs');
let file = fs.readFileSync('src/screens/QuestLogScreen.js', 'utf8');

if (!file.includes('Alert } from')) {
  file = file.replace("ScrollView } from 'react-native'", "ScrollView, Alert } from 'react-native'");
}

const targetStr = `          <Text style={styles.dateText}>
            {new Date(quest.timestamp).toLocaleDateString()}
          </Text>`;

const replaceStr = `          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
            <Text style={styles.dateText}>
              {new Date(quest.timestamp).toLocaleDateString()}
            </Text>
            {!isCompleted && (
              <TouchableOpacity
                style={{ paddingVertical: 4, paddingHorizontal: 8, backgroundColor: '#3E2723', borderRadius: 4, borderWidth: 1, borderColor: '#8B4513' }}
                onPress={() => {
                  Alert.alert(
                    "Aufgabe abbrechen",
                    "Bist du sicher, dass du diese Aufgabe abbrechen möchtest? Du kannst sie später wieder annehmen.",
                    [
                      { text: "Nein", style: "cancel" },
                      { 
                        text: "Ja", 
                        style: "destructive",
                        onPress: async () => {
                          if (pinnedNodeId === quest.npcId || pinnedNodeId === quest.id.replace('quest_', '')) {
                            setPinnedNodeId(null);
                            PinEngine.setPinnedNodeId(null);
                          }
                          await QuestLogEngine.removeQuest(quest.id);
                          loadQuests();
                        }
                      }
                    ]
                  );
                }}
              >
                <Text style={{ color: '#FF6B6B', fontSize: 12 }}>Abbrechen</Text>
              </TouchableOpacity>
            )}
          </View>`;

if (file.includes(targetStr)) {
  file = file.replace(targetStr, replaceStr);
  fs.writeFileSync('src/screens/QuestLogScreen.js', file);
  console.log("Patched QuestLogScreen.js successfully");
} else {
  console.log("Could not find target string");
}
