const fs = require('fs');
const file = 'src/i18n/de.json';
let data = JSON.parse(fs.readFileSync(file, 'utf8'));

if (!data.items.wheat) {
  data.items.wheat = "Weizen";
  data.items.bread = "Brot";
  data.crafting.new_recipe_title = "Neues Rezept!";
  data.crafting.new_recipe_desc = "Du hast gelernt, wie man Brot herstellt!";
}

fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
console.log("Patched de.json");
