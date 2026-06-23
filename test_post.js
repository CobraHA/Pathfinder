const query = `[out:json][timeout:10];nwr["amenity"~"^(fountain)$"](around:400,52.3744,9.7386);out center;`;
fetch('https://overpass-api.de/api/interpreter', {
  method: 'POST',
  body: query
}).then(r => r.text()).then(console.log).catch(console.error);
