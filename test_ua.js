const query = `[out:json][timeout:10];nwr["amenity"="fountain"](around:400,52.3744,9.7386);out center;`;
fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`, {
  headers: {
    'User-Agent': 'NeonWalkRPG/1.0 (Contact: myemail@example.com)'
  }
}).then(res => res.text()).then(t => console.log(t.substring(0, 500))).catch(console.error);
