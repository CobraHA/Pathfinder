const fs = require('fs');

// --- 1. Patch NodeStateEngine.ts ---
let nodeEnginePath = 'src/services/NodeStateEngine.ts';
let nodeEngineContent = fs.readFileSync(nodeEnginePath, 'utf8');

const oldNodeEngineLogic = `      if (state.gathersLeft <= 0) {
        // Depleted, check if respawn time has passed
        if (now - state.lastGatheredAt > RESPAWN_TIME_MS) {
          return true; // Respawned
        }
        return false; // Still depleted
      }`;

const newNodeEngineLogic = `      if (state.gathersLeft <= 0) {
        // Depleted, check if respawn time has passed
        if (now - state.lastGatheredAt > RESPAWN_TIME_MS) {
          return true; // Respawned
        }
        if (node.data?.resource?.itemId === 'fabric') {
          node.isDepleted = true;
          return true; // Keep it on map, but as depleted
        }
        return false; // Still depleted
      }`;
nodeEngineContent = nodeEngineContent.replace(oldNodeEngineLogic, newNodeEngineLogic);
fs.writeFileSync(nodeEnginePath, nodeEngineContent, 'utf8');

// --- 2. Patch MapScreen.js Marker Filtering ---
let mapScreenPath = 'src/screens/MapScreen.js';
let mapScreenContent = fs.readFileSync(mapScreenPath, 'utf8');

const oldMapScreenFiltering = `              ]).start(() => {
                setQuests(prev => prev.filter(q => q.id !== npc.id));
                setAnimatingNodes(prev => {`;

const newMapScreenFiltering = `              ]).start(() => {
                if (npc.data?.resource?.itemId === 'fabric') {
                  setQuests(prev => prev.map(q => q.id === npc.id ? { ...q, isDepleted: true } : q));
                } else {
                  setQuests(prev => prev.filter(q => q.id !== npc.id));
                }
                setAnimatingNodes(prev => {`;
mapScreenContent = mapScreenContent.replace(oldMapScreenFiltering, newMapScreenFiltering);

// --- 3. Patch MapScreen.js Marker Icon ---
const oldMapScreenIcon = `      case 'gasoline': iconName = 'gas-station'; iconColor = '#FF4500'; break;
      default: iconName = 'package-variant'; iconColor = '#E9BC62'; break;
    }
  }`;

const newMapScreenIcon = `      case 'gasoline': iconName = 'gas-station'; iconColor = '#FF4500'; break;
      default: iconName = 'package-variant'; iconColor = '#E9BC62'; break;
    }
  }

  if (q.isDepleted) {
    if (q.data?.resource?.itemId === 'fabric') {
      iconName = 'tshirt-crew-outline';
      iconColor = '#666666';
      bgColor = 'rgba(20, 20, 20, 0.9)';
    }
  }`;
mapScreenContent = mapScreenContent.replace(oldMapScreenIcon, newMapScreenIcon);

fs.writeFileSync(mapScreenPath, mapScreenContent, 'utf8');
console.log("Patched NodeStateEngine and MapScreen for depleted fabric nodes");
