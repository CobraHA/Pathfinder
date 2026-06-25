const fs = require('fs');
const file = 'src/services/QuestEngine.ts';
let content = fs.readFileSync(file, 'utf8');

const regex = /options: \[\n\s*\{ label: "Was genau machst du hier\?", next: "explain_role" \},\n\s*\{ label: "Kann ich dir bei etwas helfen\?", next: "offer_quest" \},\n\s*\{ label: "Auf Wiedersehen\.", next: "end" \}\n\s*\]/g;

const replacement = `options: [
                { label: "Was genau machst du hier?", next: "explain_role" },
                { label: "Kann ich dir bei etwas helfen?", next: "offer_quest" },
                ...(randomNpcDef.id === 'beggar' ? [{ label: "npc.beggar.opt_give_food", action: "open_donation_modal" }] : []),
                { label: "Auf Wiedersehen.", next: "end" }
              ]`;

content = content.replace(regex, replacement);

fs.writeFileSync(file, content, 'utf8');
console.log("Patched QuestEngine.ts for beggar dialog option!");
