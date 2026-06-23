const fs = require('fs');

const de = JSON.parse(fs.readFileSync('src/i18n/de.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('src/i18n/en.json', 'utf8'));

// DE
de.items = de.items || {};
de.items.coffee = "Kaffee";
de.items.strong_coffee = "Extra Starker Kaffee";

de.survival = de.survival || {};
de.survival.drink_coffee = "Du trinkst einen Kaffee. Das belebt!";
de.survival.drink_strong_coffee = "Du trinkst den extra starken Kaffee. Du fühlst dich wie neu geboren!";

// EN
en.items = en.items || {};
en.items.coffee = "Coffee";
en.items.strong_coffee = "Extra Strong Coffee";

en.survival = en.survival || {};
en.survival.drink_coffee = "You drink a coffee. It revitalizes!";
en.survival.drink_strong_coffee = "You drink the extra strong coffee. You feel reborn!";

fs.writeFileSync('src/i18n/de.json', JSON.stringify(de, null, 2));
fs.writeFileSync('src/i18n/en.json', JSON.stringify(en, null, 2));
