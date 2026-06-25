const fs = require('fs');
let path = 'node_modules/react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json';
if (fs.existsSync(path)) {
    const data = JSON.parse(fs.readFileSync(path, 'utf8'));
    console.log("Has jeans:", !!data['jeans']);
    console.log("Has pants:", !!data['pants']);
    console.log("Has hanger:", !!data['hanger']);
} else {
    console.log("Could not find glyphmap");
}
