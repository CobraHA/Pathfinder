const fs = require('fs');
const file = 'src/services/QuestLogEngine.ts';
let content = fs.readFileSync(file, 'utf8');

const regex = /if \(\(q\.titleKey && q\.titleKey\.startsWith\('quest_title_'\)\) \|\| \(q\.descKey && q\.descKey\.startsWith\('quest_desc_'\)\)\) \{/g;
const replacement = `// Force migration for generic/mock keys
          if (q.titleKey && (q.titleKey.includes('.generic.') || q.titleKey.includes('.mock1.') || q.titleKey.includes('.mock2.') || q.titleKey.includes('.mock3.'))) {
            q.titleKey = 'quest_title_broken';
          }
          if ((q.titleKey && q.titleKey.startsWith('quest_title_')) || (q.descKey && q.descKey.startsWith('quest_desc_')) || q.titleKey === 'quest.title.generic') {`;

content = content.replace(regex, replacement);

const regex2 = /if \(q\.requirement\?\.amount === 10\) \{\s+q\.titleKey = 'npc\.trader\.quest_title'; q\.descKey = 'npc\.trader\.quest_desc';\s+\} else \{\s+q\.titleKey = 'npc\.informant\.quest_title'; q\.descKey = 'npc\.informant\.quest_desc';\s+\}/g;
const replacement2 = `if (q.requirement?.amount === 30) {
                q.titleKey = 'npc.merchant.quest_title'; q.descKey = 'npc.merchant.quest_desc';
              } else if (q.requirement?.amount === 50) {
                q.titleKey = 'npc.mayor.quest_title'; q.descKey = 'npc.mayor.quest_desc';
              } else if (q.requirement?.amount === 10) {
                q.titleKey = 'npc.trader.quest_title'; q.descKey = 'npc.trader.quest_desc';
              } else {
                q.titleKey = 'npc.informant.quest_title'; q.descKey = 'npc.informant.quest_desc';
              }`;

content = content.replace(regex2, replacement2);

fs.writeFileSync(file, content, 'utf8');
console.log("Patched QuestLogEngine.ts migration logic");
