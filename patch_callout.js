const fs = require('fs');
let content = fs.readFileSync('src/screens/MapScreen.js', 'utf8');

// Update import
if (!content.includes('Callout')) {
  content = content.replace("Polygon, PROVIDER_GOOGLE", "Polygon, Callout, PROVIDER_GOOGLE");
}

// Modify MemoizedQuestMarker
const markerRegex = /<Marker\s+key=\{q\.id\}\s+tracksViewChanges=\{Platform\.OS === 'android'\}\s+coordinate=\{\{\s+latitude: qLat \|\| \(effectiveLocation\.coords\.latitude \+ 0\.001\),\s+longitude: qLon \|\| \(effectiveLocation\.coords\.longitude \+ 0\.001\)\s+\}\}\s+title=\{([^\}]+)\}\s+description=\{([^\}]+)\}\s+onPress=\{[^\}]+\}\s+>/;

// We need to parse out the title and description, wait, the regex might be tricky if there are nested curly braces.
