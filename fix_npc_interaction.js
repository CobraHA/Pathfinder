const fs = require('fs');
let file = fs.readFileSync('src/screens/MapScreen.js', 'utf8');

const target = `        }
        setDialogNode('start');
      }
      return;
    }`;

const replacement = `        }
        setActiveNPC(npc);
        setDialogNode('start');
      }
      return;
    }`;

file = file.replace(target, replacement);
fs.writeFileSync('src/screens/MapScreen.js', file);
console.log("Fixed NPC interaction");
