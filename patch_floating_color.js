const fs = require('fs');
let path = 'src/screens/MapScreen.js';
let content = fs.readFileSync(path, 'utf8');

// The floating animation has its own switch, let's just do a global replace for the specific block
content = content.replace(/iconColor = '#666666';/g, "iconColor = '#9E9E9E';");

fs.writeFileSync(path, content, 'utf8');
console.log("Patched floating text color");
