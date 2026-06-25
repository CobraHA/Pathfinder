const fs = require('fs');
const file = 'src/screens/MapScreen.js';
let content = fs.readFileSync(file, 'utf8');

const regex = /<Marker\n\s*coordinate=\{\{\n\s*latitude: effectiveLocation\.coords\.latitude,\n\s*longitude: effectiveLocation\.coords\.longitude\n\s*\}\}\n\s*zIndex=\{999\}/;
const replacement = `<Marker
          key="player_marker"
          coordinate={{
            latitude: effectiveLocation.coords.latitude,
            longitude: effectiveLocation.coords.longitude
          }}
          zIndex={999}`;

if (content.match(regex)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync(file, content, 'utf8');
  console.log("Patched MapScreen.js to add key to player marker!");
} else {
  console.log("Regex did not match.");
}
