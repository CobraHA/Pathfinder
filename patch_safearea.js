const fs = require('fs');

const files = [
  'src/screens/QuestLogScreen.js',
  'src/screens/CraftingScreen.js',
  'src/screens/ShopScreen.js',
  'src/screens/InventoryScreen.js'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes("SafeAreaView } from 'react-native'")) {
    content = content.replace(", SafeAreaView } from 'react-native'", " } from 'react-native'\nimport { SafeAreaView } from 'react-native-safe-area-context'");
    fs.writeFileSync(file, content);
    console.log("Patched", file);
  } else if (content.includes("SafeAreaView, TextInput } from 'react-native'")) {
    content = content.replace(", SafeAreaView, TextInput } from 'react-native'", ", TextInput } from 'react-native'\nimport { SafeAreaView } from 'react-native-safe-area-context'");
    fs.writeFileSync(file, content);
    console.log("Patched", file);
  }
});
