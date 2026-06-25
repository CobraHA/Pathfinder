const fs = require('fs');

let mapScreenPath = 'src/screens/MapScreen.js';
let mapScreenContent = fs.readFileSync(mapScreenPath, 'utf8');

const oldCallout = `<Callout>
        <View style={{ padding: 4, alignItems: 'center', minWidth: 140, maxWidth: 220 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 13, marginBottom: 2, textAlign: 'center' }}>{markerTitle}</Text>`;

const newCallout = `<Callout>
        <View style={{ padding: 4, alignItems: 'center', minWidth: 140, maxWidth: 250 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 13, marginBottom: 2, textAlign: 'center' }} adjustsFontSizeToFit={true} numberOfLines={2}>{markerTitle}</Text>`;

mapScreenContent = mapScreenContent.replace(oldCallout, newCallout);

fs.writeFileSync(mapScreenPath, mapScreenContent, 'utf8');
console.log("Patched MapScreen.js Callout wrapping");
