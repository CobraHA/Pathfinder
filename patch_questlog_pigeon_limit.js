const fs = require('fs');
let file = fs.readFileSync('src/screens/QuestLogScreen.js', 'utf8');

const target = `              if (quest.requirement) {
                const invItem = inventory.find(i => i.id === quest.requirement.itemId);
                const hasAmount = invItem ? invItem.quantity : 0;
                const turnedIn = quest.turnedInAmount || 0;
                if (hasAmount + turnedIn >= quest.requirement.amount) {
                  // Player can send a pigeon!
                  return (
                    <TouchableOpacity
                      style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#3E2723', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, borderWidth: 1, borderColor: '#8B4513' }}
                      onPress={() => {
                        Alert.alert("Brieftaube senden?", "Willst du die Items per Brieftaube an den NPC schicken? Das dauert je nach Entfernung einen Moment.", [
                          { text: "Abbrechen", style: "cancel" },
                          { text: "Senden", onPress: async () => {
                            let flightSecs = 20 + Math.floor(Math.random() * 30); // Zufällig 20 bis 50 Sekunden für die Brieftaube`;

const replacement = `              if (quest.requirement) {
                const invItem = inventory.find(i => i.id === quest.requirement.itemId);
                const hasAmount = invItem ? invItem.quantity : 0;
                const turnedIn = quest.turnedInAmount || 0;
                if (hasAmount + turnedIn >= quest.requirement.amount) {
                  // Pigeon limit logic
                  const flyingPigeons = quests.filter(q => q.pigeonStatus === 'flying').length;
                  const maxPigeons = Math.min(3, 1 + (inventory.find(i => i.id === 'carrier_pigeon_upgrade')?.quantity || 0));
                  const availablePigeons = maxPigeons - flyingPigeons;
                  
                  // Deterministic flight time
                  let flightSecs = 20 + (quest.id.length % 31);
                  
                  return (
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{ fontSize: 10, color: '#A0A0A0', marginBottom: 2 }}>Tauben: {availablePigeons}/{maxPigeons}</Text>
                      <TouchableOpacity
                        style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: availablePigeons > 0 ? '#3E2723' : '#2A2A2A', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, borderWidth: 1, borderColor: availablePigeons > 0 ? '#8B4513' : '#444' }}
                        disabled={availablePigeons <= 0}
                        onPress={() => {
                          if (availablePigeons <= 0) return;
                          Alert.alert("Brieftaube senden?", \`Willst du die Items per Brieftaube schicken? Die Reise dauert ca. \${flightSecs} Sekunden.\`, [
                            { text: "Abbrechen", style: "cancel" },
                            { text: "Senden", onPress: async () => {
`;

file = file.replace(target, replacement);

const target2 = `                      <Feather name="send" size={14} color="#E9BC62" style={{ marginRight: 5 }} />
                      <Text style={{ color: '#E9BC62', fontSize: 12 }}>Senden</Text>
                    </TouchableOpacity>
                  );
                }`;

const replacement2 = `                      <Feather name="send" size={14} color={availablePigeons > 0 ? "#E9BC62" : "#666"} style={{ marginRight: 5 }} />
                      <Text style={{ color: availablePigeons > 0 ? '#E9BC62' : '#666', fontSize: 12 }}>Senden ({flightSecs}s)</Text>
                    </TouchableOpacity>
                  </View>
                  );
                }`;

file = file.replace(target2, replacement2);

fs.writeFileSync('src/screens/QuestLogScreen.js', file);
console.log("Patched pigeon limit and UI");
