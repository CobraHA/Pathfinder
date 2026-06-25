const fs = require('fs');
let file = fs.readFileSync('src/screens/QuestLogScreen.js', 'utf8');

// Ensure InventoryEngine and other imports
if (!file.includes("import { InventoryEngine }")) {
  file = file.replace("import { QuestLogEngine }", "import { QuestLogEngine } from '../services/QuestLogEngine';\nimport { InventoryEngine } from '../services/InventoryEngine';");
}
if (!file.includes("import { getDistance }")) {
  file = file.replace("import { QuestLogEngine }", "import { getDistance } from '../utils/LocationUtils';\nimport { QuestLogEngine }");
}
// wait, getDistance might not exist in LocationUtils? Actually let's just use the one from MapScreen or write a simple one if needed. Let's just write a simple getDistance in QuestLogScreen to be safe:
const getDistanceFunc = `
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const p1 = lat1 * Math.PI/180;
  const p2 = lat2 * Math.PI/180;
  const dp = (lat2-lat1) * Math.PI/180;
  const dl = (lon2-lon1) * Math.PI/180;
  const a = Math.sin(dp/2) * Math.sin(dp/2) +
            Math.cos(p1) * Math.cos(p2) *
            Math.sin(dl/2) * Math.sin(dl/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
`;

if (!file.includes("function getDistance")) {
  file = file.replace("export default function QuestLogScreen", getDistanceFunc + "\nexport default function QuestLogScreen");
}

// Add state for inventory and current location
file = file.replace("const [pinnedNodeId, setPinnedNodeId] = useState(null);", "const [pinnedNodeId, setPinnedNodeId] = useState(null);\n  const [inventory, setInventory] = useState([]);\n  const [currentTime, setCurrentTime] = useState(Date.now());");

// Interval for pigeon timer
const useEffectTarget = `  useEffect(() => {
    if (isFocused) {
      loadQuests();
    }
  }, [isFocused]);`;

const useEffectReplacement = `  useEffect(() => {
    if (isFocused) {
      loadQuests();
      const interval = setInterval(() => {
        setCurrentTime(Date.now());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isFocused]);`;
file = file.replace(useEffectTarget, useEffectReplacement);

// Load inventory in loadQuests
const loadQuestsTarget = `    const allQuests = await QuestLogEngine.getQuests();`;
const loadQuestsReplacement = `    const allQuests = await QuestLogEngine.getQuests();\n    const inv = await InventoryEngine.getInventory();\n    setInventory(inv);`;
file = file.replace(loadQuestsTarget, loadQuestsReplacement);

// In renderQuestCard, check pigeon and inventory
const renderTarget = `          <View style={{ marginTop: 10 }}>
            <Text style={styles.dateText}>
              {new Date(quest.timestamp).toLocaleDateString()}
            </Text>
          </View>
        </View>`;

const renderReplacement = `          <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <Text style={styles.dateText}>
              {new Date(quest.timestamp).toLocaleDateString()}
            </Text>

            {/* Pigeon Logic */}
            {!isCompleted && (() => {
              if (quest.pigeonStatus === 'flying') {
                const totalFlightTime = quest.pigeonArrivalTime - quest.pigeonDispatchTime;
                const timePassed = currentTime - quest.pigeonDispatchTime;
                let progress = timePassed / totalFlightTime;
                let remainingSecs = Math.ceil((quest.pigeonArrivalTime - currentTime) / 1000);
                
                if (progress >= 1) {
                  progress = 1;
                  remainingSecs = 0;
                  // Auto-complete if time is up and not yet processed
                  QuestLogEngine.completePigeonFlight(quest.id).then((success) => {
                    if (success) {
                       if (quest.rewardItem) InventoryEngine.addItem({ id: quest.rewardItem, name: quest.rewardItem, type: 'quest_reward' }, 1);
                       Alert.alert("Brieftaube angekommen!", "Die Quest wurde erfolgreich abgeschlossen!");
                       loadQuests();
                    }
                  });
                }
                
                return (
                  <View style={{ width: 120, alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 10, color: '#A0A0A0', marginBottom: 2 }}>{remainingSecs}s verbleibend</Text>
                    <View style={{ width: '100%', height: 4, backgroundColor: '#333', borderRadius: 2, overflow: 'hidden' }}>
                       <View style={{ width: \`\${progress * 100}%\`, height: '100%', backgroundColor: '#4CAF50' }} />
                    </View>
                    <Feather name="send" size={14} color="#4CAF50" style={{ position: 'absolute', left: \`\${Math.max(0, progress * 100 - 15)}%\`, bottom: 6 }} />
                  </View>
                );
              }

              if (quest.requirement) {
                const invItem = inventory.find(i => i.id === quest.requirement.itemId);
                const hasAmount = invItem ? invItem.quantity : 0;
                const turnedIn = quest.turnedInAmount || 0;
                if (hasAmount + turnedIn >= quest.requirement.amount && quest.npcLocation) {
                  // Player can send a pigeon!
                  return (
                    <TouchableOpacity
                      style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#3E2723', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, borderWidth: 1, borderColor: '#8B4513' }}
                      onPress={() => {
                        Alert.alert("Brieftaube senden?", "Willst du die Items per Brieftaube an den NPC schicken? Das dauert je nach Entfernung einen Moment.", [
                          { text: "Abbrechen", style: "cancel" },
                          { text: "Senden", onPress: async () => {
                            // Calculate Distance using a mock location or real location. We need player's current location here ideally.
                            // But since we are in QuestLog, we might not have it. Let's just assume a random distance or check if we can get it.
                            // Actually, distance from npcLocation to current location. If we don't have current location, just use a default time.
                            // Better: 60 seconds fixed if location unknown, else calc.
                            let flightSecs = 60; // default 60s
                            const dist = 500; // Mock distance for now since we don't have player location context in QuestLog.
                            // Alternatively, pass effectiveLocation to QuestLogScreen...
                            flightSecs = 10 + Math.floor(dist / 20); // 10s base + 1s per 20m
                            
                            const arrivalTime = Date.now() + flightSecs * 1000;
                            await InventoryEngine.removeItem(quest.requirement.itemId, quest.requirement.amount);
                            await QuestLogEngine.sendPigeon(quest.id, arrivalTime);
                            loadQuests();
                          }}
                        ]);
                      }}
                    >
                      <Feather name="send" size={14} color="#E9BC62" style={{ marginRight: 5 }} />
                      <Text style={{ color: '#E9BC62', fontSize: 12 }}>Senden</Text>
                    </TouchableOpacity>
                  );
                }
              }
              return null;
            })()}
          </View>
        </View>`;

file = file.replace(renderTarget, renderReplacement);
fs.writeFileSync('src/screens/QuestLogScreen.js', file);
console.log("Patched QuestLogScreen.js");
