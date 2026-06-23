const query = `[out:json][timeout:10];nwr["amenity"="fountain"](around:400,52.3744,9.7386);out center;`;
fetch(`https://lz4.overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`).then(res => res.text()).then(t => console.log(t.substring(0, 500))).catch(console.error);
