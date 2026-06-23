import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export const useLocation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [heading, setHeading] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let subscription: Location.LocationSubscription;
    let headingSub: Location.LocationSubscription;

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // 1. Schnelle initiale Position holen, damit der Ladescreen sofort verschwindet
      try {
        let initialLoc = await Location.getLastKnownPositionAsync({});
        if (!initialLoc) {
          // Fallback, falls keine letzte Position bekannt ist (Balanced = schneller als High)
          initialLoc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        }
        if (initialLoc) {
          setLocation(initialLoc);
        }
      } catch (e) {
        console.warn("Initial location fetch failed", e);
      }

      // 2. Danach den hochpräzisen Watcher starten
      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // Trigger alle 5 Sekunden
          distanceInterval: 10, // Oder bei Bewegung von >10 Metern
        },
        (loc) => {
          setLocation(loc);
        }
      );

      // 3. Kompass (Blickrichtung) abfragen
      headingSub = await Location.watchHeadingAsync((head) => {
        setHeading(head.trueHeading !== -1 ? head.trueHeading : head.magHeading);
      });
    })();

    return () => {
      if (subscription) {
        subscription.remove();
      }
      if (headingSub) {
        headingSub.remove();
      }
    };
  }, []);

  return { location, heading, errorMsg };
};
