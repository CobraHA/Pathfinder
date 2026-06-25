const fs = require('fs');

// Patch i18n DE
const de = JSON.parse(fs.readFileSync('src/i18n/de.json', 'utf8'));
de.items = de.items || {};
Object.assign(de.items, {
  medicine: "Medizin",
  coffee_beans: "Kaffeebohnen",
  burger: "Burger",
  canned_beans: "Dosensuppe",
  flower: "Blume",
  gold_coin: "Goldmünze",
  beer: "Bier",
  book: "Altes Buch",
  fabric: "Stoff",
  gasoline: "Benzin"
});
de.survival = de.survival || {};
Object.assign(de.survival, {
  eat_medicine: "Du nimmst die Medizin. Du fühlst dich etwas besser.",
  eat_burger: "Du isst den Burger. Sehr sättigend!",
  eat_canned_beans: "Du isst die Dosensuppe. Schmeckt wie bei Muttern.",
  eat_beer: "Du trinkst das Bier. Prost!"
});
fs.writeFileSync('src/i18n/de.json', JSON.stringify(de, null, 2));

// Patch i18n EN
const en = JSON.parse(fs.readFileSync('src/i18n/en.json', 'utf8'));
en.items = en.items || {};
Object.assign(en.items, {
  medicine: "Medicine",
  coffee_beans: "Coffee Beans",
  burger: "Burger",
  canned_beans: "Canned Soup",
  flower: "Flower",
  gold_coin: "Gold Coin",
  beer: "Beer",
  book: "Old Book",
  fabric: "Fabric",
  gasoline: "Gasoline"
});
en.survival = en.survival || {};
Object.assign(en.survival, {
  eat_medicine: "You take the medicine. You feel a bit better.",
  eat_burger: "You eat the burger. Very filling!",
  eat_canned_beans: "You eat the canned soup. Tastes like home.",
  eat_beer: "You drink the beer. Cheers!"
});
fs.writeFileSync('src/i18n/en.json', JSON.stringify(en, null, 2));

// Patch SurvivalEngine.ts
let se = fs.readFileSync('src/services/SurvivalEngine.ts', 'utf8');
if (!se.includes("'burger':")) {
  se = se.replace(
    "'canned_food': { hunger: 50, thirst: 10, msg: \"survival.eat_canned_food\" },",
    "'canned_food': { hunger: 50, thirst: 10, msg: \"survival.eat_canned_food\" },\n    'burger': { hunger: 60, thirst: -15, msg: \"survival.eat_burger\" },\n    'canned_beans': { hunger: 40, thirst: 5, msg: \"survival.eat_canned_beans\" },\n    'beer': { hunger: 10, thirst: 20, msg: \"survival.eat_beer\", sideEffect: \"Macht dich schwindelig\" },\n    'medicine': { hunger: 0, thirst: 0, msg: \"survival.eat_medicine\" },"
  );
  fs.writeFileSync('src/services/SurvivalEngine.ts', se);
}

console.log("Updated translations and SurvivalEngine");
