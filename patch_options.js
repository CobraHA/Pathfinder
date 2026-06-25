const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/screens/MapScreen.js');

let content = fs.readFileSync(file, 'utf8');

const targetRender = `            <View style={styles.dialogOptions}>
              {activeNPC?.data?.dialog?.[dialogNode]?.options?.map((opt, idx) => (`;

const replacementRender = `            <View style={styles.dialogOptions}>
              {(activeNPC?.data?.dialog?.[dialogNode]?.options?.length > 0 
                ? activeNPC.data.dialog[dialogNode].options 
                : (dialogNode === 'start' 
                    ? [
                        { label: "Was genau machst du hier?", next: "explain_role" },
                        { label: "Kann ich dir bei etwas helfen?", next: "offer_quest" },
                        { label: "Auf Wiedersehen.", next: "end" }
                      ]
                    : [{ label: "Auf Wiedersehen.", next: "end" }])
              ).map((opt, idx) => (`;

if (content.includes(targetRender)) {
  content = content.replace(targetRender, replacementRender);
  fs.writeFileSync(file, content, 'utf8');
  console.log("Patched MapScreen.js to include fallback dialog options!");
} else {
  console.log("Target string not found in MapScreen.js");
}
