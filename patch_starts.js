const fs = require('fs');
const dePath = 'src/i18n/de.json';
const deJson = JSON.parse(fs.readFileSync(dePath, 'utf8'));

const richStarts = {
  blacksmith: "Das rhythmische Hämmern auf glühendem Stahl verstummt für einen Moment. 'Was gibt es, Reisender? Meine Esse brennt heiß und die Arbeit wartet nicht.'",
  herbalist: "Ein intensiver Duft von zerriebenen Blättern und getrockneten Blüten liegt in der Luft. 'Ah, ein neues Gesicht! Suchst du nach Linderung für deine Wunden oder nach etwas Speziellerem?'",
  lumberjack: "Mit einem lauten Ächzen lässt er die schwere Axt sinken und wischt sich den Schweiß von der Stirn. 'Holz hackt sich nicht von allein, mein Freund. Brauchst du was?'",
  beggar: "Mit zittrigen Händen hält er eine alte, verbeulte Holzschale hin. 'Hast du eine Münze oder ein Stück Brot für einen armen Tropf, den das Schicksal vergessen hat?'",
  barista: "Das Zischen von heißem Dampf übertönt fast seine Begrüßung. 'Einen starken Kaffee gegen die Müdigkeit der Reise? Oder suchst du nach etwas anderem?'",
  trader: "Sein Karren ist vollgepackt mit Waren aus aller Herren Länder. 'Komm näher, komm näher! Ich habe Waren, die du sonst nirgends finden wirst... wenn der Preis stimmt.'",
  informant: "Er mustert dich aus dem Schatten seiner Kapuze heraus mit einem berechnenden Blick. 'Informationen sind Macht. Und ich habe sehr viel Macht zu verkaufen. Was willst du wissen?'",
  guard_captain: "Mit strengem Blick und ruhender Hand am Schwertgriff mustert er dich von Kopf bis Fuß. 'Kein Ärger in meiner Stadt, verstanden? Wir haben schon genug Probleme.'",
  miner: "Sein Gesicht ist schwarz von Ruß und Steinstaub. Er hustet trocken. 'Die Minen sind tief und gefährlich. Suchst du nach Erzen oder nach Ärger?'",
  farmer: "Er wischt sich die dreckigen Hände an seiner Schürze ab. 'Die Ernte macht sich nicht von allein, und das Vieh schreit nach Futter. Was führt dich auf meinen Hof?'",
  cook: "Ein köstlicher Duft nach gebratenem Fleisch und Kräutern strömt aus seinen Töpfen. 'Willkommen in meiner Küche! Das Wasser kocht bereits. Suchst du nach einer warmen Mahlzeit?'",
  hunter: "Er schnitzt konzentriert an einem Pfeilschaft und blickt nur kurz auf. 'Der Wald ist voller Beute, aber auch voller Gefahren. Bist du Jäger oder Gejagter?'",
  scout: "Er rollt hastig eine alte Karte zusammen, als du dich näherst. 'Ich habe Dinge jenseits der Grenzen gesehen, die dir das Blut in den Adern gefrieren lassen würden.'",
  mayor: "Mit einer ausladenden Geste und einem formellen Lächeln tritt er dir entgegen. 'Willkommen, Reisender! Als Bürgermeister dieser bescheidenen Gemeinde stehe ich dir zur Verfügung.'",
  priest: "Er faltet die Hände und blickt dich mit einem sanften Lächeln an. 'Mögen die Götter deinen Weg erleuchten. Suchst du nach spirituellem Beistand in diesen dunklen Zeiten?'",
  alchemist: "Verschiedenfarbige Flüssigkeiten blubbern in gläsernen Kolben. 'Fass nichts an! Ein falscher Tropfen und wir fliegen beide in die Luft. Was willst du?'",
  carpenter: "Sägespäne fliegen durch die Luft, während er geschickt ein Holzbrett bearbeitet. 'Gutes Handwerk braucht Zeit und das richtige Holz. Was brauchst du?'",
  mason: "Er klopft prüfend auf einen massiven Steinblock. 'Ein Fundament muss stark sein, um den Stürmen der Zeit zu trotzen. Genau wie der Wille eines Kriegers.'",
  merchant: "Er reibt sich geschäftig die Hände und grinst breit. 'Willkommen in meinem bescheidenen Laden! Schau dich in Ruhe um, bei mir findest du nur die beste Qualität!'",
  tailor: "Sie zieht vorsichtig einen Faden durch edlen Stoff. 'Kleider machen Leute, nicht wahr? Und eine gute Rüstung hält dich am Leben. Womit kann ich dienen?'"
};

for (const [key, text] of Object.entries(richStarts)) {
  if (deJson.npc[key]) {
    deJson.npc[key].start = text;
  }
}

fs.writeFileSync(dePath, JSON.stringify(deJson, null, 2));
console.log("Updated generic NPC starts with rich lore texts!");
