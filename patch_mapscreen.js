const fs = require('fs');

let file = fs.readFileSync('src/screens/MapScreen.js', 'utf8');

// Add activeQuestIds state
const stateInjection = `  const [pinnedQuestId, setPinnedQuestId] = useState(null);
  const [activeQuestIds, setActiveQuestIds] = useState([]);`;
file = file.replace(`  const [pinnedQuestId, setPinnedQuestId] = useState(null);`, stateInjection);

// Load activeQuestIds
const loadInjection = `
    const checkPinned = async () => {
      const pin = await PinEngine.getPinnedMarker();
      setPinnedQuestId(pin);
      const allQuests = await QuestLogEngine.getQuests();
      const activeIds = allQuests.filter(q => q.status === 'active').map(q => q.id.replace('quest_', ''));
      setActiveQuestIds(activeIds);
    };
`;
file = file.replace(/const checkPinned = async \(\) => \{\s*const pin = await PinEngine.getPinnedMarker\(\);\s*setPinnedQuestId\(pin\);\s*\};/, loadInjection);

// Keep active and pinned quests
file = file.replace(/if \(p\.distance_meters === undefined \|\| p\.distance_meters < 1500\) \{/g, `if (p.distance_meters === undefined || p.distance_meters < 1500 || p.id === pinnedQuestId || activeQuestIds.includes(p.id)) {`);

fs.writeFileSync('src/screens/MapScreen.js', file);
console.log("Patched MapScreen filtering logic");
