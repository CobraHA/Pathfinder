const fs = require('fs');
let file = fs.readFileSync('src/screens/QuestLogScreen.js', 'utf8');

// Change interval
const intervalTarget = `      const interval = setInterval(() => {
        setCurrentTime(Date.now());
      }, 1000);`;
const intervalReplacement = `      const interval = setInterval(() => {
        setCurrentTime(Date.now());
      }, 50);`;
file = file.replace(intervalTarget, intervalReplacement);

// Update UI structure
const uiTarget = `                  <View style={{ width: 120, alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 10, color: '#A0A0A0', marginBottom: 2 }}>{remainingSecs}s verbleibend</Text>
                    <View style={{ width: '100%', height: 4, backgroundColor: '#333', borderRadius: 2, overflow: 'hidden' }}>
                       <View style={{ width: \`\${progress * 100}%\`, height: '100%', backgroundColor: '#4CAF50' }} />
                    </View>
                    <MaterialCommunityIcons name="bird" size={16} color="#4CAF50" style={{ position: 'absolute', left: \`\${Math.max(0, progress * 100 - 15)}%\`, bottom: 6 }} />
                  </View>`;

const uiReplacement = `                  <View style={{ width: 120, alignItems: 'center' }}>
                    <View style={{ width: '100%', height: 4, backgroundColor: '#333', borderRadius: 2, overflow: 'hidden', marginTop: 18, marginBottom: 4 }}>
                       <View style={{ width: \`\${progress * 100}%\`, height: '100%', backgroundColor: '#4CAF50' }} />
                    </View>
                    <MaterialCommunityIcons name="bird" size={18} color="#4CAF50" style={{ position: 'absolute', left: \`\${Math.max(0, progress * 100 - 15)}%\`, top: 0 }} />
                    <Text style={{ fontSize: 10, color: '#A0A0A0' }}>\${remainingSecs}s verbleibend</Text>
                  </View>`;
file = file.replace(uiTarget, uiReplacement);

fs.writeFileSync('src/screens/QuestLogScreen.js', file);
console.log("Patched pigeon smoothness and UI layout");
