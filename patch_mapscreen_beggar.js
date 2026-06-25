const fs = require('fs');
const file = 'src/screens/MapScreen.js';
let content = fs.readFileSync(file, 'utf8');

// 1. Import DonationModal
if (!content.includes('import DonationModal')) {
  content = content.replace(/import \{ \w.*\} from 'react-native';/, "$&\nimport DonationModal from '../components/DonationModal';");
}

// 2. Add state for showDonationModal
if (!content.includes('const [showDonationModal, setShowDonationModal]')) {
  content = content.replace(/const \[dialogNode, setDialogNode\] = useState\('start'\);/, "const [dialogNode, setDialogNode] = useState('start');\n  const [showDonationModal, setShowDonationModal] = useState(false);");
}

// 3. Handle open_donation_modal action in handleDialogOption
const actionLogic = `if (option.action === 'trade_bread') {`;
const newActionLogic = `if (option.action === 'open_donation_modal') {
      setShowDonationModal(true);
      return;
    }

    if (option.action === 'trade_bread') {`;
if (!content.includes('open_donation_modal')) {
  content = content.replace(actionLogic, newActionLogic);
}

// 4. Render DonationModal
const renderModal = `
      <DonationModal 
        visible={showDonationModal} 
        onClose={() => setShowDonationModal(false)} 
        onDonate={() => {
          setShowDonationModal(false);
          setActiveNPC(null);
        }} 
      />
`;
if (!content.includes('<DonationModal')) {
  content = content.replace(/\{renderDialog\(\)\}/, "{renderDialog()}\n" + renderModal);
}

fs.writeFileSync(file, content, 'utf8');
console.log("Patched MapScreen.js for DonationModal!");
