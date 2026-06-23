import osmMapping from '../config/osm_mapping.json';

  static async fetchAndSeedOSM(longitude: number, latitude: number) {
    try {
      const keys = Object.keys(osmMapping);
      let queryBody = '';
      keys.forEach(tag => {
        const [k, v] = tag.split('=');
        queryBody += `node["${k}"="${v}"](around:500,${latitude},${longitude});`;
        queryBody += `way["${k}"="${v}"](around:500,${latitude},${longitude});`;
      });
      
      const query = `[out:json][timeout:10];(${queryBody});out center;`;
      const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (!data || !data.elements) return [];

      const newNodes: any[] = [];
      const localQuests: any[] = [];

      data.elements.forEach((el: any) => {
        if (!el.tags) return;
        
        let matchedMapping = null;
        for (const tag of keys) {
          const [k, v] = tag.split('=');
          if (el.tags[k] === v) {
            matchedMapping = (osmMapping as any)[tag];
            break;
          }
        }
        
        if (!matchedMapping) return;

        const lat = el.lat || el.center?.lat;
        const lon = el.lon || el.center?.lon;
        if (!lat || !lon) return;

        const osmId = el.type + '_' + el.id;
        
        newNodes.push({
          osm_id: osmId,
          type: matchedMapping.type,
          location: `POINT(${lon} ${lat})`,
          metadata: matchedMapping
        });

        localQuests.push({
          id: osmId, // In DB UUID, locally temporary
          type: matchedMapping.type,
          distance_meters: getDistance(latitude, longitude, lat, lon),
          location: { type: 'Point', coordinates: [lon, lat] },
          data: matchedMapping
        });
      });

      if (newNodes.length > 0) {
        supabase.from('world_nodes').upsert(newNodes, { onConflict: 'osm_id' })
          .then(({error}) => { if (error) console.error("OSM Sync Error:", error) });
      }

      return localQuests;
    } catch (e) {
      console.error("fetchAndSeedOSM error", e);
      return [];
    }
  }
