const fs = require('fs');
const file = 'src/screens/MapScreen.js';
let content = fs.readFileSync(file, 'utf8');

const regex = /\{\/\* Player Avatar \*\/\}\n\s*<Marker\n\s*key="player_marker"([\s\S]*?)<\/Marker>\n\n\s*\{quests\.map\(\(q\) => \{/g;

const replacement = `{[
        /* Player Avatar */
        <Marker
          key="player_marker"$1</Marker>,
        ...quests.filter(q => q && q.id).map((q) => {`;

content = content.replace(regex, replacement);

const endRegex = /\}\)\}\n\s*<\/MapView>/g;
const endReplacement = `})]\n      }\n      </MapView>`;

content = content.replace(endRegex, endReplacement);

fs.writeFileSync(file, content, 'utf8');
console.log("Patched MapScreen.js to flatten MapView children!");
