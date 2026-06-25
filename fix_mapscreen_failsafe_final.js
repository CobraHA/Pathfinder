const fs = require('fs');
const file = 'src/screens/MapScreen.js';
let content = fs.readFileSync(file, 'utf8');

const oldFailsafeTrigger = `        // FAILSAFE: Wenn der NPC gar keine Optionen hat (z.B. aus altem DB Cache), injiziere sie hier!
        if (npc.data?.dialog?.start && !npc.data.dialog.start.options) {`;

const newFailsafeTrigger = `        // FAILSAFE: Wenn der NPC gar keine Optionen hat oder der start Node komplett fehlt, injiziere alles hier!
        if (!npc.data?.dialog) npc.data.dialog = {};
        if (!npc.data.dialog.start || !npc.data.dialog.start.options) {
          if (!npc.data.dialog.start) npc.data.dialog.start = { text: npc.data.dialog.text || \`npc.\${npc.data.baseKey || "common"}.start\` };
`;

content = content.replace(oldFailsafeTrigger, newFailsafeTrigger);

fs.writeFileSync(file, content, 'utf8');
console.log("Fixed Failsafe trigger!");
