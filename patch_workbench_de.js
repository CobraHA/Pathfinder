const fs = require('fs');
const file = 'src/i18n/de.json';
let data = JSON.parse(fs.readFileSync(file, 'utf8'));

if (!data.map) data.map = {};
if (!data.map.markers) data.map.markers = {};
data.map.markers.workbench = "Werkbank";

fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
console.log("Patched de.json for workbench");
