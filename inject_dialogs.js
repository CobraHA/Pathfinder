const fs = require('fs');
const dePath = 'src/i18n/de.json';
const deJson = JSON.parse(fs.readFileSync(dePath, 'utf8'));

const richDialogs = {
  blacksmith: {
    start: "Ah, ein Reisender. Tritt näher an die Esse, hier ist es wenigstens warm.",
    opt_start_1: "Was schmiedest du da gerade?",
    explain_role_1: "Ich bearbeite das Metall für die Wachen und Abenteurer dieser Gegend. Ohne gute Klingen überlebt man hier draußen nicht lange.",
    opt_explain_1_1: "Das klingt nach einer Menge Arbeit.",
    explain_role_2: "Das ist es. Leider gehen mir langsam die Rohstoffe aus. Die Minen sind gefährlich geworden und kaum jemand traut sich noch, Erz abzubauen.",
    opt_explain_2_1: "Kann ich dir dabei vielleicht helfen?"
  },
  herbalist: {
    start: "Vorsicht, tritt nicht auf die Kräuter! Was führt dich zu mir?",
    opt_start_1: "Bist du der Heiler dieses Ortes?",
    explain_role_1: "Ich mische Tränke und Salben. Die Natur bietet uns alles, was wir zur Heilung brauchen, man muss nur wissen, wo man sucht.",
    opt_explain_1_1: "Gibt es Kräuter, die schwer zu finden sind?",
    explain_role_2: "Oh ja, einige der wirksamsten Pilze wachsen nur in den tiefsten Wäldern. Dort lauern allerdings auch Gefahren.",
    opt_explain_2_1: "Vielleicht kann ich welche für dich besorgen?"
  },
  lumberjack: {
    start: "Holla! Pass auf, wo du hintrittst, hier fliegen Späne.",
    opt_start_1: "Du scheinst schwer beschäftigt zu sein.",
    explain_role_1: "Das kannst du laut sagen. Wir brauchen Holz für neue Palisaden, um die Bestien nachts fernzuhalten.",
    opt_explain_1_1: "Klingt gefährlich. Hast du keine Angst?",
    explain_role_2: "Meine Axt ist scharf, aber selbst ich schaffe das Pensum nicht mehr allein. Der Wald ist einfach zu dicht und unheimlich geworden.",
    opt_explain_2_1: "Soll ich dir beim Holzhacken helfen?"
  },
  beggar: {
    start: "Eine Münze... oder etwas Brot für einen armen Tropf?",
    opt_start_1: "Wie bist du in diese Lage geraten?",
    explain_role_1: "Ich hatte einst einen Hof, doch die Banditen haben mir alles genommen. Jetzt lebe ich vom Wohlwollen der Passanten.",
    opt_explain_1_1: "Das ist tragisch. Kann die Wache nichts tun?",
    explain_role_2: "Die Wache kümmert sich nicht um Leute wie mich. Wenn ich nicht bald etwas zu essen bekomme, überstehe ich die nächste Nacht nicht.",
    opt_explain_2_1: "Ich könnte versuchen, dir etwas Essen zu besorgen."
  },
  barista: {
    start: "Willkommen! Etwas Koffein für die müden Knochen?",
    opt_start_1: "Was gibt es hier zu trinken?",
    explain_role_1: "Ich brühe den stärksten Kaffee diesseits der Berge. Er hält die Karawanenwachen nachts wach.",
    opt_explain_1_1: "Das klingt nach einem wichtigen Job.",
    explain_role_2: "Das ist es. Aber das Wasser aus dem nahen Fluss ist trüb geworden. Ohne frisches, sauberes Wasser kann ich nichts vernünftiges brühen.",
    opt_explain_2_1: "Kann ich dir sauberes Wasser besorgen?"
  },
  trader: {
    start: "Komm näher, schau dir meine Waren an! Nur das Beste vom Besten.",
    opt_start_1: "Was handelst du hier?",
    explain_role_1: "Alles, was das Herz begehrt. Werkzeuge, Materialien, Nahrung. Doch die Lieferketten sind in letzter Zeit abgerissen.",
    opt_explain_1_1: "Warum das?",
    explain_role_2: "Die Straßen sind unsicher. Meine Wagen wurden überfallen und nun fehlt es mir an Grundlegendem, um das Geschäft am Laufen zu halten.",
    opt_explain_2_1: "Gibt es Materialien, die du aktuell dringend brauchst?"
  },
  informant: {
    start: "Pst. Nicht so laut. Du suchst nach Informationen?",
    opt_start_1: "Was weißt du?",
    explain_role_1: "Ich höre Dinge, die andere überhören. Wer, wann, wo... jedes Geheimnis hat seinen Preis.",
    opt_explain_1_1: "Du wirkst nervös. Alles in Ordnung?",
    explain_role_2: "Ein paar Leute sind mir auf den Fersen. Ich brauche Münzen, um mich für eine Weile abzusetzen, bis sich der Staub legt.",
    opt_explain_2_1: "Ich könnte dich dafür bezahlen, wenn du Aufträge hast."
  },
  guard_captain: {
    start: "Halt! Identifiziere dich. Die Zeiten sind gefährlich.",
    opt_start_1: "Ich bin nur ein Reisender. Was ist los?",
    explain_role_1: "Ich leite die Wache. Wir versuchen die Gegend sicher zu halten, aber wir sind völlig unterbesetzt.",
    opt_explain_1_1: "Wogegen kämpft ihr?",
    explain_role_2: "Banditen, Plünderer... und schlimmeres. Unsere Waffen sind stumpf und die Moral ist am Boden. Wir brauchen dringend Vorräte.",
    opt_explain_2_1: "Ich bin kampferprobt. Wie kann ich helfen?"
  },
  miner: {
    start: "Hust... verzeiht den Staub. Die Stollen sind trocken heute.",
    opt_start_1: "Du arbeitest tief in den Minen?",
    explain_role_1: "Ja, wir schlagen das Erz aus dem Stein. Es ist knochenharte Arbeit im Dunkeln.",
    opt_explain_1_1: "Warum kommst du dann nicht an die Oberfläche?",
    explain_role_2: "Ohne das Erz steht die Siedlung still. Aber kürzlich ist ein Schacht eingestürzt, und wir haben unsere besten Spitzhacken verloren.",
    opt_explain_2_1: "Soll ich euch Material für neue Werkzeuge bringen?"
  },
  farmer: {
    start: "Willkommen auf meinem Hof. Pass auf die Setzlinge auf!",
    opt_start_1: "Was baust du hier an?",
    explain_role_1: "Weizen, Gemüse, alles was der Boden hergibt. Doch die Ernte ist dieses Jahr spärlich.",
    opt_explain_1_1: "Ist das Wetter so schlecht?",
    explain_role_2: "Die Dürre macht uns zu schaffen. Und zu allem Überfluss nisten Ungeziefer in den Feldern. Ich weiß nicht, wie wir über den Winter kommen sollen.",
    opt_explain_2_1: "Kann ich dir bei der Ernte oder beim Vertreiben helfen?"
  },
  cook: {
    start: "Riechst du das? Die Suppe köchelt seit Stunden.",
    opt_start_1: "Das riecht fantastisch. Was kochst du?",
    explain_role_1: "Einen kräftigen Eintopf für die Arbeiter. Voller Magen arbeitet besser, sage ich immer.",
    opt_explain_1_1: "Fehlt dir noch etwas?",
    explain_role_2: "Allerdings. Das Salz geht mir aus, und ohne die richtige Würze schmeckt das wie Spülwasser. Niemand wird das essen wollen.",
    opt_explain_2_1: "Vielleicht finde ich die fehlenden Zutaten für dich."
  },
  hunter: {
    start: "Leise. Du verscheuchst mir noch das Wild.",
    opt_start_1: "Gibt es hier gute Beute?",
    explain_role_1: "Das gab es mal. Inzwischen ziehen die Herden weiter, vertrieben von Ungetümen aus den Tiefen des Waldes.",
    opt_explain_1_1: "Das klingt nach einer schlechten Jagdsaison.",
    explain_role_2: "Sehr schlecht. Mir gehen zudem die Pfeile und Fallen aus. So kann ich die Siedlung unmöglich mit Fleisch versorgen.",
    opt_explain_2_1: "Soll ich dir Ressourcen für neue Fallen besorgen?"
  },
  scout: {
    start: "Immer die Augen offen halten. Du bist unachtsam herangetreten.",
    opt_start_1: "Was späht ihr hier aus?",
    explain_role_1: "Die Wege und Pfade. Ich kartografiere das Gebiet und halte nach feindlichen Lagern Ausschau.",
    opt_explain_1_1: "Hast du etwas Verdächtiges entdeckt?",
    explain_role_2: "Ja, einige Bewegungen im Osten. Leider habe ich bei der Flucht mein Fernglas und meine Vorräte verloren.",
    opt_explain_2_1: "Kann ich dir Ersatz besorgen?"
  },
  mayor: {
    start: "Willkommen in unserer bescheidenen Zuflucht. Ich bin der Bürgermeister.",
    opt_start_1: "Wie steht es um eure Zuflucht?",
    explain_role_1: "Wir wachsen, doch mit den Einwohnern wachsen auch die Probleme. Verwaltung ist in diesen Tagen ein Albtraum.",
    opt_explain_1_1: "Gibt es etwas Bestimmtes, das fehlt?",
    explain_role_2: "Wo fange ich an? Die Kassen sind leer und wir haben nicht genug Baumaterial für die neuen Unterkünfte. Die Leute werden langsam unruhig.",
    opt_explain_2_1: "Ich könnte als Beschaffer für euch arbeiten."
  },
  priest: {
    start: "Mögen die Götter deinen Weg erleuchten. Suchst du nach spirituellem Beistand?",
    opt_start_1: "Was genau machst du hier?",
    explain_role_1: "Ich bete für die verlorenen Seelen und spende den Verletzten Trost. In dieser Dunkelheit ist Glaube oft das Einzige, was uns bleibt.",
    opt_explain_1_1: "Reicht Beten allein denn aus?",
    explain_role_2: "Leider nein. Viele sind verwundet oder krank. Wir benötigen dringend Heilkräuter und sauberes Wasser für Rituale und Medizin.",
    opt_explain_2_1: "Ich werde die nötigen Heilmittel für euch auftreiben."
  },
  alchemist: {
    start: "Vorsicht mit dem Kolben! Das Gemisch ist hochgradig flüchtig.",
    opt_start_1: "Was braust du da zusammen?",
    explain_role_1: "Tränke, Elixiere, Gegengifte. Wissenschaft und Magie in flüssiger Form, bereit, Wunder zu wirken.",
    opt_explain_1_1: "Das sieht faszinierend aus.",
    explain_role_2: "Das wäre es, wenn ich die seltenen Reagenzien hätte. Mir fehlen seltene Pilze und Salze, um die wichtigen Formeln zu vollenden.",
    opt_explain_2_1: "Wo kann ich diese Reagenzien für dich finden?"
  },
  carpenter: {
    start: "Miss zweimal, säge einmal. Was willst du?",
    opt_start_1: "Du baust wohl einiges hier?",
    explain_role_1: "Alles, was aus Holz ist. Möbel, Karren, Befestigungen. Ohne Zimmermann fällt die Siedlung zusammen.",
    opt_explain_1_1: "Hast du genug Holz dafür?",
    explain_role_2: "Nein, das ist ja das Problem. Die Holzfäller liefern kaum noch, weil der Wald zu gefährlich ist. Ich sitze auf dem Trockenen.",
    opt_explain_2_1: "Soll ich dir ein paar Stämme besorgen?"
  },
  mason: {
    start: "Stein auf Stein... Du stehst im Weg, Freundchen.",
    opt_start_1: "Baust du eine neue Mauer?",
    explain_role_1: "Ich baue Fundamente, die ewig halten sollen. Stein verzeiht keine Fehler, genau wie diese Welt.",
    opt_explain_1_1: "Wie kommst du an den Stein?",
    explain_role_2: "Aus dem Bruch. Aber der Weg dorthin ist mittlerweile voller Banditen. Mir gehen die Bausteine aus und das Fundament muss fertig werden.",
    opt_explain_2_1: "Ich mache den Weg frei und besorge Material."
  },
  merchant: {
    start: "Ah! Ein potenzieller Kunde. Darf ich dir meine edlen Waren zeigen?",
    opt_start_1: "Du verkaufst ziemlich exklusive Dinge.",
    explain_role_1: "In der Tat. Ich handle mit Luxus und seltenen Gütern aus fernen Landen. Für den, der die entsprechenden Münzen hat.",
    opt_explain_1_1: "Läuft das Geschäft gut?",
    explain_role_2: "Es könnte besser sein. Einige meiner wertvollsten Karawanen sind verschollen und mir fehlen spezielle Güter, um die Reichen zufriedenzustellen.",
    opt_explain_2_1: "Klingt lukrativ. Kann ich etwas für dich besorgen?"
  },
  tailor: {
    start: "Dieser Stoff... nein, das Muster passt nicht. Oh, hallo!",
    opt_start_1: "Du flickst Kleidung?",
    explain_role_1: "Flicken? Ich erschaffe Meisterwerke! Aber ja, momentan flicke ich hauptsächlich die zerschlissenen Rüstungen der Wachen.",
    opt_explain_1_1: "Das muss anstrengend sein.",
    explain_role_2: "Es ist ein Albtraum. Mir gehen Nadeln und Fäden aus, geschweige denn gutes Leder oder fester Stoff.",
    opt_explain_2_1: "Wenn ich Material finde, bringe ich es dir."
  },
  bard: {
    start: "Ein Lied für eine Münze? Oder suchst du eher nach eine heldenhaften Ballade?",
    opt_start_1: "Du bist ein Barde?",
    explain_role_1: "Ich bin der Chronist eurer Taten! Ich webe Geschichten und spiele Lieder, die Mut machen und Sorgen vertreiben.",
    opt_explain_1_1: "Die Leute könnten Musik gebrauchen.",
    explain_role_2: "Ganz meine Meinung. Doch meine Laute ist beim letzten Unwetter beschädigt worden und mir fehlen besondere Fasern für neue Saiten.",
    opt_explain_2_1: "Ich kann schauen, ob ich etwas Brauchbares finde."
  }
};

if (!deJson.npc) deJson.npc = {};

for (const [npcId, texts] of Object.entries(richDialogs)) {
  if (!deJson.npc[npcId]) deJson.npc[npcId] = {};
  for (const [k, v] of Object.entries(texts)) {
    deJson.npc[npcId][k] = v;
  }
}

// Add map.dialogs specific ones
if (!deJson.map) deJson.map = { dialogs: {} };
if (!deJson.map.dialogs) deJson.map.dialogs = {};

const mapOverrides = {
  garrosh: 'blacksmith',
  alkuin: 'alchemist',
  leif: 'guard_captain', // Or lumberjack
};

for (const [mapId, baseId] of Object.entries(mapOverrides)) {
  if (!deJson.map.dialogs[mapId]) deJson.map.dialogs[mapId] = {};
  for (const [k, v] of Object.entries(richDialogs[baseId])) {
    deJson.map.dialogs[mapId][k] = v;
  }
}

fs.writeFileSync(dePath, JSON.stringify(deJson, null, 2));
console.log("Written successfully");
