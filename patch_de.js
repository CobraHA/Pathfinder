const fs = require('fs');
const de = JSON.parse(fs.readFileSync('src/i18n/de.json', 'utf8'));

de.map.dialogs.barista = {
  "start": "Willkommen im Café! Brauchst du etwas Koffein?",
  "ask_trade": "Ich tausche Wasser gegen Kaffee.",
  "accept_quest": "Vielen Dank!"
};
de.map.dialogs.trader = {
  "start": "Brauchst du Vorräte? Ich habe alles, was du brauchst.",
  "ask_trade": "Zeig mir deine Waren.",
  "accept_quest": "Gute Wahl."
};
de.map.dialogs.informant = {
  "start": "Psst! Ich weiß Dinge... für den richtigen Preis.",
  "ask_trade": "Gib mir Münzen, dann rede ich.",
  "accept_quest": "Hör gut zu..."
};

de.map.markers.survivor_barista = "Überlebender Barista";
de.map.markers.trader_bot = "Händler-Bot";
de.map.markers.drunk_informant = "Betrunkener Informant";

de.map.quests = {
  "monument_history": "Historisches Relikt",
  "monument_history_desc": "Untersuche das antike Monument.",
  "rest_stop": "Rastplatz",
  "rest_stop_desc": "Ruhe dich kurz aus und durchsuche die Gegend.",
  "hospital_run": "Medizinische Vorräte",
  "hospital_run_desc": "Beschaffe dringend benötigte Medikamente aus dem Krankenhaus.",
  "lost_knowledge": "Verlorenes Wissen",
  "lost_knowledge_desc": "Berge alte Aufzeichnungen aus der Bibliothek."
};

fs.writeFileSync('src/i18n/de.json', JSON.stringify(de, null, 2));

const en = JSON.parse(fs.readFileSync('src/i18n/en.json', 'utf8'));

en.map.dialogs.barista = {
  "start": "Welcome to the cafe! Need some caffeine?",
  "ask_trade": "I'll trade water for coffee.",
  "accept_quest": "Thank you!"
};
en.map.dialogs.trader = {
  "start": "Need supplies? I have everything you need.",
  "ask_trade": "Show me your wares.",
  "accept_quest": "Good choice."
};
en.map.dialogs.informant = {
  "start": "Psst! I know things... for the right price.",
  "ask_trade": "Give me coins and I'll talk.",
  "accept_quest": "Listen closely..."
};

en.map.markers.survivor_barista = "Survivor Barista";
en.map.markers.trader_bot = "Trader Bot";
en.map.markers.drunk_informant = "Drunk Informant";

en.map.quests = {
  "monument_history": "Historical Relic",
  "monument_history_desc": "Investigate the ancient monument.",
  "rest_stop": "Rest Stop",
  "rest_stop_desc": "Rest for a moment and search the area.",
  "hospital_run": "Medical Supplies",
  "hospital_run_desc": "Procure urgently needed medicine from the hospital.",
  "lost_knowledge": "Lost Knowledge",
  "lost_knowledge_desc": "Recover ancient records from the library."
};

fs.writeFileSync('src/i18n/en.json', JSON.stringify(en, null, 2));
