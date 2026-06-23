const fs = require('fs');
let data = JSON.parse(fs.readFileSync('src/i18n/de.json', 'utf8'));

if (!data.map) data.map = {};
if (!data.map.dialogs) data.map.dialogs = {};

const dialogs = data.map.dialogs;

const npcsData = {
  garrosh: {
    name: 'Schmied Garrosh',
    quests: [
      {
        req: 'iron_ore',
        start: 'Ah, ein Reisender! Mein Feuer erlischt fast und mir geht das Eisen aus.',
        ask_trade: 'Bringe mir Eisenerz aus den Minen.',
        accept_quest: 'Kehre zurück, wenn du das Erz hast.',
        check_quest_progress: 'Das Feuer wird schwächer. Hast du das Eisenerz?',
        complete_quest: 'Ausgezeichnet! Das Eisen ist von guter Qualität. Hier, dein Lohn.',
        quest_already_completed: 'Die Esse brennt wieder heiß, danke für das Eisenerz!'
      },
      {
        req: 'wood_log',
        start: 'Es ist kalt geworden, und meine Holzkohle geht zur Neige.',
        ask_trade: 'Ich brauche dringend Holzstämme, um neue Kohle zu brennen. Kannst du helfen?',
        accept_quest: 'Gut. Verliere keine Zeit.',
        check_quest_progress: 'Hast du das Holz? Die Glut stirbt bald.',
        complete_quest: 'Perfekt. Damit kann ich weiterarbeiten. Nimm dies als Dank.',
        quest_already_completed: 'Dank deines Holzes glüht die Schmiede wieder.'
      },
      {
        req: 'stone_block',
        start: 'Mein Amboss steht auf wackeligem Grund, ich muss das Fundament verstärken.',
        ask_trade: 'Bringe mir schwere Steinblöcke, um den Boden auszubessern.',
        accept_quest: 'Ich verlasse mich auf dich.',
        check_quest_progress: 'Ich warte immer noch auf die Steinblöcke.',
        complete_quest: 'Das sind gute, solide Steine. Gute Arbeit!',
        quest_already_completed: 'Das Fundament ist jetzt so hart wie mein Amboss.'
      }
    ]
  },
  alkuin: {
    name: 'Mönch Alkuin',
    quests: [
      {
        req: 'mushrooms',
        start: 'Die Pestilenz greift um sich, ich studiere neue Gegenmittel.',
        ask_trade: 'Besorge mir ein paar Waldpilze für meine Tinkturen.',
        accept_quest: 'Der Segen sei mit dir.',
        check_quest_progress: 'Hast du die Pilze für mich gesammelt?',
        complete_quest: 'Wunderbar! Diese Pilze werden bei meinen Studien sehr helfen.',
        quest_already_completed: 'Vielen Dank nochmal für deine Hilfe bei den Pilzen.'
      },
      {
        req: 'herb_root',
        start: 'Viele Pilger erreichen uns mit schlimmen Wunden.',
        ask_trade: 'Wir brauchen dringend Heilwurzeln zur Behandlung.',
        accept_quest: 'Möge dein Weg sicher sein.',
        check_quest_progress: 'Bist du mit den Heilwurzeln zurück?',
        complete_quest: 'Du hast Leben gerettet. Hier ist eine kleine Gabe des Klosters.',
        quest_already_completed: 'Die Verletzten erholen sich, dank deiner Heilwurzeln.'
      },
      {
        req: 'clean_water',
        start: 'Unser Brunnen ist durch die letzten Regenfälle trüb geworden.',
        ask_trade: 'Bitte bringe uns reines Wasser aus der nahen Quelle.',
        accept_quest: 'Geh mit Frieden.',
        check_quest_progress: 'Die Durstigen warten. Hast du das reine Wasser?',
        complete_quest: 'Wie erfrischend. Das Kloster steht in deiner Schuld.',
        quest_already_completed: 'Wir haben nun genug Wasser, gepriesen seist du.'
      }
    ]
  },
  leif: {
    name: 'Wache Leif',
    quests: [
      {
        req: 'wood_log',
        start: 'Die Barrikaden bröckeln und die Wölfe werden mutiger.',
        ask_trade: 'Wir brauchen Holzstämme, um die Palisade auszubessern.',
        accept_quest: 'Pass auf deinen Rücken auf.',
        check_quest_progress: 'Halt! Hast du das Holz dabei?',
        complete_quest: 'Ausgezeichnet. Damit können wir die Straße sicherer machen.',
        quest_already_completed: 'Die Barrikade hält. Danke nochmal für das Holz!'
      },
      {
        req: 'iron_ore',
        start: 'Unsere Klingen werden stumpf und die Rüstungen haben Dellen.',
        ask_trade: 'Bringe uns Eisenerz, damit wir unsere Ausrüstung reparieren können.',
        accept_quest: 'Trödel nicht.',
        check_quest_progress: 'Wo bleibt das Eisenerz? Wir müssen kampfbereit sein.',
        complete_quest: 'Gute Qualität. Die Männer werden sich freuen.',
        quest_already_completed: 'Unsere Schwerter sind wieder scharf, danke.'
      },
      {
        req: 'stone_block',
        start: 'Das alte Wachturmfundament gibt langsam nach.',
        ask_trade: 'Ich brauche robuste Steinblöcke, um den Turm abzustützen.',
        accept_quest: 'Gut, ich behalte die Stellung.',
        check_quest_progress: 'Hast du die Steine für den Turm?',
        complete_quest: 'Sehr gut. Jetzt wird das Konstrukt nicht einknicken.',
        quest_already_completed: 'Der Turm steht sicher.'
      }
    ]
  },
  elara: {
    name: 'Sammlerin Elara',
    quests: [
      {
        req: 'berries',
        start: 'Ich bin seit Stunden auf den Beinen, aber die Büsche hier sind leer.',
        ask_trade: 'Kannst du mir ein paar frische Beeren bringen? Ich zahle auch!',
        accept_quest: 'Danke! Ich warte hier.',
        check_quest_progress: 'Hast du die Beeren gefunden?',
        complete_quest: 'Mhm, die sehen köstlich aus. Hier ist dein Anteil!',
        quest_already_completed: 'Die Beeren waren fantastisch, danke.'
      },
      {
        req: 'mushrooms',
        start: 'Mein Vorrat an getrockneten Pilzen ist von Käfern befallen worden.',
        ask_trade: 'Würdest du für mich in den Wald gehen und neue Pilze sammeln?',
        accept_quest: 'Sei vorsichtig da draußen!',
        check_quest_progress: 'Bist du mit den Pilzen zurück?',
        complete_quest: 'Perfekt. Ich werde sie gleich aufhängen.',
        quest_already_completed: 'Die Pilze trocknen bereits im Wind.'
      },
      {
        req: 'herb_root',
        start: 'Ich suche nach einer speziellen Heilwurzel, aber der Boden hier ist zu hart.',
        ask_trade: 'Vielleicht hast du mehr Glück beim Graben? Bringe mir Heilwurzeln.',
        accept_quest: 'Ich hoffe, du findest welche.',
        check_quest_progress: 'War die Suche nach den Wurzeln erfolgreich?',
        complete_quest: 'Wunderbar! Diese Wurzeln sind sehr wertvoll.',
        quest_already_completed: 'Ich habe die Wurzeln sicher verstaut.'
      }
    ]
  },
  kael: {
    name: 'Schmuggler Kael',
    quests: [
      {
        req: 'salt',
        start: 'Pst! Hier drüben. Meine Vorräte gehen zur Neige und die Miliz kontrolliert die Straßen.',
        ask_trade: 'Besorge mir Salz, unauffällig. Ich zahle besser als der Markt.',
        accept_quest: 'Lass dich nicht erwischen.',
        check_quest_progress: 'Hast du das Zeug?',
        complete_quest: 'Sehr gut. Und wir haben uns nie gesehen, verstanden?',
        quest_already_completed: 'Das Geschäft ist abgeschlossen. Geh weiter.'
      },
      {
        req: 'iron_ore',
        start: 'Ein... Kunde... benötigt dringend Roheisen. Fragen unerwünscht.',
        ask_trade: 'Bringe mir Eisenerz. Kein Wort zu den Wachen.',
        accept_quest: 'Gut. Beeil dich.',
        check_quest_progress: 'Wo bleibt das Erz? Der Kunde wird ungeduldig.',
        complete_quest: 'Ausgezeichnet. Du stellst keine dummen Fragen, das gefällt mir.',
        quest_already_completed: 'Die Lieferung ist bereits unterwegs.'
      },
      {
        req: 'stone_block',
        start: 'Ich brauche Steine, um ein... Versteck auszubauen.',
        ask_trade: 'Schaff mir Steinblöcke heran. Diskretion wird belohnt.',
        accept_quest: 'Wir sehen uns hier.',
        check_quest_progress: 'Hast du die Steine besorgt?',
        complete_quest: 'Perfekt, damit kann ich den Zugang blockieren. Hier ist das Gold.',
        quest_already_completed: 'Das Versteck ist sicher, dank dir.'
      }
    ]
  },
  mira: {
    name: 'Heilerin Mira',
    quests: [
      {
        req: 'herb_root',
        start: 'Die Verletzten werden immer mehr. Meine Kräutervorräte reichen nicht.',
        ask_trade: 'Bitte hilf mir und sammle dringend Heilwurzeln!',
        accept_quest: 'Die Geister seien mit dir.',
        check_quest_progress: 'Hast du die Wurzeln? Ein Patient hat starkes Fieber.',
        complete_quest: 'Danke! Damit kann ich den fiebersenkenden Sud brauen.',
        quest_already_completed: 'Das Fieber des Patienten ist gesunken.'
      },
      {
        req: 'clean_water',
        start: 'Ich muss Verbände waschen, aber unser Wasser ist verunreinigt.',
        ask_trade: 'Kannst du reines Wasser von einer unberührten Quelle besorgen?',
        accept_quest: 'Jede Minute zählt.',
        check_quest_progress: 'Hast du das saubere Wasser?',
        complete_quest: 'Das ist rein genug. Ich danke dir von Herzen.',
        quest_already_completed: 'Die Verbände sind nun sauber, danke dir.'
      },
      {
        req: 'berries',
        start: 'Die Kinder im Lazarett brauchen Vitamine, um zu Kräften zu kommen.',
        ask_trade: 'Bringe mir frische Beeren aus der Umgebung.',
        accept_quest: 'Sie werden sich freuen.',
        check_quest_progress: 'Hast du die Beeren für die Kinder?',
        complete_quest: 'Sieh nur, wie sie lächeln! Du hast eine gute Tat vollbracht.',
        quest_already_completed: 'Die Kinder lieben die Beeren.'
      }
    ]
  },
  thorne: {
    name: 'Holzfäller Thorne',
    quests: [
      {
        req: 'wood_log',
        start: 'Meine Axt ist stumpf und mein Rücken schmerzt. Das Soll ist aber noch nicht erfüllt.',
        ask_trade: 'Kannst du für mich ein paar Holzstämme schlagen?',
        accept_quest: 'Pass auf fallende Äste auf.',
        check_quest_progress: 'Hast du das Holz zusammen?',
        complete_quest: 'Klasse Arbeit! Das rettet mir heute den Hals vor dem Vorarbeiter.',
        quest_already_completed: 'Dank dir konnte ich mich heute etwas ausruhen.'
      },
      {
        req: 'stone_block',
        start: 'Mein alter Schleifstein ist durchgebrochen. Verdammter Mist!',
        ask_trade: 'Besorge mir ein paar harte Steinblöcke, damit ich einen neuen hauen kann.',
        accept_quest: 'Beeil dich, ich kann so nicht arbeiten.',
        check_quest_progress: 'Hast du die Steine für den Schleifstein?',
        complete_quest: 'Gute Steine. Das wird eine scharfe Klinge geben.',
        quest_already_completed: 'Die Axt ist wieder scharf, danke der Steine.'
      },
      {
        req: 'mushrooms',
        start: 'Holzfällen macht hungrig. Meine Frau hat heute nichts eingepackt.',
        ask_trade: 'Sammle mir ein paar Pilze für eine deftige Pfanne am Feuer.',
        accept_quest: 'Ich heize schon mal das Feuer an.',
        check_quest_progress: 'Wo bleiben die Pilze? Mein Magen knurrt!',
        complete_quest: 'Endlich! Das wird ein Festmahl. Hier, nimm ein paar Münzen.',
        quest_already_completed: 'Die Pilzpfanne war hervorragend.'
      }
    ]
  },
  lyra: {
    name: 'Kräuterfrau Lyra',
    quests: [
      {
        req: 'herb_root',
        start: 'Die Mondphase ist perfekt, aber ich kann meinen Stand nicht verlassen.',
        ask_trade: 'Sammle für mich ein paar besonders kräftige Heilwurzeln.',
        accept_quest: 'Spürst du die Energie des Waldes?',
        check_quest_progress: 'Hast du die Wurzeln im Mondlicht gefunden?',
        complete_quest: 'Wunderbar. Ihre Aura ist sehr stark.',
        quest_already_completed: 'Der Zaubertrank brodelt bereits, danke.'
      },
      {
        req: 'berries',
        start: 'Ich brauche den Saft von Beeren, um Tinte für meine Rituale herzustellen.',
        ask_trade: 'Bringe mir eine Handvoll reifer Beeren.',
        accept_quest: 'Komm bald zurück.',
        check_quest_progress: 'Hast du die Beeren für die Tinte?',
        complete_quest: 'Perfekte Farbe! Hier ist deine Belohnung.',
        quest_already_completed: 'Die Ritualtinte ist gemischt.'
      },
      {
        req: 'salt',
        start: 'Böse Geister schleichen nachts um mein Zelt. Ich muss Schutzkreise ziehen.',
        ask_trade: 'Besorge mir reines Salz für das Ritual.',
        accept_quest: 'Möge das Licht dich schützen.',
        check_quest_progress: 'Hast du das schützende Salz?',
        complete_quest: 'Jetzt kann ich ruhig schlafen. Ich stehe in deiner Schuld.',
        quest_already_completed: 'Die Schutzkreise halten das Böse fern.'
      }
    ]
  },
  silas: {
    name: 'Alchemist Silas',
    quests: [
      {
        req: 'salt',
        start: 'Das Experiment ist fast abgeschlossen, es fehlt nur ein Katalysator.',
        ask_trade: 'Ich benötige pures Salz, um die Reaktion zu stabilisieren. Schnell!',
        accept_quest: 'Fass nichts an, wenn du zurückkommst.',
        check_quest_progress: 'Das Salz! Hast du das Salz? Es brodelt über!',
        complete_quest: 'Gerade noch rechtzeitig! Faszinierend... Hier ist dein Gold.',
        quest_already_completed: 'Das Experiment war ein voller Erfolg.'
      },
      {
        req: 'mushrooms',
        start: 'Ich extrahiere die Sporen dieser Pilze für ein Wahrheitsserum.',
        ask_trade: 'Beschaffe mir weitere Pilze aus dem Unterholz.',
        accept_quest: 'Ein logischer Tauschhandel.',
        check_quest_progress: 'Hast du die Exemplare für mich gesammelt?',
        complete_quest: 'Die Konzentration der Toxine ist perfekt. Sehr gut.',
        quest_already_completed: 'Die Sporen sind sicher extrahiert.'
      },
      {
        req: 'iron_ore',
        start: 'Mein Mörser ist gesprungen. Ich brauche widerstandsfähigeres Material.',
        ask_trade: 'Bringe mir rohes Eisenerz, damit ich einen neuen gießen kann.',
        accept_quest: 'Verstehe die Dringlichkeit.',
        check_quest_progress: 'Hast du das Erz für den Mörser?',
        complete_quest: 'Dieses Eisen wird der Säure standhalten. Ich danke dir.',
        quest_already_completed: 'Der neue Mörser funktioniert einwandfrei.'
      }
    ]
  },
  jace: {
    name: 'Jäger Jace',
    quests: [
      {
        req: 'wood_log',
        start: 'Meine Fallen sind hinüber und ich brauche frische Pfeilschäfte.',
        ask_trade: 'Schlag mir etwas Holz, damit ich mich wieder ausrüsten kann.',
        accept_quest: 'Viel Erfolg bei der Jagd.',
        check_quest_progress: 'Hast du das Holz für meine Pfeile?',
        complete_quest: 'Das Holz hat genau die richtige Biegung. Hier, nimm das.',
        quest_already_completed: 'Meine neuen Pfeile fliegen extrem genau.'
      },
      {
        req: 'iron_ore',
        start: 'Ich will meine Pfeilspitzen verbessern, um dickeres Fell zu durchdringen.',
        ask_trade: 'Bringe mir Eisenerz für stählerne Spitzen.',
        accept_quest: 'Lass dich nicht fressen.',
        check_quest_progress: 'Hast du das Erz für meine Jagdspitzen?',
        complete_quest: 'Damit kriege ich jeden Bären klein. Danke!',
        quest_already_completed: 'Die neuen Jagdspitzen sind tödlich.'
      },
      {
        req: 'salt',
        start: 'Ich habe gestern reiche Beute gemacht, aber das Fleisch droht zu verderben.',
        ask_trade: 'Besorge mir schnell Salz, damit ich das Fleisch pökeln kann.',
        accept_quest: 'Beeil dich, bevor die Fliegen kommen.',
        check_quest_progress: 'Wo bleibt das Salz? Das Fleisch wird schlecht!',
        complete_quest: 'Gerettet! Das wird ein guter Wintervorrat. Hier, dein Anteil.',
        quest_already_completed: 'Das Fleisch ist gut durchgezogen.'
      }
    ]
  },
  rina: {
    name: 'Köchin Rina',
    quests: [
      {
        req: 'mushrooms',
        start: 'Der Eintopf schmeckt fad und mir fehlen die Gewürze des Waldes.',
        ask_trade: 'Sammle frische Pilze, um meiner Suppe den letzten Schliff zu geben.',
        accept_quest: 'Ich rühre solange weiter.',
        check_quest_progress: 'Hast du die Pilze für den Eintopf?',
        complete_quest: 'Riech nur, wie köstlich das duftet! Hier ist dein Lohn.',
        quest_already_completed: 'Alle lieben meine Pilzsuppe.'
      },
      {
        req: 'clean_water',
        start: 'Ich kann keine Suppe ohne sauberes Wasser kochen.',
        ask_trade: 'Bringe mir Wasser von bester Qualität.',
        accept_quest: 'Verschütte nichts!',
        check_quest_progress: 'Hast du das klare Wasser?',
        complete_quest: 'Das Wasser ist perfekt klar. So muss das sein.',
        quest_already_completed: 'Die Brühe köchelt wunderbar vor sich hin.'
      },
      {
        req: 'berries',
        start: 'Zum Nachtisch plane ich eine süße Grütze, aber die Beeren fehlen.',
        ask_trade: 'Pflücke mir einen Korb voll süßer Beeren.',
        accept_quest: 'Aber iss sie nicht unterwegs auf!',
        check_quest_progress: 'Hast du die Beeren für den Nachtisch?',
        complete_quest: 'Sie sind noch ganz frisch! Vielen Dank, Liebes.',
        quest_already_completed: 'Die Beerengrütze war der Hit.'
      }
    ]
  },
  vance: {
    name: 'Wassermeister Vance',
    quests: [
      {
        req: 'clean_water',
        start: 'Die Zisterne der Siedlung ist fast leer. Das ist eine Krise.',
        ask_trade: 'Du musst uns helfen. Bringe sofort frisches Wasser heran!',
        accept_quest: 'Wir zählen auf dich.',
        check_quest_progress: 'Hast du das Wasser für die Zisterne?',
        complete_quest: 'Die Reserven steigen wieder. Gut gemacht!',
        quest_already_completed: 'Dank dir leiden wir keinen Durst mehr.'
      },
      {
        req: 'stone_block',
        start: 'Ein Rohr ist geplatzt und das Wasser versickert im Boden.',
        ask_trade: 'Ich brauche Steine, um das Leck zu mauern. Kannst du welche besorgen?',
        accept_quest: 'Wir müssen das schnell abdichten.',
        check_quest_progress: 'Hast du die Steine für das Leck?',
        complete_quest: 'Das wird halten. Gute und schnelle Arbeit.',
        quest_already_completed: 'Das Rohr ist dicht.'
      },
      {
        req: 'wood_log',
        start: 'Wir wollen ein neues Wasserrad bauen, um den Fluss anzuzapfen.',
        ask_trade: 'Dafür brauche ich robuste Holzstämme.',
        accept_quest: 'Das wird die Siedlung voranbringen.',
        check_quest_progress: 'Hast du das Holz für das Rad?',
        complete_quest: 'Das Holz schwimmt gut, das wird ein tolles Wasserrad.',
        quest_already_completed: 'Das Wasserrad dreht sich bereits fleißig.'
      }
    ]
  },
  nyla: {
    name: 'Schatzsucherin Nyla',
    quests: [
      {
        req: 'iron_ore',
        start: 'Meine Spitzhacke hat an diesem Felsen den Geist aufgegeben.',
        ask_trade: 'Besorge mir neues Eisen, damit ich mir eine neue schmieden kann.',
        accept_quest: 'Ich bewache solange die Ausgrabung.',
        check_quest_progress: 'Hast du das Eisen für meine Hacke?',
        complete_quest: 'Perfekt. Ich spüre, hinter der nächsten Wand ist Gold!',
        quest_already_completed: 'Die neue Hacke schlägt mühelos durch den Stein.'
      },
      {
        req: 'wood_log',
        start: 'Der Stollen ist instabil. Ich brauche Stützbalken.',
        ask_trade: 'Bringe mir Holzstämme, sonst werde ich hier noch begraben.',
        accept_quest: 'Komm schnell wieder.',
        check_quest_progress: 'Hast du das Holz? Es rieselt schon Dreck von der Decke!',
        complete_quest: 'Gerade noch rechtzeitig abgedichtet. Hier ist ein Teil meines Fundes.',
        quest_already_completed: 'Der Stollen ist dank der Balken nun sicher.'
      },
      {
        req: 'herb_root',
        start: 'Ich habe mich an einer giftigen Ranke in den Ruinen geschnitten.',
        ask_trade: 'Ich brauche eine Heilwurzel, um das Gift auszusaugen. Bitte!',
        accept_quest: 'Ich... ich warte hier.',
        check_quest_progress: 'Hast du die Wurzel? Mir wird schon schwindelig...',
        complete_quest: 'Ah, das Gift lässt nach. Du hast mich gerettet.',
        quest_already_completed: 'Das Gift ist restlos aus meinem Körper verschwunden.'
      }
    ]
  }
};

for (const [npcId, info] of Object.entries(npcsData)) {
  dialogs[npcId] = {};
  for (let qIdx = 0; qIdx < info.quests.length; qIdx++) {
    const qData = info.quests[qIdx];
    dialogs[npcId][`quest_${qIdx}_start`] = qData.start;
    dialogs[npcId][`quest_${qIdx}_ask_trade`] = qData.ask_trade;
    dialogs[npcId][`quest_${qIdx}_accept_quest`] = qData.accept_quest;
    dialogs[npcId][`quest_${qIdx}_check_quest_progress`] = qData.check_quest_progress;
    dialogs[npcId][`quest_${qIdx}_complete_quest`] = qData.complete_quest;
    dialogs[npcId][`quest_${qIdx}_quest_already_completed`] = qData.quest_already_completed;
  }
}

fs.writeFileSync('src/i18n/de.json', JSON.stringify(data, null, 2));
console.log('Successfully fixed translations in de.json');
