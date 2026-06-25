const fs = require('fs');
const file = 'src/screens/MapScreen.js';
let content = fs.readFileSync(file, 'utf8');

const actionLogic = `if (option.action === 'open_donation_modal') {`;
const newActionLogic = `if (option.action === 'rob_player') {
      const inv = await InventoryEngine.getInventory();
      // Filter out quest items so they can't be stolen
      const stealable = inv.filter(i => i.amount > 0 && i.type !== 'quest_item');
      
      if (stealable.length === 0) {
        setDialogNode('robbed_empty');
        await NodeStateEngine.completeQuest(npcTarget.id);
        setQuests(prev => prev.filter(q => q.id !== npcTarget.id));
        return;
      }
      
      const randomItem = stealable[Math.floor(Math.random() * stealable.length)];
      await InventoryEngine.removeItem(randomItem.id, 1);
      
      Alert.alert('Ausgeraubt!', \`Der Dieb hat dir 1x \${i18n.t('items.' + randomItem.id, {defaultValue: randomItem.id})} gestohlen!\`);
      
      setDialogNode('robbed_success');
      
      // Remove thief from map completely
      await NodeStateEngine.completeQuest(npcTarget.id);
      setQuests(prev => prev.filter(q => q.id !== npcTarget.id));
      
      return;
    }
    
    if (option.action === 'open_donation_modal') {`;

if (!content.includes("option.action === 'rob_player'")) {
  content = content.replace(actionLogic, newActionLogic);
}

fs.writeFileSync(file, content, 'utf8');
console.log("Patched MapScreen.js rob_player logic!");
