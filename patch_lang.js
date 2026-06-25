const fs = require('fs');

function addLang(file, key, val) {
  let content = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!content.npc) content.npc = {};
  if (!content.npc.common) content.npc.common = {};
  content.npc.common[key] = val;
  fs.writeFileSync(file, JSON.stringify(content, null, 2));
}

addLang('src/i18n/de.json', 'already_have_items', "Ich habe bereits dabei, was du suchst!");
addLang('src/i18n/en.json', 'already_have_items', "I already have what you are looking for!");
console.log("Language updated");
