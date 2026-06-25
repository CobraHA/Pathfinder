const fs = require('fs');
let path = 'src/config/osm_mapping.json';
let mappingData = JSON.parse(fs.readFileSync(path, 'utf8'));

mappingData["abandoned:shop=clothes"].itemId = ["fabric", "broken_shirt", "broken_pants"];

fs.writeFileSync(path, JSON.stringify(mappingData, null, 2), 'utf8');
console.log("Patched osm_mapping.json for abandoned clothes shop");
