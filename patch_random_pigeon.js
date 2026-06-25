const fs = require('fs');
let file = fs.readFileSync('src/screens/QuestLogScreen.js', 'utf8');

const target = `let flightSecs = 60; // default 60s
                            const dist = 500; // Mock distance for now since we don't have player location context in QuestLog.
                            // Alternatively, pass effectiveLocation to QuestLogScreen...
                            flightSecs = 10 + Math.floor(dist / 20); // 10s base + 1s per 20m`;

const replacement = `let flightSecs = 20 + Math.floor(Math.random() * 30); // Zufällig 20 bis 50 Sekunden für die Brieftaube`;

file = file.replace(target, replacement);
fs.writeFileSync('src/screens/QuestLogScreen.js', file);
console.log("Patched random flight time");
