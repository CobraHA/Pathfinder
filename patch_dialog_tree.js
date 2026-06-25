const fs = require('fs');
let file = fs.readFileSync('src/services/questEngine.ts', 'utf8');

const target1 = `            start: {
              text: dialogStart,
              options: [
                { label: "Kann ich irgendwie helfen?", next: "offer_quest" },
                { label: "Auf Wiedersehen.", next: "end" }
              ]
            },
            offer_quest: {
              text: "Gut, dass du fragst! Ich brauche dringend diese Items. Besorge sie mir und ich werde dich belohnen.",
              action: "give_quest",`;

const replacement1 = `            start: {
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
            offer_quest: {
              text: "Gut, dass du fragst! Ich brauche dringend diese Items. Besorge sie mir und ich werde dich angemessen entlohnen.",
              action: "give_quest",`;

file = file.replaceAll(target1, replacement1);

const target2 = `            start: {
              text: randomNpcDef.dialogStartKey,
              options: [
                { label: "Kann ich irgendwie helfen?", next: "offer_quest" },
                { label: "Auf Wiedersehen.", next: "end" }
              ]
            },
            offer_quest: {
              text: "Gut, dass du fragst! Ich brauche dringend diese Items. Besorge sie mir und ich werde dich belohnen.",
              action: "give_quest",`;

const replacement2 = `            start: {
              text: randomNpcDef.dialogStartKey,
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
            offer_quest: {
              text: "Gut, dass du fragst! Ich brauche dringend diese Items. Besorge sie mir und ich werde dich angemessen entlohnen.",
              action: "give_quest",`;

file = file.replaceAll(target2, replacement2);

fs.writeFileSync('src/services/questEngine.ts', file);
console.log("Patched dialog tree for dynamic NPCs to add explain_role");
