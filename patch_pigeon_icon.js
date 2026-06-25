const fs = require('fs');
let file = fs.readFileSync('src/screens/QuestLogScreen.js', 'utf8');

// Update imports
if (!file.includes('MaterialCommunityIcons')) {
  file = file.replace("import { Feather } from '@expo/vector-icons';", "import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';");
}

// Replace in progress bar
const target1 = `<Feather name="send" size={14} color="#4CAF50" style={{ position: 'absolute', left: \`\${Math.max(0, progress * 100 - 15)}%\`, bottom: 6 }}`;
const replacement1 = `<MaterialCommunityIcons name="bird" size={16} color="#4CAF50" style={{ position: 'absolute', left: \`\${Math.max(0, progress * 100 - 15)}%\`, bottom: 6 }}`;
file = file.replace(target1, replacement1);

// Replace button icon and text
const target2 = `<Feather name="send" size={14} color={availablePigeons > 0 ? "#E9BC62" : "#666"} style={{ marginRight: 5 }} />
                        <Text style={{ color: availablePigeons > 0 ? '#E9BC62' : '#666', fontSize: 12 }}>Senden ({flightSecs}s)</Text>`;
const replacement2 = `<MaterialCommunityIcons name="bird" size={16} color={availablePigeons > 0 ? "#E9BC62" : "#666"} style={{ marginRight: 5 }} />
                        <Text style={{ color: availablePigeons > 0 ? '#E9BC62' : '#666', fontSize: 12 }}>Brieftaube ({flightSecs}s)</Text>`;
file = file.replace(target2, replacement2);

fs.writeFileSync('src/screens/QuestLogScreen.js', file);
console.log("Patched pigeon icon and text");
