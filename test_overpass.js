const osmMapping = {
  "amenity=fountain": {}, "natural=wood": {}, "amenity=pharmacy": {},
  "shop=supermarket": {}, "historic=monument": {}, "amenity=bench": {},
  "leisure=park": {}, "amenity=hospital": {}, "amenity=police": {},
  "amenity=cafe": {}, "amenity=restaurant": {}, "shop=bakery": {},
  "building=ruins": {}, "tourism=museum": {}, "amenity=library": {},
  "natural=water": {}, "amenity=pub": {}, "shop=convenience": {},
  "amenity=atm": {}, "highway=bus_stop": {}, "amenity=place_of_worship": {},
  "sport=soccer": {}, "amenity=school": {}, "shop=clothes": {}
};

const keys = Object.keys(osmMapping);
const grouped = {};
keys.forEach(tag => {
  const [k, v] = tag.split('=');
  if (!grouped[k]) grouped[k] = [];
  grouped[k].push(v);
});

let queryBody = '';
for (const [k, values] of Object.entries(grouped)) {
  if (values.length === 1) {
    queryBody += `nwr["${k}"="${values[0]}"](around:400,52.3744,9.7386);`;
  } else {
    queryBody += `nwr["${k}"~"^(${values.join('|')})$"](around:400,52.3744,9.7386);`;
  }
}

const query = `[out:json][timeout:10];(${queryBody});out center;`;
console.log("Query:");
console.log(query);

const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
fetch(url).then(res => res.text()).then(t => console.log(t)).catch(console.error);
