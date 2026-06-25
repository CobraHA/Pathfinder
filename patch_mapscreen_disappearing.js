const fs = require('fs');
const file = 'src/screens/MapScreen.js';
let content = fs.readFileSync(file, 'utf8');

// 1. Add a ref to track initial fetch instead of quests.length
if (!content.includes('const hasInitialFetched = useRef(false);')) {
  content = content.replace(/const lastFetchRef = useRef\(0\);/, "const lastFetchRef = useRef(0);\n  const hasInitialFetched = useRef(false);");
}

// 2. Replace the faulty useEffect condition
const badCond = /if \(shouldUpdate \|\| quests\.length === 0\) \{/g;
const goodCond = `if (shouldUpdate || !hasInitialFetched.current) {
        hasInitialFetched.current = true;`;
content = content.replace(badCond, goodCond);

// 3. Fix the setQuests location parsing in useEffect
const oldFilter = `prev.forEach(p => {
                  if (p.location?.coordinates) {
                    p.distance_meters = getDistance(latitude, longitude, p.location.coordinates[1], p.location.coordinates[0]);
                  }`;

const newFilter = `prev.forEach(p => {
                  let pLoc = p.location;
                  if (typeof pLoc === 'string') {
                    try { pLoc = JSON.parse(pLoc); } catch (e) {}
                  }
                  if (pLoc?.coordinates) {
                    p.distance_meters = getDistance(latitude, longitude, pLoc.coordinates[1], pLoc.coordinates[0]);
                  }`;

content = content.replace(oldFilter, newFilter);

// Fix the other occurrence in centerAndReload
const oldFilter2 = `prev.forEach(p => {
                if (p.location?.coordinates) {
                  p.distance_meters = getDistance(latitude, longitude, p.location.coordinates[1], p.location.coordinates[0]);
                }`;

const newFilter2 = `prev.forEach(p => {
                let pLoc = p.location;
                if (typeof pLoc === 'string') {
                  try { pLoc = JSON.parse(pLoc); } catch (e) {}
                }
                if (pLoc?.coordinates) {
                  p.distance_meters = getDistance(latitude, longitude, pLoc.coordinates[1], pLoc.coordinates[0]);
                }`;

content = content.replace(oldFilter2, newFilter2);

fs.writeFileSync(file, content, 'utf8');
console.log("Patched MapScreen.js to fix disappearing markers!");
