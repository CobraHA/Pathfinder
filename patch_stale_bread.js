const fs = require('fs');

// Patch SurvivalEngine.ts
let se = fs.readFileSync('src/services/SurvivalEngine.ts', 'utf8');
if (!se.includes("'stale_bread':")) {
  se = se.replace(
    "'bread': { hunger: 50, thirst: -5, msg: \"survival.eat_bread\" },",
    "'bread': { hunger: 50, thirst: -5, msg: \"survival.eat_bread\" },\n    'stale_bread': { hunger: 30, thirst: -10, msg: \"survival.eat_stale_bread\", sideEffect: \"Trocken und zäh\" },\n    'canned_food': { hunger: 50, thirst: 10, msg: \"survival.eat_canned_food\" },"
  );
  fs.writeFileSync('src/services/SurvivalEngine.ts', se);
}

// Patch i18n
const de = JSON.parse(fs.readFileSync('src/i18n/de.json', 'utf8'));
de.items = de.items || {};
de.items.stale_bread = "Altes Brot";
de.items.canned_food = "Dosenfutter";
de.items.cloth_scrap = "Stoffreste";
de.items.old_currency = "Alte Währung";

de.survival = de.survival || {};
de.survival.eat_stale_bread = "Du isst das alte Brot. Es ist sehr trocken.";
de.survival.eat_canned_food = "Du isst das Dosenfutter. Schmeckt überraschend gut!";
fs.writeFileSync('src/i18n/de.json', JSON.stringify(de, null, 2));

const en = JSON.parse(fs.readFileSync('src/i18n/en.json', 'utf8'));
en.items = en.items || {};
en.items.stale_bread = "Stale Bread";
en.items.canned_food = "Canned Food";
en.items.cloth_scrap = "Cloth Scrap";
en.items.old_currency = "Old Currency";

en.survival = en.survival || {};
en.survival.eat_stale_bread = "You eat the stale bread. It's very dry.";
en.survival.eat_canned_food = "You eat the canned food. Tastes surprisingly good!";
fs.writeFileSync('src/i18n/en.json', JSON.stringify(en, null, 2));

