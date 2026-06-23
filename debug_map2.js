const lastChestGenTime = 0;
let generatedChests = [];

function generateRandomChests(latitude, longitude) {
  const now = Date.now();
  generatedChests = [];
  for (let i = 0; i < 5; i++) {
    const offsetLat = (Math.random() - 0.5) * 0.005;
    const offsetLon = (Math.random() - 0.5) * 0.005;
    generatedChests.push({
      id: `chest_${now}_${i}`,
      title: "Versteckte Truhe",
      type: "chest",
      location: { type: 'Point', coordinates: [longitude + offsetLon, latitude + offsetLat] },
      data: { isLocked: Math.random() > 0.5 }
    });
  }
}

generateRandomChests(50.11, 8.68);
console.log(JSON.stringify(generatedChests, null, 2));

const processed = generatedChests.map(q => {
  let qLoc = q.location;
  if (typeof qLoc === 'string') {
    try { qLoc = JSON.parse(qLoc); } catch (e) {}
  }
  
  let qLat = qLoc?.coordinates?.[1];
  let qLon = qLoc?.coordinates?.[0];
  if (qLoc?.type === 'Point' && Array.isArray(qLoc?.coordinates)) {
    // Supabase PostGIS format
    qLon = qLoc.coordinates[0];
    qLat = qLoc.coordinates[1];
  }
  
  return {
    ...q,
    location: qLoc,
    distance_meters: 100 // mock
  };
});

console.log("Processed:", JSON.stringify(processed[0], null, 2));
