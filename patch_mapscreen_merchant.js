const fs = require('fs');
const file = 'src/screens/MapScreen.js';
let content = fs.readFileSync(file, 'utf8');

const oldLogic = `    if (option.action === 'open_donation_modal') {`;

const newLogic = `    if (option.action === 'open_merchant_shop') {
      setActiveNPC(null);
      navigation.navigate('Shop', { isMerchant: true, merchantId: npcTarget.id });
      return;
    }
    
    if (option.action === 'open_donation_modal') {`;

content = content.replace(oldLogic, newLogic);
fs.writeFileSync(file, content, 'utf8');
console.log("Patched MapScreen.js for open_merchant_shop!");
