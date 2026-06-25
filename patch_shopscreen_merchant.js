const fs = require('fs');
const file = 'src/screens/ShopScreen.js';
let content = fs.readFileSync(file, 'utf8');

const regexLoad = /const items = await ShopEngine\.getShopInventory\(\);/;
const replaceLoad = `const isMerchant = route.params?.isMerchant;
    const merchantId = route.params?.merchantId;
    const items = merchantId ? await ShopEngine.getMerchantInventory(merchantId) : await ShopEngine.getShopInventory();`;
content = content.replace(regexLoad, replaceLoad);

const regexBuy = /const success = await ShopEngine\.buyItem\(item\.id\);/;
const replaceBuy = `const merchantId = route.params?.merchantId;
    const success = await ShopEngine.buyItem(item.id, merchantId);`;
content = content.replace(regexBuy, replaceBuy);

const regexTitle = /\{i18n\.t\('map\.markers\.shop', \{ defaultValue: 'Laden' \}\)\}/;
const replaceTitle = `{route.params?.isMerchant ? 'Fahrender Händler' : i18n.t('map.markers.shop', { defaultValue: 'Laden' })}`;
content = content.replace(regexTitle, replaceTitle);

fs.writeFileSync(file, content, 'utf8');
console.log("Patched ShopScreen.js for merchants");
