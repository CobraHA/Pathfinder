const fs = require('fs');

function patchLang(path, brokenShirt, brokenPants, shirt, pants) {
    let content = JSON.parse(fs.readFileSync(path, 'utf8'));
    content.item = content.item || {};
    content.item.broken_shirt = brokenShirt;
    content.item.broken_pants = brokenPants;
    content.item.shirt = shirt;
    content.item.pants = pants;
    fs.writeFileSync(path, JSON.stringify(content, null, 2), 'utf8');
}

patchLang('src/i18n/de.json', 'Kaputtes T-Shirt', 'Kaputte Hose', 'Intaktes T-Shirt', 'Intakte Hose');
patchLang('src/i18n/en.json', 'Torn T-Shirt', 'Torn Pants', 'Intact T-Shirt', 'Intact Pants');

console.log("Patched i18n files");
