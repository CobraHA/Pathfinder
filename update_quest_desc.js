const fs = require('fs');
const file = 'src/i18n/de.json';
let data = JSON.parse(fs.readFileSync(file, 'utf8'));

const descriptions = {
  miner: "Der Minenarbeiter benötigt dringend Nachschub, um sicher in den tiefen Stollen weiterarbeiten zu können.",
  farmer: "Die Felder müssen bestellt werden. Der Bauer bittet um Ressourcen für die anstehende Ernte.",
  cook: "Der Koch bereitet eine kräftigende Mahlzeit für das Lager vor und benötigt frische Zutaten aus der Wildnis.",
  hunter: "Der Jäger bereitet sich auf eine gefährliche Pirsch vor und braucht Proviant und Ausrüstung.",
  scout: "Der Späher plant eine lange Erkundungsmission und benötigt dafür deine Unterstützung.",
  mayor: "Der Bürgermeister sammelt wichtige Ressourcen, um den Ausbau und die Sicherheit der Stadt zu gewährleisten.",
  priest: "Für das nächste große Reinigungsritual benötigt der Priester entsprechende Opfergaben und Vorräte.",
  alchemist: "Die Kessel brodeln! Der Alchemist braucht dringend weitere seltene Substanzen für seine Experimente.",
  carpenter: "Der Zimmermann braucht dringend Baumaterial, um die stark beschädigten Palisaden zu flicken.",
  mason: "Der Steinmetz verstärkt das Fundament der Stadtmauer und bittet um Werkzeuge und Rohstoffe.",
  merchant: "Das örtliche Warenhaus ist fast leer. Der Kaufmann ist auf der Suche nach neuen, wertvollen Gütern.",
  tailor: "Der Schneider näht warme Kleidung und Rüstungspolster und ist auf ständigen Nachschub angewiesen.",
  bard: "Der Barde bereitet seinen großen Auftritt vor und benötigt etwas, um seine Stimme und Laune zu heben.",
  guard_captain: "Der Wachhauptmann rüstet seine Männer für den nächsten Banditenangriff aus und braucht dringend Unterstützung.",
  informant: "Der Informant verlangt seinen Tribut in Form von Wertgegenständen, bevor er seine Geheimnisse preisgibt.",
  trader: "Der reisende Händler ist stets auf der Suche nach lukrativen Tauschgeschäften.",
  barista: "Die Kaffeebohnen sind geröstet, doch dem Barista fehlen noch die grundlegenden Dinge für den Ausschank.",
  beggar: "Ein verzweifelter Überlebender bittet um eine milde Gabe, um den nächsten Tag zu überstehen."
};

for (const [npcId, desc] of Object.entries(descriptions)) {
  if (data.npc[npcId]) {
    data.npc[npcId].quest_desc = desc;
  }
}

fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
console.log("Updated quest descriptions in de.json!");
