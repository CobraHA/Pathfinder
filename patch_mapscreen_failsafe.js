const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/screens/MapScreen.js');

let content = fs.readFileSync(file, 'utf8');

const targetStr = `        // FAILSAFE: Wenn der NPC gar keine Optionen hat (z.B. aus altem DB Cache), injiziere sie hier!
        if (npc.data?.dialog?.start && !npc.data.dialog.start.options) {
          npc.data.dialog.start.options = [
            { label: "Was genau machst du hier?", next: "explain_role" },
            { label: "Kann ich dir bei etwas helfen?", next: "offer_quest" },
            { label: "Auf Wiedersehen.", next: "end" }
          ];
          if (!npc.data.dialog.explain_role) {
            npc.data.dialog.explain_role = {
              text: "Ich versuche, in dieser rauen Welt zu überleben.",
              options: [
                { label: "Verstehe. Brauchst du dabei Hilfe?", next: "offer_quest" },
                { label: "Interessant. Bis bald!", next: "end" }
              ]
            };
          }`;

const replacementStr = `        // FAILSAFE: Wenn der NPC gar keine Optionen hat (z.B. aus altem DB Cache), injiziere sie hier!
        if (npc.data?.dialog?.start && !npc.data.dialog.start.options) {
          const exchanges = npc.data.dialogExchanges || 2;
          const baseId = npc.data.baseKey || "common";
          
          npc.data.dialog.start.options = [
            { label: \`npc.\${baseId}.opt_start_1\`, next: (exchanges === 1) ? "offer_quest" : "explain_role_1" },
            { label: "npc.common.goodbye", next: "end" }
          ];
          if (exchanges !== 1 && !npc.data.dialog.explain_role_1) {
            npc.data.dialog.explain_role_1 = {
              text: \`npc.\${baseId}.explain_role_1\`,
              options: [
                { label: \`npc.\${baseId}.opt_explain_1_1\`, next: (exchanges === 3) ? "explain_role_2" : "offer_quest" },
                { label: "npc.common.goodbye", next: "end" }
              ]
            };
          }
          if (exchanges === 3 && !npc.data.dialog.explain_role_2) {
            npc.data.dialog.explain_role_2 = {
              text: \`npc.\${baseId}.explain_role_2\`,
              options: [
                { label: \`npc.\${baseId}.opt_explain_2_1\`, next: "explain_role_3" },
                { label: "npc.common.goodbye", next: "end" }
              ]
            };
            npc.data.dialog.explain_role_3 = {
              text: \`npc.\${baseId}.explain_role_3\`,
              options: [
                { label: \`npc.\${baseId}.opt_explain_3_1\`, next: "offer_quest" },
                { label: "npc.common.goodbye", next: "end" }
              ]
            };
          } else if (exchanges !== 1 && !npc.data.dialog.explain_role_2) {
            npc.data.dialog.explain_role_2 = {
              text: \`npc.\${baseId}.explain_role_2\`,
              options: [
                { label: \`npc.\${baseId}.opt_explain_2_1\`, next: "offer_quest" },
                { label: "npc.common.goodbye", next: "end" }
              ]
            };
          }`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replacementStr);
  fs.writeFileSync(file, content, 'utf8');
  console.log("Patched MapScreen.js failsafe");
} else {
  console.log("Target string not found in MapScreen.js failsafe");
}
