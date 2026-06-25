const fs = require('fs');
let file = fs.readFileSync('src/screens/MapScreen.js', 'utf8');

// 1. Change handleDialogOption to take npcTarget and use it
file = file.replace(/const handleDialogOption = async \(option\) => \{/, "const handleDialogOption = async (option, npcTarget = activeNPC) => {");
file = file.replace(/activeNPC\?/g, "npcTarget?");
file = file.replace(/activeNPC\./g, "npcTarget.");
file = file.replace(/setActiveNPC\(npcTarget\)/g, "setActiveNPC(npcTarget)"); // Revert setActiveNPC
file = file.replace(/setActiveNPC\(\{\n\s*\.\.\.npcTarget/g, "setActiveNPC({\n                ...npcTarget");

// 2. Add popup to finish_quest
const finishQuestTarget = `          await InventoryEngine.addItem({ id: itemRewardId, name: itemRewardId, type: 'quest_reward' }, 1);
          await QuestLogEngine.completeQuest(questId);
          handleGainXP(xpGained, 'quest');`;

const finishQuestReplacement = `          await InventoryEngine.addItem({ id: itemRewardId, name: itemRewardId, type: 'quest_reward' }, 1);
          await QuestLogEngine.completeQuest(questId);
          handleGainXP(xpGained, 'quest');
          
          const translatedRewardName = i18n.t(\`items.\${itemRewardId}\`, { defaultValue: itemRewardId });
          setChestLootResult({
            amount: 1,
            name: translatedRewardName,
            icon: 'star',
            color: '#FFD700'
          });`;

file = file.replace(finishQuestTarget, finishQuestReplacement);

// 3. Add auto turn-in logic in handleNPCInteraction
const npcInteractionTarget = `      if (isCompleted) {
        setDialogNode('quest_already_completed');
      } else if (isActive) {
        setDialogNode('check_quest_progress');
      } else {
        setDialogNode('start');
      }`;

const npcInteractionReplacement = `      if (isCompleted) {
        setDialogNode('quest_already_completed');
      } else if (isActive) {
        const allQuests = await QuestLogEngine.getQuests();
        const activeQuest = allQuests.find(q => q.id === questId);
        if (activeQuest && activeQuest.requirement) {
          const req = activeQuest.requirement;
          const inventory = await InventoryEngine.getInventory();
          const invItem = inventory.find(i => i.id === req.itemId);
          const hasAmount = invItem ? invItem.quantity : 0;
          const turnedIn = activeQuest.turnedInAmount || 0;
          if (hasAmount + turnedIn >= req.amount) {
            setActiveNPC(npc);
            await handleDialogOption({ next: 'complete_quest' }, npc);
            return;
          }
        }
        setDialogNode('check_quest_progress');
      } else {
        setDialogNode('start');
      }`;

file = file.replace(npcInteractionTarget, npcInteractionReplacement);

fs.writeFileSync('src/screens/MapScreen.js', file);
console.log("Patched MapScreen.js successfully!");
