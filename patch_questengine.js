const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/services/QuestEngine.ts');

let content = fs.readFileSync(file, 'utf8');

const targetStr = `          dialog: {
            start: {
              text: dialogStart,
              options: [
                { label: "Was genau machst du hier?", next: "explain_role" },
                { label: "Kann ich dir bei etwas helfen?", next: "offer_quest" },
                { label: "Auf Wiedersehen.", next: "end" }
              ]
            },
            explain_role: {
              text: \`npc.\${randomNpcDef.id}.explain_role\`,
              options: [
                { label: "Verstehe. Brauchst du dabei Hilfe?", next: "offer_quest" },
                { label: "Interessant. Bis bald!", next: "end" }
              ]
            },
            offer_quest: {`;

const replacementStr = `          dialog: {
            start: {
              text: dialogStart,
              options: [
                { label: \`npc.\${randomNpcDef.id}.opt_start_1\`, next: (randomNpcDef.dialogExchanges === 1) ? "offer_quest" : "explain_role_1" },
                { label: "npc.common.goodbye", next: "end" }
              ]
            },
            ...((randomNpcDef.dialogExchanges !== 1) ? {
              explain_role_1: {
                text: \`npc.\${randomNpcDef.id}.explain_role_1\`,
                options: [
                  { label: \`npc.\${randomNpcDef.id}.opt_explain_1_1\`, next: (randomNpcDef.dialogExchanges === 3) ? "explain_role_2" : "offer_quest" },
                  { label: "npc.common.goodbye", next: "end" }
                ]
              }
            } : {}),
            ...((randomNpcDef.dialogExchanges === 3) ? {
              explain_role_2: {
                text: \`npc.\${randomNpcDef.id}.explain_role_2\`,
                options: [
                  { label: \`npc.\${randomNpcDef.id}.opt_explain_2_1\`, next: "explain_role_3" },
                  { label: "npc.common.goodbye", next: "end" }
                ]
              },
              explain_role_3: {
                text: \`npc.\${randomNpcDef.id}.explain_role_3\`,
                options: [
                  { label: \`npc.\${randomNpcDef.id}.opt_explain_3_1\`, next: "offer_quest" },
                  { label: "npc.common.goodbye", next: "end" }
                ]
              }
            } : ((randomNpcDef.dialogExchanges !== 1) ? {
              explain_role_2: {
                text: \`npc.\${randomNpcDef.id}.explain_role_2\`,
                options: [
                  { label: \`npc.\${randomNpcDef.id}.opt_explain_2_1\`, next: "offer_quest" },
                  { label: "npc.common.goodbye", next: "end" }
                ]
              }
            } : {})),
            offer_quest: {`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replacementStr);
  fs.writeFileSync(file, content, 'utf8');
  console.log("Patched QuestEngine.ts dynamic dialog builder");
} else {
  console.log("Target string not found in QuestEngine.ts. Checking alternatives...");
}
