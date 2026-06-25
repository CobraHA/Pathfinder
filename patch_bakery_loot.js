const fs = require('fs');

// Patch SurvivalEngine.ts
let se = fs.readFileSync('src/services/SurvivalEngine.ts', 'utf8');
if (!se.includes("'moldy_bread':")) {
  se = se.replace(
    "'stale_bread': { hunger: 30, thirst: -10, msg: \"survival.eat_stale_bread\", sideEffect: \"Trocken und zäh\" },",
    "'stale_bread': { hunger: 30, thirst: -10, msg: \"survival.eat_stale_bread\", sideEffect: \"Trocken und zäh\" },\n    'moldy_bread': { hunger: 10, thirst: -10, msg: \"survival.eat_moldy_bread\", sideEffect: \"50% Risiko für Vergiftung\" },"
  );
  fs.writeFileSync('src/services/SurvivalEngine.ts', se);
}

// Patch i18n DE
const de = JSON.parse(fs.readFileSync('src/i18n/de.json', 'utf8'));
de.items = de.items || {};
de.items.moldy_bread = "Verschimmeltes Brot";

de.survival = de.survival || {};
de.survival.eat_moldy_bread = "Uargh... Das Brot war komplett verschimmelt.";
fs.writeFileSync('src/i18n/de.json', JSON.stringify(de, null, 2));

// Patch i18n EN
const en = JSON.parse(fs.readFileSync('src/i18n/en.json', 'utf8'));
en.items = en.items || {};
en.items.moldy_bread = "Moldy Bread";

en.survival = en.survival || {};
en.survival.eat_moldy_bread = "Ugh... The bread was completely moldy.";
fs.writeFileSync('src/i18n/en.json', JSON.stringify(en, null, 2));

