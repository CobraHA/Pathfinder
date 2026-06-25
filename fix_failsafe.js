const fs = require('fs');
const file = 'src/screens/MapScreen.js';
let content = fs.readFileSync(file, 'utf8');

const regex = /questRequirement: \{ itemId: "wood_log", amount: 3, maxGathers: 5 \}/g;

const replacement = `questRequirement: (() => {
                const base = npc.data.baseKey || "common";
                if (base === 'miner') return { itemId: 'iron_ore', amount: 5 };
                if (base === 'farmer') return { itemId: 'clean_water', amount: 5 };
                if (base === 'cook') return { itemId: 'mushrooms', amount: 4 };
                if (base === 'hunter') return { itemId: 'bandit_amulet', amount: 1 };
                if (base === 'scout') return { itemId: 'bread', amount: 2 };
                if (base === 'mayor') return { itemId: 'copper_coins', amount: 50 };
                if (base === 'priest') return { itemId: 'bandit_amulet', amount: 3 };
                if (base === 'alchemist') return { itemId: 'mushrooms', amount: 10 };
                if (base === 'carpenter') return { itemId: 'wood_log', amount: 15 };
                if (base === 'mason') return { itemId: 'iron_ore', amount: 10 };
                if (base === 'merchant') return { itemId: 'copper_coins', amount: 30 };
                if (base === 'tailor') return { itemId: 'mushrooms', amount: 5 };
                if (base === 'bard') return { itemId: 'clean_water', amount: 3 };
                if (base === 'trader') return { itemId: 'copper_coins', amount: 20 };
                if (base === 'informant') return { itemId: 'copper_coins', amount: 15 };
                if (base === 'barista') return { itemId: 'clean_water', amount: 5 };
                if (base === 'guard_captain') return { itemId: 'sword', amount: 1 };
                if (base === 'beggar') return { itemId: 'bread', amount: 1 };
                return { itemId: 'wood_log', amount: 3 };
              })()`;

content = content.replace(regex, replacement);

fs.writeFileSync(file, content, 'utf8');
console.log("Patched MapScreen.js failsafe to use dynamic item requirements!");
