const fs = require('fs');
let file = fs.readFileSync('src/screens/MapScreen.js', 'utf8');

const npcInteractionTarget = `        setDialogNode('check_quest_progress');
      } else {
        setDialogNode('start');
      }`;

const npcInteractionReplacement = `        setDialogNode('check_quest_progress');
      } else {
        const req = npc.data?.dialog?.accept_quest?.questRequirement;
        if (req) {
          const inventory = await InventoryEngine.getInventory();
          const invItem = inventory.find(i => i.id === req.itemId);
          const hasAmount = invItem ? invItem.quantity : 0;
          if (hasAmount >= req.amount) {
            const modifiedNpc = {
              ...npc,
              data: {
                ...npc.data,
                dialog: {
                  ...npc.data.dialog,
                  start: {
                    ...npc.data.dialog.start,
                    options: [
                      ...(npc.data.dialog.start.options || []),
                      { label: "npc.common.already_have_items", next: "fast_complete_node" }
                    ]
                  },
                  fast_complete_node: {
                    text: npc.data.dialog.complete_quest?.text || "Perfekt! Hier ist dein Lohn.",
                    action: "fast_complete_quest",
                    questRequirement: req,
                    xpReward: npc.data.dialog.accept_quest?.xpReward,
                    rewardItem: npc.data.dialog.accept_quest?.rewardItem,
                    questTitle: npc.data.dialog.accept_quest?.questTitle,
                    questDesc: npc.data.dialog.accept_quest?.questDesc,
                    options: [{ label: "npc.common.you_are_welcome", next: "end" }]
                  }
                }
              }
            };
            setActiveNPC(modifiedNpc);
            setDialogNode('start');
            return;
          }
        }
        setDialogNode('start');
      }`;

file = file.replace(npcInteractionTarget, npcInteractionReplacement);

const dialogOptionTarget = `      } else if (nextNode?.action === 'finish_quest') {`;

const dialogOptionReplacement = `      } else if (nextNode?.action === 'fast_complete_quest') {
        const questId = \`quest_\${npcTarget?.id}\`;
        
        await QuestLogEngine.addQuest({
          id: questId,
          npcId: npcTarget?.id || 'unknown',
          titleKey: nextNode?.questTitle || \`quest_title_\${npcTarget?.id}\`,
          descKey: nextNode?.questDesc || \`quest_desc_\${npcTarget?.id}\`,
          requirement: nextNode?.questRequirement,
          rewardXP: nextNode?.xpReward || 50,
          rewardItem: nextNode?.rewardItem
        });

        const req = nextNode?.questRequirement;
        if (req) {
          await InventoryEngine.removeItem(req.itemId, req.amount);
          await QuestLogEngine.addProgress(questId, req.amount);
        }

        const itemRewardId = nextNode?.rewardItem || 'copper_coins';
        const xpGained = nextNode?.xpReward || 50;
        await InventoryEngine.addItem({ id: itemRewardId, name: itemRewardId, type: 'quest_reward' }, 1);
        await QuestLogEngine.completeQuest(questId);
        handleGainXP(xpGained, 'quest');
        
        const translatedRewardName = i18n.t(\`items.\${itemRewardId}\`, { defaultValue: itemRewardId });
        setChestLootResult({
          amount: 1,
          name: translatedRewardName,
          icon: 'star',
          color: '#FFD700'
        });
      } else if (nextNode?.action === 'finish_quest') {`;

file = file.replace(dialogOptionTarget, dialogOptionReplacement);

fs.writeFileSync('src/screens/MapScreen.js', file);
console.log("Patched MapScreen.js successfully!");
