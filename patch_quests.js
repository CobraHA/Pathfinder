const fs = require('fs');

const osm = JSON.parse(fs.readFileSync('src/config/osm_mapping.json', 'utf8'));

const quests = [
  { id: "monument_history", enTitle: "Historical Relic", enDesc: "Investigate the ancient monument.", deTitle: "Historisches Relikt", deDesc: "Untersuche das antike Monument." },
  { id: "rest_stop", enTitle: "Rest Stop", enDesc: "Rest for a moment and search the area.", deTitle: "Rastplatz", deDesc: "Ruhe dich kurz aus und durchsuche die Gegend." },
  { id: "park_patrol", enTitle: "Park Patrol", enDesc: "Clear the park of mutated animals.", deTitle: "Park Patrouille", deDesc: "Säubere den Park von mutierten Tieren." },
  { id: "hospital_run", enTitle: "Medical Supplies", enDesc: "Procure urgently needed medicine from the hospital.", deTitle: "Medizinische Vorräte", deDesc: "Beschaffe dringend benötigte Medikamente aus dem Krankenhaus." },
  { id: "ruin_scavenge", enTitle: "Ruin Scavenger", enDesc: "Search the ruins for usable scrap.", deTitle: "Ruinen-Plünderer", deDesc: "Durchsuche die Ruinen nach verwertbarem Schrott." },
  { id: "museum_artifact", enTitle: "Lost Artifact", enDesc: "Find a rare artifact in the old museum.", deTitle: "Verlorenes Artefakt", deDesc: "Finde ein seltenes Artefakt im alten Museum." },
  { id: "lost_knowledge", enTitle: "Lost Knowledge", enDesc: "Recover ancient records from the library.", deTitle: "Verlorenes Wissen", deDesc: "Berge alte Aufzeichnungen aus der Bibliothek." },
  { id: "bus_stop_ambush", enTitle: "Bus Stop Ambush", enDesc: "Survive the ambush at the bus stop.", deTitle: "Hinterhalt an der Haltestelle", deDesc: "Überlebe den Angriff an der Bushaltestelle." },
  { id: "sanctuary", enTitle: "Safe Sanctuary", enDesc: "Check if this place can serve as a sanctuary.", deTitle: "Sichere Zuflucht", deDesc: "Überprüfe, ob dieser Ort als Zuflucht dienen kann." },
  { id: "stadium_horde", enTitle: "Stadium Horde", enDesc: "Eliminate the nest on the sports field.", deTitle: "Horde im Stadion", deDesc: "Beseitige das Nest auf dem Sportplatz." }
];

for (const key in osm) {
  if (osm[key].type === 'quest') {
    osm[key].title = `map.quests.${osm[key].questId}`;
    osm[key].desc = `map.quests.${osm[key].questId}_desc`;
  }
}
fs.writeFileSync('src/config/osm_mapping.json', JSON.stringify(osm, null, 2));

const de = JSON.parse(fs.readFileSync('src/i18n/de.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('src/i18n/en.json', 'utf8'));

if (!de.map.quests) de.map.quests = {};
if (!en.map.quests) en.map.quests = {};

quests.forEach(q => {
  de.map.quests[q.id] = q.deTitle;
  de.map.quests[q.id + "_desc"] = q.deDesc;
  en.map.quests[q.id] = q.enTitle;
  en.map.quests[q.id + "_desc"] = q.enDesc;
});

fs.writeFileSync('src/i18n/de.json', JSON.stringify(de, null, 2));
fs.writeFileSync('src/i18n/en.json', JSON.stringify(en, null, 2));
