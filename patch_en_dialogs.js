const fs = require('fs');
const en = JSON.parse(fs.readFileSync('src/i18n/en.json', 'utf8'));

en.map.dialogs.garrosh = {
  "start": "Ah, a traveler! My fire is almost out and I am running low on iron.",
  "ask_trade": "Bring me iron ore from the mines.",
  "accept_quest": "Return when you have the ore."
};

en.map.dialogs.alkuin = {
  "start": "The pestilence is spreading, we urgently need herbs.",
  "ask_trade": "Find healing roots in the woods.",
  "accept_quest": "May blessings be with you.",
  "check_quest_progress": "Ah, my friend! Have you gathered the mushrooms for me?",
  "complete_quest": "Wonderful! These mushrooms will greatly assist my studies. Take these coins as thanks.",
  "quest_already_completed": "Thank you again for your help with the mushrooms. My research is making good progress!"
};

en.map.dialogs.leif = {
  "start": "Lately, bandits have been roaming outside the gates.",
  "ask_trade": "The captain pays gold for the leader's amulet.",
  "accept_quest": "Watch your back.",
  "check_quest_progress": "Halt! Do you have the wood we need for the barricade?",
  "complete_quest": "Excellent. With this we can make the road a bit safer. Here is your reward.",
  "quest_already_completed": "The barricade holds. Thanks again for the wood!"
};

en.map.dialogs.beggar = {
  "start": "Do you have any bread or salt for me?",
  "ask_trade": "I am almost starving.",
  "accept_quest": "Thank you for your kindness."
};

en.map.dialogs.common = {
  "tell_more": "Tell me more.",
  "no_time": "No time.",
  "help_quest": "I will help you. (Quest)",
  "no_thanks": "No thanks.",
  "see_you": "See you soon.",
  "give_items": "Here, I have everything (Give)",
  "not_yet": "Not quite yet... (Leave)",
  "you_are_welcome": "You're welcome!",
  "quest_completed": "I have already done what I could.",
  "partial_turn_in": "Thanks for %{amount}x %{item}, but I still need %{remaining}!"
};

fs.writeFileSync('src/i18n/en.json', JSON.stringify(en, null, 2));
