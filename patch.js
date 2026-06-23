const fs = require('fs');
let code = fs.readFileSync('src/services/QuestEngine.ts', 'utf8');

const functionToAdd = `
  static injectDefaultGathers(q: any) {
    if (q.type === 'resource' && q.data?.resource) {
      if (typeof q.data.resource.maxGathers === 'undefined') {
        switch (q.data.resource.itemId) {
          case 'wood_log': q.data.resource.maxGathers = 5; break;
          case 'berries': q.data.resource.maxGathers = 4; break;
          case 'mushrooms': q.data.resource.maxGathers = 3; break;
          case 'iron_ore': q.data.resource.maxGathers = 4; break;
          case 'clean_water': q.data.resource.maxGathers = 10; break;
          case 'salt': q.data.resource.maxGathers = 5; break;
          case 'herb_root': q.data.resource.maxGathers = 2; break;
          default: q.data.resource.maxGathers = 3; break;
        }
      }
    }

    if (q.type === 'npc' && (!q.data || !q.data.dialog)) {
      if (!q.data) q.data = {};
      
      const charCode = q.id ? String(q.id).charCodeAt(String(q.id).length - 1) : 0;
      const scriptNames = ['garrosh', 'alkuin', 'leif'];
      const chosenScript = scriptNames[charCode % scriptNames.length];
      
      if (chosenScript === 'garrosh') {
        q.title = 'Schmied Garrosh';
        q.data.name = q.title;
        q.data.dialog = {
          start: { text: 'map.dialogs.garrosh.start', options: [{ label: 'map.dialogs.common.tell_more', next: 'ask_trade' }, { label: 'map.dialogs.common.no_time', next: 'end' }] },
          ask_trade: { text: 'map.dialogs.garrosh.ask_trade', options: [{ label: 'map.dialogs.common.help_quest', next: 'accept_quest' }, { label: 'map.dialogs.common.no_thanks', next: 'end' }] },
          accept_quest: { text: 'map.dialogs.garrosh.accept_quest', action: 'trade_iron', options: [{ label: 'map.dialogs.common.see_you', next: 'end' }] }
        };
      } else if (chosenScript === 'alkuin') {
        q.title = 'Mönch Alkuin';
        q.data.name = q.title;
        q.data.dialog = {
          start: { text: 'map.dialogs.alkuin.start', options: [{ label: 'map.dialogs.common.tell_more', next: 'ask_trade' }, { label: 'map.dialogs.common.no_time', next: 'end' }] },
          ask_trade: { text: 'map.dialogs.alkuin.ask_trade', options: [{ label: 'map.dialogs.common.help_quest', next: 'accept_quest' }, { label: 'map.dialogs.common.no_thanks', next: 'end' }] },
          accept_quest: { text: 'map.dialogs.alkuin.accept_quest', action: 'give_quest', questRequirement: { itemId: 'mushrooms', amount: 3, maxGathers: 3 }, options: [{ label: 'map.dialogs.common.see_you', next: 'end' }] },
          check_quest_progress: { text: 'map.dialogs.alkuin.check_quest_progress', options: [{ label: 'map.dialogs.common.give_items', next: 'complete_quest' }, { label: 'map.dialogs.common.not_yet', next: 'end' }] },
          complete_quest: { text: 'map.dialogs.alkuin.complete_quest', action: 'finish_quest', options: [{ label: 'map.dialogs.common.you_are_welcome', next: 'end' }] },
          quest_already_completed: { text: 'map.dialogs.alkuin.quest_already_completed', options: [{ label: 'map.dialogs.common.see_you', next: 'end' }] }
        };
      } else {
        q.title = 'Wache Leif';
        q.data.name = q.title;
        q.data.dialog = {
          start: { text: 'map.dialogs.leif.start', options: [{ label: 'map.dialogs.common.tell_more', next: 'ask_trade' }, { label: 'map.dialogs.common.no_time', next: 'end' }] },
          ask_trade: { text: 'map.dialogs.leif.ask_trade', options: [{ label: 'map.dialogs.common.help_quest', next: 'accept_quest' }, { label: 'map.dialogs.common.no_thanks', next: 'end' }] },
          accept_quest: { text: 'map.dialogs.leif.accept_quest', action: 'give_quest', questRequirement: { itemId: 'wood_log', amount: 5, maxGathers: 3 }, options: [{ label: 'map.dialogs.common.see_you', next: 'end' }] },
          check_quest_progress: { text: 'map.dialogs.leif.check_quest_progress', options: [{ label: 'map.dialogs.common.give_items', next: 'complete_quest' }, { label: 'map.dialogs.common.not_yet', next: 'end' }] },
          complete_quest: { text: 'map.dialogs.leif.complete_quest', action: 'finish_quest', options: [{ label: 'map.dialogs.common.you_are_welcome', next: 'end' }] },
          quest_already_completed: { text: 'map.dialogs.leif.quest_already_completed', options: [{ label: 'map.dialogs.common.see_you', next: 'end' }] }
        };
      }
    }
    return q;
  }
`;

const insertIndex = code.indexOf('static async checkNearbyQuests');
if (insertIndex !== -1) {
  code = code.substring(0, insertIndex) + functionToAdd + '\n\n  ' + code.substring(insertIndex);
  fs.writeFileSync('src/services/QuestEngine.ts', code);
  console.log('Successfully re-added injectDefaultGathers');
} else {
  console.log('Could not find checkNearbyQuests');
}
