const fs = require('fs');

const de = JSON.parse(fs.readFileSync('src/i18n/de.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('src/i18n/en.json', 'utf8'));

const updatesDe = {
  garrosh: {
    check_quest_progress: "Hast du das Eisenerz aus den Minen besorgt?",
    complete_quest: "Hervorragend! Mit diesem Erz brennt meine Esse wieder heiß. Nimm diese Waffe als Zeichen meines Danks.",
    quest_already_completed: "Danke nochmals für das Eisenerz. Meine Schmiede läuft auf Hochtouren!"
  },
  leif: {
    check_quest_progress: "Halt! Hast du das Holz dabei, das wir für die Barrikade brauchen?",
    complete_quest: "Exzellent. Damit können wir den Weg etwas sicherer machen. Hier ist deine Belohnung.",
    quest_already_completed: "Die Barrikade hält. Danke nochmals für das Holz!"
  },
  beggar: {
    check_quest_progress: "Bitte... hast du etwas zu essen für mich gefunden?",
    complete_quest: "Oh, danke! Du hast mir das Leben gerettet. Ich habe zwar nicht viel, aber nimm dies.",
    quest_already_completed: "Ich werde deine Güte nie vergessen."
  },
  barista: {
    check_quest_progress: "Und, hast du das frische Wasser für mich aufgetrieben?",
    complete_quest: "Perfekt! Hier ist der extra starke Kaffee, den ich dir versprochen habe.",
    quest_already_completed: "Der Kaffee läuft! Wenn ich wieder Bohnen habe, sag ich Bescheid."
  },
  trader: {
    check_quest_progress: "Hast du die Münzen für unser Geschäft zusammen?",
    complete_quest: "Ein Vergnügen, Geschäfte mit dir zu machen. Hier sind deine Vorräte.",
    quest_already_completed: "Wenn ich neue Waren habe, bist du der Erste, der es erfährt."
  },
  informant: {
    check_quest_progress: "Hast du die Bezahlung für meine Geheimnisse?",
    complete_quest: "Gut... hier sind die Koordinaten. Aber psst, verrate niemandem, woher du sie hast.",
    quest_already_completed: "Du hast alle meine Tipps bereits erhalten."
  }
};

const updatesEn = {
  garrosh: {
    check_quest_progress: "Did you get the iron ore from the mines?",
    complete_quest: "Excellent! With this ore my forge burns hot again. Take this weapon as a token of my gratitude.",
    quest_already_completed: "Thanks again for the iron ore. My forge is running at full capacity!"
  },
  leif: {
    check_quest_progress: "Halt! Do you have the wood we need for the barricade?",
    complete_quest: "Excellent. With this we can make the road a bit safer. Here is your reward.",
    quest_already_completed: "The barricade holds. Thanks again for the wood!"
  },
  beggar: {
    check_quest_progress: "Please... did you find something to eat for me?",
    complete_quest: "Oh, thank you! You saved my life. I don't have much, but take this.",
    quest_already_completed: "I will never forget your kindness."
  },
  barista: {
    check_quest_progress: "So, did you find the fresh water for me?",
    complete_quest: "Perfect! Here is the extra strong coffee I promised you.",
    quest_already_completed: "The coffee is brewing! I'll let you know when I have more beans."
  },
  trader: {
    check_quest_progress: "Do you have the coins for our deal?",
    complete_quest: "A pleasure doing business with you. Here are your supplies.",
    quest_already_completed: "When I get new goods, you'll be the first to know."
  },
  informant: {
    check_quest_progress: "Do you have the payment for my secrets?",
    complete_quest: "Good... here are the coordinates. But shush, don't tell anyone where you got them.",
    quest_already_completed: "You already received all my tips."
  }
};

for (const npc in updatesDe) {
  if (de.map.dialogs[npc]) {
    Object.assign(de.map.dialogs[npc], updatesDe[npc]);
  }
}

for (const npc in updatesEn) {
  if (en.map.dialogs[npc]) {
    Object.assign(en.map.dialogs[npc], updatesEn[npc]);
  }
}

fs.writeFileSync('src/i18n/de.json', JSON.stringify(de, null, 2));
fs.writeFileSync('src/i18n/en.json', JSON.stringify(en, null, 2));
