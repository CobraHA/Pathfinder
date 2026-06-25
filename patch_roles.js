const fs = require('fs');
const dePath = 'src/i18n/de.json';
const deJson = JSON.parse(fs.readFileSync(dePath, 'utf8'));

const firstPersonStarts = {
  blacksmith: "Was gibt es, Reisender? Meine Esse brennt heiß und die Arbeit wartet nicht.",
  herbalist: "Ah, ein neues Gesicht! Suchst du nach Linderung für deine Wunden oder nach etwas Speziellerem?",
  lumberjack: "Holz hackt sich nicht von allein, mein Freund. Brauchst du was?",
  beggar: "Hast du eine Münze oder ein Stück Brot für einen armen Tropf, den das Schicksal vergessen hat?",
  barista: "Einen starken Kaffee gegen die Müdigkeit der Reise? Oder suchst du nach etwas anderem?",
  trader: "Komm näher, komm näher! Ich habe Waren, die du sonst nirgends finden wirst... wenn der Preis stimmt.",
  informant: "Informationen sind Macht. Und ich habe sehr viel Macht zu verkaufen. Was willst du wissen?",
  guard_captain: "Kein Ärger in meiner Stadt, verstanden? Wir haben schon genug Probleme.",
  miner: "Die Minen sind tief und gefährlich. Suchst du nach Erzen oder nach Ärger?",
  farmer: "Die Ernte macht sich nicht von allein, und das Vieh schreit nach Futter. Was führt dich auf meinen Hof?",
  cook: "Willkommen in meiner Küche! Das Wasser kocht bereits. Suchst du nach einer warmen Mahlzeit?",
  hunter: "Der Wald ist voller Beute, aber auch voller Gefahren. Bist du Jäger oder Gejagter?",
  scout: "Ich habe Dinge jenseits der Grenzen gesehen, die dir das Blut in den Adern gefrieren lassen würden.",
  mayor: "Willkommen, Reisender! Als Bürgermeister dieser bescheidenen Gemeinde stehe ich dir zur Verfügung.",
  priest: "Mögen die Götter deinen Weg erleuchten. Suchst du nach spirituellem Beistand in diesen dunklen Zeiten?",
  alchemist: "Fass nichts an! Ein falscher Tropfen und wir fliegen beide in die Luft. Was willst du?",
  carpenter: "Gutes Handwerk braucht Zeit und das richtige Holz. Was brauchst du?",
  mason: "Ein Fundament muss stark sein, um den Stürmen der Zeit zu trotzen. Genau wie der Wille eines Kriegers.",
  merchant: "Willkommen in meinem bescheidenen Laden! Schau dich in Ruhe um, bei mir findest du nur die beste Qualität!",
  tailor: "Kleider machen Leute, nicht wahr? Und eine gute Rüstung hält dich am Leben. Womit kann ich dienen?",
  bard: "Sei gegrüßt, Wanderer! Möchtest du einem einfachen Barden ein Lied abkaufen?"
};

const explainRoles = {
  blacksmith: "Ich bin der Schmied dieser Gegend. Ich fertige Waffen und Werkzeuge, aber mir gehen ständig die Materialien aus.",
  herbalist: "Ich sammle seltene Pflanzen und braue Tränke, die selbst schwerste Wunden heilen können.",
  lumberjack: "Ich fälle Bäume für das Sägewerk, damit die Stadt weiter wachsen kann.",
  beggar: "Ich versuche nur, irgendwie den nächsten Tag zu überleben. Es ist ein hartes Leben auf der Straße.",
  barista: "Ich koche das einzige Getränk, das die Wachen und Händler hier bei Verstand hält: richtig guten Kaffee.",
  trader: "Ich reise von Stadt zu Stadt und kaufe seltene Gegenstände auf. Mein Inventar wechselt ständig.",
  informant: "Ich weiß Dinge. Wo Banditen sich verstecken, wo Schätze vergraben sind... alles hat seinen Preis.",
  guard_captain: "Ich sorge dafür, dass Monster und Diebe nicht über unsere Mauern kommen. Es ist ein endloser Kampf.",
  miner: "Ich schlage wertvolle Erze aus dem harten Gestein, tief unten im Dunkeln.",
  farmer: "Ich baue Getreide an und züchte Vieh, damit die Menschen in der Stadt nicht verhungern.",
  cook: "Ich bereite die besten Gerichte in der gesamten Region zu. Mein Geheimnis? Frische, seltene Zutaten.",
  hunter: "Ich spüre wilde Tiere und Monster in den Wäldern auf. Mein Bogen verfehlt sein Ziel nie.",
  scout: "Ich patrouilliere an den äußeren Grenzen und erkunde neue Gebiete für die Gilde.",
  mayor: "Ich kümmere mich um die Verwaltung, die Steuern und die Sorgen der Bürger.",
  priest: "Ich spende Trost und führe heilige Rituale durch, um böse Geister fernzuhalten.",
  alchemist: "Ich experimentiere mit flüchtigen Substanzen, um das Unmögliche möglich zu machen.",
  carpenter: "Ich baue Möbel, Häuser und Reparaturmaterialien aus feinstem Holz.",
  mason: "Ich bearbeite Stein für die Befestigungsanlagen und Monumente der Stadt.",
  merchant: "Ich verwalte das örtliche Warenhaus und sorge für einen stetigen Fluss an Ausrüstung.",
  tailor: "Ich nähe strapazierfähige Kleidung und Rüstungsunterfütterungen für Reisende wie dich.",
  bard: "Ich sammle die Geschichten der Welt und verwandle sie in Lieder, die die Herzen erfreuen."
};

for (const [key, text] of Object.entries(firstPersonStarts)) {
  if (deJson.npc[key]) {
    deJson.npc[key].start = text;
    deJson.npc[key].explain_role = explainRoles[key];
  }
}

fs.writeFileSync(dePath, JSON.stringify(deJson, null, 2));
console.log("Updated generic NPC starts to 1st person and added explain_role!");
