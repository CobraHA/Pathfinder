const fs = require('fs');
let file = fs.readFileSync('src/screens/MapScreen.js', 'utf8');

const target1 = `        const added = await QuestLogEngine.addQuest({
          id: questId,
          npcId: npcTarget?.id || 'unknown',
          titleKey: nextNode?.questTitle || \`quest_title_\${npcTarget?.id}\`,
          descKey: nextNode?.questDesc || \`quest_desc_\${npcTarget?.id}\`,
          requirement: nextNode?.questRequirement,
          rewardXP: nextNode?.xpReward || 50,
          rewardItem: nextNode?.rewardItem
        });`;

const replacement1 = `        let nLat = npcTarget?.location?.coordinates?.[1] || effectiveLocation.coords.latitude;
        let nLon = npcTarget?.location?.coordinates?.[0] || effectiveLocation.coords.longitude;
        if (typeof npcTarget?.location === 'string') {
          try {
            const match = npcTarget.location.match(/POINT\\(([^ ]+) ([^ ]+)\\)/);
            if (match) { nLon = parseFloat(match[1]); nLat = parseFloat(match[2]); }
          } catch(e) {}
        }
        
        const added = await QuestLogEngine.addQuest({
          id: questId,
          npcId: npcTarget?.id || 'unknown',
          titleKey: nextNode?.questTitle || \`quest_title_\${npcTarget?.id}\`,
          descKey: nextNode?.questDesc || \`quest_desc_\${npcTarget?.id}\`,
          requirement: nextNode?.questRequirement,
          rewardXP: nextNode?.xpReward || 50,
          rewardItem: nextNode?.rewardItem,
          npcLocation: { lat: nLat, lon: nLon }
        });`;

file = file.replace(target1, replacement1);

const target2 = `        await QuestLogEngine.addQuest({
          id: questId,
          npcId: npcTarget?.id || 'unknown',
          titleKey: nextNode?.questTitle || \`quest_title_\${npcTarget?.id}\`,
          descKey: nextNode?.questDesc || \`quest_desc_\${npcTarget?.id}\`,
          requirement: nextNode?.questRequirement,
          rewardXP: nextNode?.xpReward || 50,
          rewardItem: nextNode?.rewardItem
        });`;

const replacement2 = `        let nLat = npcTarget?.location?.coordinates?.[1] || effectiveLocation.coords.latitude;
        let nLon = npcTarget?.location?.coordinates?.[0] || effectiveLocation.coords.longitude;
        if (typeof npcTarget?.location === 'string') {
          try {
            const match = npcTarget.location.match(/POINT\\(([^ ]+) ([^ ]+)\\)/);
            if (match) { nLon = parseFloat(match[1]); nLat = parseFloat(match[2]); }
          } catch(e) {}
        }

        await QuestLogEngine.addQuest({
          id: questId,
          npcId: npcTarget?.id || 'unknown',
          titleKey: nextNode?.questTitle || \`quest_title_\${npcTarget?.id}\`,
          descKey: nextNode?.questDesc || \`quest_desc_\${npcTarget?.id}\`,
          requirement: nextNode?.questRequirement,
          rewardXP: nextNode?.xpReward || 50,
          rewardItem: nextNode?.rewardItem,
          npcLocation: { lat: nLat, lon: nLon }
        });`;

file = file.replace(target2, replacement2);
fs.writeFileSync('src/screens/MapScreen.js', file);
console.log("Patched MapScreen with npcLocation");
