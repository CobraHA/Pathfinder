const fs = require('fs');
const file = 'src/screens/MapScreen.js';
let content = fs.readFileSync(file, 'utf8');

// Change 20m threshold to 10m
content = content.replace(/if \(distance > 20\) shouldUpdate = true;/g, 'if (distance > 10) shouldUpdate = true;');

// Update the filtering logic to recalculate distance dynamically
const oldFilter = `prev.forEach(p => {
                  if (p.distance_meters === undefined || p.distance_meters < 500 || p.id === pinnedQuestId || activeQuestIds.includes(p.id)) {
                    map.set(p.id, p);
                  }
                });`;

const newFilter = `prev.forEach(p => {
                  if (p.location?.coordinates) {
                    p.distance_meters = getDistance(latitude, longitude, p.location.coordinates[1], p.location.coordinates[0]);
                  }
                  if (p.distance_meters === undefined || p.distance_meters < 500 || p.id === pinnedQuestId || activeQuestIds.includes(p.id)) {
                    map.set(p.id, p);
                  }
                });`;

content = content.replace(oldFilter, newFilter);

// Also update the other occurrence in centerAndReload
const oldFilter2 = `prev.forEach(p => {
                if (p.distance_meters === undefined || p.distance_meters < 500 || p.id === pinnedQuestId || activeQuestIds.includes(p.id)) {
                  map.set(p.id, p);
                }
              });`;

const newFilter2 = `prev.forEach(p => {
                if (p.location?.coordinates) {
                  p.distance_meters = getDistance(latitude, longitude, p.location.coordinates[1], p.location.coordinates[0]);
                }
                if (p.distance_meters === undefined || p.distance_meters < 500 || p.id === pinnedQuestId || activeQuestIds.includes(p.id)) {
                  map.set(p.id, p);
                }
              });`;

content = content.replace(oldFilter2, newFilter2);

fs.writeFileSync(file, content, 'utf8');
console.log("Patched MapScreen distance update and threshold!");
