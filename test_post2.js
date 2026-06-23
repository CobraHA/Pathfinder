const query = `[out:json][timeout:10];nwr["amenity"~"^(fountain)$"](around:400,52.3744,9.7386);out center;`;
fetch('https://lz4.overpass-api.de/api/interpreter', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: `data=${encodeURIComponent(query)}`
}).then(r => r.text()).then(console.log).catch(console.error);
