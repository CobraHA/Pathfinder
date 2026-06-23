const fs = require('fs');

let qe = fs.readFileSync('src/services/QuestEngine.ts', 'utf8');

// We need to inject a fix right after injectedQ is processed in the Supabase fetch block
// It is around line 9764: const injectedQ = this.injectDefaultGathers(q);

const fixLogic = `
        // Force-rewrite any cached generic dialog options to specific ones
        if (injectedQ.type === 'npc' && injectedQ.data?.dialog?.start?.text) {
          const startText = injectedQ.data.dialog.start.text;
          const baseKeyMatch = startText.match(/^(map\\.dialogs\\.[^.]+)/);
          if (baseKeyMatch) {
            const baseKey = baseKeyMatch[1];
            
            // Fix options array if they exist
            const fixOptions = (options) => {
              if (!options) return;
              options.forEach(opt => {
                if (opt.label === 'map.dialogs.common.tell_more' || opt.label === 'Erzähl mir mehr.') opt.label = \`\${baseKey}.opt_tell_more\`;
                if (opt.label === 'map.dialogs.common.no_time' || opt.label === 'Keine Zeit.') opt.label = \`\${baseKey}.opt_no_time\`;
                if (opt.label === 'map.dialogs.common.help_quest' || opt.label === 'Ich helfe dir. (Quest)') opt.label = \`\${baseKey}.opt_help\`;
                if (opt.label === 'map.dialogs.common.no_thanks' || opt.label === 'Nein danke.') opt.label = \`\${baseKey}.opt_no_thanks\`;
                if (opt.label === 'map.dialogs.common.see_you' || opt.label === 'Bis bald.') opt.label = \`\${baseKey}.opt_farewell\`;
              });
            };

            if (injectedQ.data.dialog.start) fixOptions(injectedQ.data.dialog.start.options);
            if (injectedQ.data.dialog.ask_trade) fixOptions(injectedQ.data.dialog.ask_trade.options);
            if (injectedQ.data.dialog.accept_quest) fixOptions(injectedQ.data.dialog.accept_quest.options);
          }
        }
`;

// Find where to inject it
// We will replace the existing backward compatibility block with this more comprehensive one
const startToken = "// Backward compatibility fix for cached NPCs";
const endToken = "// Backward compatibility for NPC names saved as \\"Unbekannter Ort\\"";

const regex = new RegExp(startToken.replace(/\\./g, '\\\\.') + "[\\\\s\\\\S]*?" + endToken.replace(/\\./g, '\\\\.'));

qe = qe.replace(regex, startToken + "\\n" + fixLogic + "\\n        " + endToken);

fs.writeFileSync('src/services/QuestEngine.ts', qe);
