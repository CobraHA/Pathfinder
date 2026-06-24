import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, ScrollView, Animated, Platform, PanResponder, Dimensions, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polygon, Callout, PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';

const FloatingText = ({ text, subtext, icon, iconColor, onComplete }) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 150, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(translateY, { toValue: -60, duration: 2000, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 1500, delay: 500, useNativeDriver: true })
      ])
    ]).start(() => {
      onComplete();
    });
  }, []);

  return (
    <Animated.View style={{
      transform: [{ translateY }, { scale: opacity.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }],
      opacity,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
      backgroundColor: 'rgba(25, 18, 13, 0.95)',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: 'rgba(233, 188, 98, 0.3)',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.6,
      shadowRadius: 5,
      elevation: 6,
      flexDirection: 'row'
    }}>
      {!!icon && (
        <View style={{ marginRight: 8 }}>
          <MaterialCommunityIcons name={icon} size={20} color={iconColor || '#A5D6A7'} />
        </View>
      )}
      <View style={{ alignItems: 'flex-start' }}>
        <Text style={{ fontSize: 16, fontWeight: '800', color: '#A5D6A7', letterSpacing: 0.5 }}>{text}</Text>
        {subtext ? <Text style={{ fontSize: 12, color: '#A67B38', marginTop: 3, fontWeight: '600', fontStyle: 'italic' }}>{subtext}</Text> : null}
      </View>
    </Animated.View>
  );
};
import { useLocation } from '../hooks/useLocation';
import { useFocusEffect } from '@react-navigation/native';
import { QuestEngine } from '../services/QuestEngine';
import { InventoryEngine } from '../services/InventoryEngine';
import { QuestLogEngine } from '../services/QuestLogEngine';
import { NodeStateEngine } from '../services/NodeStateEngine';
import { SurvivalEngine } from '../services/SurvivalEngine';
import { PinEngine } from '../services/PinEngine';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import i18n from '../i18n';
import RoleSelectionModal from '../components/RoleSelectionModal';
import ProfileModal from '../components/ProfileModal';
import { RoleEngine } from '../services/RoleEngine';
import { LevelEngine } from '../services/LevelEngine';
import union from '@turf/union';
import { featureCollection, polygon } from '@turf/helpers';
import circle from '@turf/circle';

// Helper to create a fast, stable square polygon for turf union
const createSquare = (lon, lat, radiusInMeters) => {
  const dLat = radiusInMeters / 111320;
  const dLon = radiusInMeters / (111320 * Math.cos(lat * (Math.PI / 180)));
  // LinearRing must be closed (first and last coordinate the same)
  return polygon([[
    [lon - dLon, lat - dLat], // SW
    [lon + dLon, lat - dLat], // SE
    [lon + dLon, lat + dLat], // NE
    [lon - dLon, lat + dLat], // NW
    [lon - dLon, lat - dLat]  // SW
  ]]);
};

// Medieval Map Style
const mapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#ebe3cd" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#523735" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#f5f1e6" }] },
  { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{ "color": "#c9b2a6" }] },
  { "featureType": "administrative.land_parcel", "elementType": "geometry.stroke", "stylers": [{ "color": "#dcd2be" }] },
  { "featureType": "administrative.land_parcel", "elementType": "labels.text.fill", "stylers": [{ "color": "#ae9e90" }] },
  { "featureType": "landscape.natural", "elementType": "geometry", "stylers": [{ "color": "#dfd2ae" }] },
  { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#dfd2ae" }] },
  { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#93817c" }] },
  { "featureType": "poi.park", "elementType": "geometry.fill", "stylers": [{ "color": "#a5b076" }] },
  { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#447530" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#f5f1e6" }] },
  { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#fdfcf8" }] },
  { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#f8c967" }] },
  { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#e9bc62" }] },
  { "featureType": "road.highway.controlled_access", "elementType": "geometry", "stylers": [{ "color": "#e98d58" }] },
  { "featureType": "road.highway.controlled_access", "elementType": "geometry.stroke", "stylers": [{ "color": "#db8555" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#b9d3c2" }] }
];

const MemoizedQuestMarker = React.memo(({ q, qLat, qLon, effectiveLocation, onPress }) => {
  const isNPC = q.type === 'npc';
  const isWorkbench = q.type === 'workbench';
  const isColdCampfire = q.type === 'cold_campfire';
  const isShop = q.type === 'shop';
  const isQuest = q.type === 'quest';
  const isChest = q.type === 'chest';
  const isTreasureMark = q.type === 'treasure_mark';

  let iconName = 'map-marker';
  let iconColor = '#228B22';
  let bgColor = 'rgba(20, 30, 20, 0.9)';

  if (isNPC) {
    iconName = 'account'; iconColor = '#E9BC62'; bgColor = 'rgba(62, 39, 35, 0.9)';
  } else if (isColdCampfire) {
    iconName = 'campfire'; iconColor = '#A9A9A9'; bgColor = 'rgba(62, 39, 35, 0.9)';
  } else if (isWorkbench) {
    if (q.title === 'map.markers.campfire') { iconName = 'campfire'; iconColor = '#FF4500'; }
    else { iconName = 'anvil'; iconColor = '#E9BC62'; }
    bgColor = 'rgba(62, 39, 35, 0.9)';
  } else if (isShop) {
    iconName = 'storefront-outline'; iconColor = '#E9BC62'; bgColor = 'rgba(62, 39, 35, 0.9)';
  } else if (isQuest) {
    iconName = 'star'; iconColor = '#FFD700'; bgColor = 'rgba(62, 39, 35, 0.9)';
  } else if (isChest) {
    iconName = 'treasure-chest'; iconColor = '#FFD700'; bgColor = 'rgba(80, 20, 20, 0.9)';
  } else if (isTreasureMark) {
    iconName = 'close'; iconColor = '#FF0000'; bgColor = 'rgba(50, 10, 10, 0.9)';
  } else if (q.type === 'resource') {
    const itemId = q.data?.resource?.itemId;
    bgColor = 'rgba(20, 25, 30, 0.9)';
    switch (itemId) {
      case 'clean_water': case 'dirty_water': case 'water_flask': iconName = 'water'; iconColor = '#4169E1'; break;
      case 'iron_ore': iconName = 'diamond-stone'; iconColor = '#A9A9A9'; break;
      case 'herb_root': iconName = 'sprout'; iconColor = '#32CD32'; break;
      case 'wood_log': iconName = 'tree'; iconColor = '#D2691E'; break;
      case 'stone_block': iconName = 'cube-outline'; iconColor = '#808080'; break;
      case 'berries': iconName = 'fruit-cherries'; iconColor = '#FF1493'; break;
      case 'mushrooms': iconName = 'mushroom'; iconColor = '#FF6347'; break;
      case 'salt_water': iconName = 'water-percent'; iconColor = '#4169E1'; break;
      case 'flint': iconName = 'flare'; iconColor = '#D3D3D3'; break;
      case 'salt': iconName = 'shaker'; iconColor = '#FFFFFF'; break;
      case 'bread': iconName = 'baguette'; iconColor = '#D2B48C'; break;
      case 'raw_meat': iconName = 'food-steak'; iconColor = '#CD5C5C'; break;
      case 'roasted_meat': iconName = 'food-drumstick'; iconColor = '#8B4513'; break;
      default: iconName = 'package-variant'; iconColor = '#E9BC62'; break;
    }
  }

  const markerTitle = i18n.t(q.title, { defaultValue: q.title });
  const markerDesc = isTreasureMark ? i18n.t('map.markers.treasure_mark', { defaultValue: 'Verborgener Schatz' }) : isChest ? (q.data?.isLocked ? i18n.t('chest.locked_title') : i18n.t('chest.title')) : isNPC ? i18n.t('map.tapToSpeak') : isWorkbench ? i18n.t('map.openWorkbench', { defaultValue: 'Werkbank öffnen' }) : q.type === 'cold_campfire' ? i18n.t('map.igniteCampfire', { defaultValue: 'Mit Feuerstein anzünden' }) : isShop ? i18n.t('map.enterShop', { defaultValue: 'Betreten' }) : q.type === 'resource' ? i18n.t('map.gather') : (q.data?.desc || q.desc) ? i18n.t((q.data?.desc || q.desc), { defaultValue: (q.data?.desc || q.desc) }) : '';

  return (
    <Marker
      key={q.id}
      tracksViewChanges={Platform.OS === 'android'}
      coordinate={{
        latitude: qLat || (effectiveLocation.coords.latitude + 0.001),
        longitude: qLon || (effectiveLocation.coords.longitude + 0.001)
      }}
      onPress={() => onPress && onPress(q)}
    >
      <View style={{
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: bgColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: iconColor,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
      }} pointerEvents="none">
        <MaterialCommunityIcons name={iconName} size={18} color={iconColor} />
      </View>
      <Callout>
        <View style={{ padding: 4, alignItems: 'center', minWidth: 140, maxWidth: 220 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 13, marginBottom: 2, textAlign: 'center' }}>{markerTitle}</Text>
          <Text style={{ fontSize: 11, color: '#444', textAlign: 'center', }}>{markerDesc}</Text>
          {q.distance_meters > 50 && (
            <Text style={{ color: '#D32F2F', fontWeight: 'bold', marginTop: 3, fontSize: 11 }}>
              {Math.round(q.distance_meters)}m
            </Text>
          )}
        </View>
      </Callout>
    </Marker>
  );
}, (prev, next) => {
  return prev.q.id === next.q.id && prev.qLat === next.qLat && prev.qLon === next.qLon && prev.q.distance_meters === next.q.distance_meters;
});

export default function MapScreen() {
  const { location, heading, errorMsg } = useLocation();
  const [quests, setQuests] = useState([]);
  const [markerTracksView, setMarkerTracksView] = useState({});

  // Workaround für Android React Native Maps: Marker brauchen kurz TracksViewChanges=true um ihr Icon zu rendern,
  // danach muss es auf false, um Performance zu sparen. 
  // Wir tracken das pro Marker-ID, damit bei Bewegung nicht alle Marker neuladen (was zu OOM/Crashes führt).
  useEffect(() => {
    let hasNew = false;
    const nextTracks = { ...markerTracksView };
    const toTurnFalse = [];

    quests.forEach(q => {
      if (nextTracks[q.id] === undefined) {
        nextTracks[q.id] = true;
        toTurnFalse.push(q.id);
        hasNew = true;
      }
    });

    if (hasNew) {
      setMarkerTracksView(nextTracks);
      const timeout = setTimeout(() => {
        setMarkerTracksView(prev => {
          const finalTracks = { ...prev };
          toTurnFalse.forEach(id => finalTracks[id] = false);
          return finalTracks;
        });
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [quests]);
  const [supabaseError, setSupabaseError] = useState(null);
  const navigation = useNavigation();

  // Dialog State
  const [activeNPC, setActiveNPC] = useState(null);
  const [activeChest, setActiveChest] = useState(null);
  const [activeQuest, setActiveQuest] = useState(null);
  const [chestLootResult, setChestLootResult] = useState(null);
  const [dialogNode, setDialogNode] = useState('start');


  const [isGatheringWater, setIsGatheringWater] = useState(false);
  const [isNearWater, setIsNearWater] = useState(false);
  const [isNearWell, setIsNearWell] = useState(false);
  const [isGatheringMushrooms, setIsGatheringMushrooms] = useState(false);
  const [isNearForest, setIsNearForest] = useState(false);

  const [animatingNodes, setAnimatingNodes] = useState({});
  const [floatingTexts, setFloatingTexts] = useState([]);

  const [survivalStats, setSurvivalStats] = useState({ hunger: 100, thirst: 100 });
  const [isQuestListVisible, setIsQuestListVisible] = useState(false);
  const [isRoleSelectionVisible, setIsRoleSelectionVisible] = useState(false);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [playerLevel, setPlayerLevel] = useState(1);
  const [pinnedQuestId, setPinnedQuestId] = useState(null);
  const [activeQuestIds, setActiveQuestIds] = useState([]);
  const [mapRegion, setMapRegion] = useState(null);
  const [sortMode, setSortMode] = useState('distance'); // 'distance', 'name', 'type'
  const [sortAscending, setSortAscending] = useState(true);
  const mapRef = useRef(null);

  useEffect(() => {
    // Check role and level at startup
    RoleEngine.loadRole().then(role => {
      if (!role) setIsRoleSelectionVisible(true);
    });
    LevelEngine.getStats().then(s => setPlayerLevel(s.level));
  }, []);

  const showFloatingText = (text, icon = 'check-circle', color = '#4CAF50') => {
    const id = Date.now().toString() + Math.random().toString();
    setFloatingTexts(prev => [...prev, { id, text, icon, iconColor: color }]);
  };

  const handleGainXP = async (amount, source) => {
    const { leveledUp, newLevel } = await LevelEngine.addXP(amount, source);
    if (leveledUp) {
      setPlayerLevel(newLevel);
      showFloatingText(`LEVEL UP! Du bist nun Level ${newLevel}!`, 'chevrons-up', '#FFD700');
    }
  };



  const fillWater = async () => {
    setIsGatheringWater(true);
    try {
      const isClean = isNearWell;
      const waterId = isClean ? 'clean_water' : 'dirty_water';
      const waterName = isClean ? 'Trinkwasser' : 'Dreckwasser';

      await InventoryEngine.addItem({
        id: waterId,
        name: waterName,
        type: 'consumable'
      }, 1);
    } catch (e) {
    }
    setIsGatheringWater(false);
  };

  const gatherMushrooms = async () => {
    setIsGatheringMushrooms(true);
    try {
      await InventoryEngine.addItem({
        id: 'mushrooms',
        name: 'Pilze',
        type: 'consumable'
      }, 1);
    } catch (e) {
    }
    setIsGatheringMushrooms(false);
  };

  // Joystick State
  const [joystickOffset, setJoystickOffset] = useState({ lat: 0, lon: 0 });
  const joystickThumb = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const joystickActive = useRef(false);
  const joystickVector = useRef({ dx: 0, dy: 0 });
  const lastFetchRef = useRef(0);
  const lastUpdateLocRef = useRef(null);

  const lastWaterCheckRef = useRef({ lat: 0, lon: 0 });
  const lastDrainCheckRef = useRef({ lat: 0, lon: 0 });

  const checkEnvironmentInOSMBackground = async (latitude, longitude) => {
    // Check Water
    try {
      const queryWater = `[out:json];(way["natural"="water"](around:50,${latitude},${longitude});relation["natural"="water"](around:50,${latitude},${longitude});way["waterway"](around:50,${latitude},${longitude});relation["waterway"](around:50,${latitude},${longitude});way["landuse"="basin"](around:50,${latitude},${longitude});way["landuse"="reservoir"](around:50,${latitude},${longitude});node["natural"="spring"](around:50,${latitude},${longitude}););out count;`;
      const responseWater = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(queryWater)}`);
      const dataWater = await responseWater.json();
      if (dataWater && dataWater.elements && dataWater.elements.length > 0 && dataWater.elements[0].tags) {
        const counts = dataWater.elements[0].tags;
        setIsNearWater((counts.nodes && parseInt(counts.nodes) > 0) || (counts.ways && parseInt(counts.ways) > 0) || (counts.relations && parseInt(counts.relations) > 0));
      } else {
        setIsNearWater(false);
      }

      // Check Well
      const queryWell = `[out:json];(node["amenity"="drinking_water"](around:50,${latitude},${longitude});node["man_made"="water_well"](around:50,${latitude},${longitude}););out count;`;
      const responseWell = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(queryWell)}`);
      const dataWell = await responseWell.json();
      if (dataWell && dataWell.elements && dataWell.elements.length > 0 && dataWell.elements[0].tags) {
        const counts = dataWell.elements[0].tags;
        setIsNearWell((counts.nodes && parseInt(counts.nodes) > 0));
      } else {
        setIsNearWell(false);
      }
    } catch (e) {
      setIsNearWater(false);
      setIsNearWell(false);
    }

    // Check Forest
    try {
      const queryForest = `[out:json];(way["landuse"="forest"](around:50,${latitude},${longitude});way["natural"="wood"](around:50,${latitude},${longitude});relation["landuse"="forest"](around:50,${latitude},${longitude});relation["natural"="wood"](around:50,${latitude},${longitude}););out count;`;
      const responseForest = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(queryForest)}`);
      const dataForest = await responseForest.json();
      if (dataForest && dataForest.elements && dataForest.elements.length > 0 && dataForest.elements[0].tags) {
        const counts = dataForest.elements[0].tags;
        setIsNearForest((counts.nodes && parseInt(counts.nodes) > 0) || (counts.ways && parseInt(counts.ways) > 0) || (counts.relations && parseInt(counts.relations) > 0));
      } else {
        setIsNearForest(false);
      }
    } catch (e) {
      setIsNearForest(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      SurvivalEngine.getStats().then(stats => setSurvivalStats(stats));
      PinEngine.getPinnedNodeId().then(pinId => {
        setPinnedQuestId(pinId);
        QuestLogEngine.getQuests().then(async quests => {
          const activeIds = quests.filter(q => q.status === 'active').map(q => q.id.replace('quest_', ''));
          setActiveQuestIds(activeIds);

          const idsToFetch = [...activeIds];
          if (pinId && !idsToFetch.includes(pinId)) idsToFetch.push(pinId);

          if (idsToFetch.length > 0) {
            const data = await QuestEngine.getNodesByIds(idsToFetch);
            if (data && data.length > 0) {
              setQuests(prev => {
                const map = new Map();
                prev.forEach(p => map.set(p.id, p));
                data.forEach(parsedNode => {
                  if (!map.has(parsedNode.id)) {
                    map.set(parsedNode.id, parsedNode);
                  }
                });
                return Array.from(map.values());
              });
            }
          }
        });
      });
    }, [])
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (joystickActive.current) {
        setJoystickOffset(prev => ({
          lat: prev.lat - (joystickVector.current.dy * 0.000012),
          lon: prev.lon + (joystickVector.current.dx * 0.000012),
        }));
      }
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        joystickActive.current = true;
      },
      onPanResponderMove: (evt, gestureState) => {
        const maxDist = 30;
        const dist = Math.sqrt(gestureState.dx * gestureState.dx + gestureState.dy * gestureState.dy);
        let dx = gestureState.dx;
        let dy = gestureState.dy;
        if (dist > maxDist) {
          dx = (dx / dist) * maxDist;
          dy = (dy / dist) * maxDist;
        }
        joystickVector.current = { dx, dy };
        joystickThumb.setValue({ x: dx, y: dy });
      },
      onPanResponderRelease: () => {
        joystickActive.current = false;
        joystickVector.current = { dx: 0, dy: 0 };
        Animated.spring(joystickThumb, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
          speed: 20
        }).start();
      },
    })
  ).current;

  // Compute effective location
  const effectiveLocation = location ? {
    ...location,
    coords: {
      ...location.coords,
      latitude: location.coords.latitude + joystickOffset.lat,
      longitude: location.coords.longitude + joystickOffset.lon,
    }
  } : null;

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const handleNPCInteraction = async (npc) => {
    let nodeLat = npc.location?.coordinates?.[1];
    let nodeLon = npc.location?.coordinates?.[0];

    // Safety check if location is stringified
    if (typeof npc.location === 'string') {
      try {
        const parsed = JSON.parse(npc.location);
        nodeLat = parsed?.coordinates?.[1];
        nodeLon = parsed?.coordinates?.[0];
      } catch (e) { }
    }

    if (!nodeLat || !nodeLon) {
      alert("Fehler: Position des Ziels ist ungültig.");
      return;
    }

    const currentDist = getDistance(
      effectiveLocation.coords.latitude,
      effectiveLocation.coords.longitude,
      nodeLat,
      nodeLon
    );
    const maxDist = RoleEngine.getInteractionDistance();
    if (currentDist > maxDist) {
      //Alert.alert(i18n.t('map.too_far_title'), i18n.t('map.too_far_desc', { defaultValue: `Du musst näher ran! (Maximal ${maxDist}m)` }));
      return;
    }

    if (npc.type === 'quest') {
      setActiveQuest(npc);
      return;
    }

    if (npc.type === 'cold_campfire') {
      const hasFlint = await InventoryEngine.hasItem('flint', 1);
      const hasWood = await InventoryEngine.hasItem('wood_log', 1);

      if (hasFlint && hasWood) {
        await InventoryEngine.removeItem('flint', 1);
        await InventoryEngine.removeItem('wood_log', 1);

        alert(i18n.t('map.campfire_ignited', { defaultValue: 'Du hast das Lagerfeuer mit Holz und Feuerstein entzündet!' }));

        // Change the local state of quests so it stays lit
        setQuests(prev => prev.map(q => q.id === npc.id ? { ...q, type: 'workbench', title: 'map.markers.campfire' } : q));

        navigation.navigate('Crafting');
      } else if (hasFlint) {
        alert(i18n.t('map.need_wood', { defaultValue: 'Du benötigst Holz, um dieses Lagerfeuer zu entzünden.' }));
      } else if (hasWood) {
        alert(i18n.t('map.need_flint', { defaultValue: 'Du benötigst einen Feuerstein, um dieses Lagerfeuer zu entzünden.' }));
      } else {
        alert(i18n.t('map.need_flint_and_wood', { defaultValue: 'Du benötigst Holz und einen Feuerstein, um dieses Lagerfeuer zu entzünden.' }));
      }
      return;
    }

    if (npc.type === 'workbench') {
      navigation.navigate('Crafting');
      return;
    }

    if (npc.type === 'shop') {
      navigation.navigate('Shop');
      return;
    }

    if (npc.type === 'resource') {
      const res = npc.data.resource;
      if (res) {
        const minAmt = res.minAmount || 1;
        const maxAmt = res.maxAmount || 3;
        const actualAmount = Math.floor(Math.random() * (maxAmt - minAmt + 1)) + minAmt;

        let finalItemId = res.itemId;
        let finalType = res.type;
        if (finalItemId === 'stale_bread') {
          const rand = Math.random();
          if (rand < 0.2) finalItemId = 'bread'; // 20% fresh bread
          else if (rand < 0.6) finalItemId = 'stale_bread'; // 40% stale
          else finalItemId = 'moldy_bread'; // 40% moldy
          finalType = 'consumable';
        }

        NodeStateEngine.gatherNode(npc.id, res.maxGathers || 3).then(({ gathersLeft, isDepleted }) => {
          InventoryEngine.addItem({ id: finalItemId, name: res.name, type: finalType }, actualAmount).then(() => {
            const translatedName = i18n.t(`items.${finalItemId}`, { defaultValue: res.name });
            const floatingId = Date.now().toString() + Math.random().toString();

            let iconName = 'leaf';
            let iconColor = '#A5D6A7';
            switch (finalItemId) {
              case 'wood_log': iconName = 'tree'; iconColor = '#8D6E63'; break;
              case 'iron_ore': iconName = 'diamond-stone'; iconColor = '#B0BEC5'; break;
              case 'clean_water': iconName = 'water'; iconColor = '#6495ED'; break;
              case 'dirty_water': iconName = 'water-off'; iconColor = '#5D4037'; break;
              case 'mushrooms': iconName = 'mushroom'; iconColor = '#9C27B0'; break;
              case 'berries': iconName = 'fruit-cherries'; iconColor = '#E91E63'; break;
              case 'herb_root': iconName = 'sprout'; iconColor = '#4CAF50'; break;
              case 'bread': iconName = 'baguette'; iconColor = '#E9BC62'; break;
              case 'stale_bread': iconName = 'baguette'; iconColor = '#8D6E63'; break;
              case 'moldy_bread': iconName = 'baguette'; iconColor = '#4CAF50'; break;
              case 'medicine': iconName = 'pill'; iconColor = '#FFCDD2'; break;
              case 'coffee_beans': iconName = 'seed'; iconColor = '#5D4037'; break;
              case 'burger': iconName = 'hamburger'; iconColor = '#FF9800'; break;
              case 'canned_beans': iconName = 'food-apple'; iconColor = '#9E9E9E'; break;
              case 'flower': iconName = 'flower'; iconColor = '#E91E63'; break;
              case 'gold_coin': iconName = 'coin'; iconColor = '#FFD700'; break;
              case 'beer': iconName = 'beer'; iconColor = '#FFC107'; break;
              case 'book': iconName = 'book-open-page-variant'; iconColor = '#795548'; break;
              case 'fabric': iconName = 'tshirt-crew'; iconColor = '#00BCD4'; break;
              case 'gasoline': iconName = 'gas-station'; iconColor = '#607D8B'; break;
            }

            if (isDepleted) {
              setFloatingTexts(prev => [...prev, {
                id: floatingId,
                text: `+${actualAmount} ${translatedName}`,
                subtext: i18n.t('inventory.collected_depleted_subtext', { defaultValue: 'Ressource erschöpft' }),
                icon: iconName,
                iconColor: iconColor
              }]);

              const scaleAnim = new Animated.Value(1);
              setAnimatingNodes(prev => ({ ...prev, [npc.id]: scaleAnim }));

              Animated.sequence([
                Animated.timing(scaleAnim, { toValue: 1.5, duration: 400, useNativeDriver: true }),
                Animated.timing(scaleAnim, { toValue: 0.8, duration: 300, useNativeDriver: true }),
                Animated.timing(scaleAnim, { toValue: 1.5, duration: 400, useNativeDriver: true }),
                Animated.timing(scaleAnim, { toValue: 0, duration: 600, useNativeDriver: true })
              ]).start(() => {
                setQuests(prev => prev.filter(q => q.id !== npc.id));
                setAnimatingNodes(prev => {
                  const next = { ...prev };
                  delete next[npc.id];
                  return next;
                });
              });
            } else {
              setFloatingTexts(prev => [...prev, {
                id: floatingId,
                text: `+${actualAmount} ${translatedName}`,
                subtext: i18n.t('inventory.collected_more_subtext', { defaultValue: `Noch ${gathersLeft}x möglich` }),
                icon: iconName,
                iconColor: iconColor
              }]);
            }
            handleGainXP(5, 'gather');
          });
        });
      }
      return;
    }
    const questId = `quest_${npc.id}`;
    if (npc.type === 'npc') {
      const isCompleted = await QuestLogEngine.isQuestCompleted(questId);
      const isActive = await QuestLogEngine.hasQuest(questId);

      setActiveNPC(npc);

      if (isCompleted) {
        setDialogNode('quest_already_completed');
      } else if (isActive) {
        const allQuests = await QuestLogEngine.getQuests();
        const activeQuest = allQuests.find(q => q.id === questId);
        if (activeQuest && activeQuest.requirement) {
          const req = activeQuest.requirement;
          const inventory = await InventoryEngine.getInventory();
          const invItem = inventory.find(i => i.id === req.itemId);
          const hasAmount = invItem ? invItem.quantity : 0;
          const turnedIn = activeQuest.turnedInAmount || 0;
          if (hasAmount + turnedIn >= req.amount) {
            setActiveNPC(npc);
            await handleDialogOption({ next: 'complete_quest' }, npc);
            return;
          }
        }
        setDialogNode('check_quest_progress');
      } else {
        const req = npc.data?.dialog?.accept_quest?.questRequirement;
        if (req) {
          const inventory = await InventoryEngine.getInventory();
          const invItem = inventory.find(i => i.id === req.itemId);
          const hasAmount = invItem ? invItem.quantity : 0;
          if (hasAmount >= req.amount) {
            const modifiedNpc = {
              ...npc,
              data: {
                ...npc.data,
                dialog: {
                  ...npc.data.dialog,
                  start: {
                    ...npc.data.dialog.start,
                    options: [
                      ...(npc.data.dialog.start.options || []),
                      { label: "npc.common.already_have_items", next: "fast_complete_node" }
                    ]
                  },
                  fast_complete_node: {
                    text: npc.data.dialog.complete_quest?.text || "Perfekt! Hier ist dein Lohn.",
                    action: "fast_complete_quest",
                    questRequirement: req,
                    xpReward: npc.data.dialog.accept_quest?.xpReward,
                    rewardItem: npc.data.dialog.accept_quest?.rewardItem,
                    questTitle: npc.data.dialog.accept_quest?.questTitle,
                    questDesc: npc.data.dialog.accept_quest?.questDesc,
                    options: [{ label: "npc.common.you_are_welcome", next: "end" }]
                  }
                }
              }
            };
            setActiveNPC(modifiedNpc);
            setDialogNode('start');
            return;
          }
        }
        setActiveNPC(npc);
        setDialogNode('start');
      }
      return;
    }

    setActiveNPC(npc);
    setDialogNode('start');
  };

  const handleOpenChest = async (method) => {
    if (!activeChest) return;
    const nodeLat = activeChest.location?.coordinates[1];
    const nodeLon = activeChest.location?.coordinates[0];
    const currentDist = getDistance(
      effectiveLocation.coords.latitude,
      effectiveLocation.coords.longitude,
      nodeLat,
      nodeLon
    );
    const maxDist = RoleEngine.getInteractionDistance();
    if (currentDist > maxDist) {
      //.alert(i18n.t('map.too_far_title'), i18n.t('map.too_far_desc', { defaultValue: `Du musst näher ran! (Maximal ${maxDist}m)` }));
      return;
    }

    if (method === 'lockpick') {
      const hasLockpick = await InventoryEngine.hasItem('lockpick', 1);
      if (!hasLockpick) {
        alert(i18n.t('chest.no_lockpick'));
        return;
      }
      await InventoryEngine.removeItem('lockpick', 1);
    }

    if (method === 'ad') {
      alert(i18n.t('chest.ad_error'));
      return; // Do not open the chest, ad failed
    }

    // Determine Loot
    let lootId = 'copper_coins';
    let lootAmount = 1;
    let lootType = 'material';
    let lootName = 'copper_coins';

    const rand = Math.random();

    if (method === 'lockpick') {
      if (rand < 0.4) { lootId = 'copper_coins'; lootAmount = Math.floor(Math.random() * 15) + 10; }
      else if (rand < 0.7) { lootId = 'healing_potion'; lootAmount = 1; lootType = 'consumable'; lootName = 'Heiltrank'; }
      else if (rand < 0.9) { lootId = 'iron_ingot'; lootAmount = 2; lootType = 'material'; lootName = 'Eisenbarren'; }
      else { lootId = 'bandit_amulet'; lootAmount = 1; lootType = 'quest_item'; lootName = 'Banditen-Amulett'; }
    } else {
      if (rand < 0.6) { lootId = 'copper_coins'; lootAmount = Math.floor(Math.random() * 5) + 1; }
      else if (rand < 0.8) { lootId = 'wood_log'; lootAmount = 2; lootType = 'material'; lootName = 'Holzstamm'; }
      else { lootId = 'berries'; lootAmount = 3; lootType = 'consumable'; lootName = 'Beeren'; }
    }

    await InventoryEngine.addItem({ id: lootId, name: lootName, type: lootType }, lootAmount);
    handleGainXP(20, 'chest');

    QuestEngine.removeChest(activeChest.id);
    await QuestLogEngine.completeQuest('quest_' + activeChest.id);

    setQuests(prev => prev.filter(q => q.id !== activeChest.id));
    setActiveChest(null);

    const translatedName = i18n.t(`items.${lootId}`, { defaultValue: lootName });

    let icon = 'package-variant';
    let iconColor = '#FFD700';
    switch (lootId) {
      case 'copper_coins': icon = 'circle-multiple'; iconColor = '#E9BC62'; break;
      case 'healing_potion': icon = 'flask'; iconColor = '#FF6B6B'; break;
      case 'iron_ingot': icon = 'gold'; iconColor = '#B0BEC5'; break;
      case 'bandit_amulet': icon = 'necklace'; iconColor = '#9C27B0'; break;
      case 'wood_log': icon = 'tree'; iconColor = '#8D6E63'; break;
      case 'berries': icon = 'fruit-cherries'; iconColor = '#E91E63'; break;
    }

    setChestLootResult({
      amount: lootAmount,
      name: translatedName,
      icon: icon,
      color: iconColor
    });
  };

  const handleDialogOption = async (option, npcTarget = activeNPC) => {
    if (option.action === 'trade_iron') {
      const hasIron = await InventoryEngine.hasItem('iron_ore', 3);
      if (hasIron) {
        await InventoryEngine.removeItem('iron_ore', 3);
        await InventoryEngine.addItem({ id: 'sword', name: 'Breitschwert', type: 'quest_item' }, 1);
        alert(i18n.t('inventory.traded_iron'));
        setActiveNPC(null);
      } else {
        alert(i18n.t('inventory.not_enough_iron'));
      }
      return;
    }

    if (option.action === 'trade_bread') {
      const hasBread = await InventoryEngine.hasItem('bread', 1);
      const hasSalt = await InventoryEngine.hasItem('salt', 1);
      if (hasBread || hasSalt) {
        if (hasBread) await InventoryEngine.removeItem('bread', 1);
        else await InventoryEngine.removeItem('salt', 1);

        await InventoryEngine.addItem({ id: 'healing_potion', name: 'Heiltrank', type: 'consumable' }, 1);
        alert(i18n.t('inventory.traded_bread', { defaultValue: 'Du hast geholfen und einen Heiltrank erhalten!' }));
        setActiveNPC(null);
      } else {
        alert(i18n.t('inventory.not_enough_bread', { defaultValue: 'Du hast kein Brot und kein Salz dabei...' }));
      }
      return;
    }

    if (option.next && option.next !== 'end') {
      const nextNode = npcTarget?.data?.dialog?.[option.next];
      if (nextNode?.action === 'give_quest') {
        const questId = `quest_${npcTarget?.id}`;
        const added = await QuestLogEngine.addQuest({
          id: questId,
          npcId: npcTarget?.id || 'unknown',
          titleKey: nextNode?.questTitle || `quest_title_${npcTarget?.id}`,
          descKey: nextNode?.questDesc || `quest_desc_${npcTarget?.id}`,
          requirement: nextNode?.questRequirement,
          rewardXP: nextNode?.xpReward || 50,
          rewardItem: nextNode?.rewardItem
        });
        if (added) {
          setActiveQuestIds(prev => {
            if (!prev.includes(npcTarget?.id)) return [...prev, npcTarget?.id];
            return prev;
          });
        }
      } else if (nextNode?.action === 'fast_complete_quest') {
        const questId = `quest_${npcTarget?.id}`;
        
        await QuestLogEngine.addQuest({
          id: questId,
          npcId: npcTarget?.id || 'unknown',
          titleKey: nextNode?.questTitle || `quest_title_${npcTarget?.id}`,
          descKey: nextNode?.questDesc || `quest_desc_${npcTarget?.id}`,
          requirement: nextNode?.questRequirement,
          rewardXP: nextNode?.xpReward || 50,
          rewardItem: nextNode?.rewardItem
        });

        const req = nextNode?.questRequirement;
        if (req) {
          await InventoryEngine.removeItem(req.itemId, req.amount);
          await QuestLogEngine.addProgress(questId, req.amount);
        }

        const itemRewardId = nextNode?.rewardItem || 'copper_coins';
        const xpGained = nextNode?.xpReward || 50;
        await InventoryEngine.addItem({ id: itemRewardId, name: itemRewardId, type: 'quest_reward' }, 1);
        await QuestLogEngine.completeQuest(questId);
        handleGainXP(xpGained, 'quest');
        
        const translatedRewardName = i18n.t(`items.${itemRewardId}`, { defaultValue: itemRewardId });
        setChestLootResult({
          amount: 1,
          name: translatedRewardName,
          icon: 'star',
          color: '#FFD700'
        });
      } else if (nextNode?.action === 'finish_quest') {
        const questId = `quest_${npcTarget?.id}`;
        const allQuests = await QuestLogEngine.getQuests();
        const activeQuest = allQuests.find(q => q.id === questId);

        let req = activeQuest?.requirement;
        if (!req) {
          if (npcTarget?.id === 'mock2') req = { itemId: 'mushrooms', amount: 3 };
          if (npcTarget?.id === 'mock3') req = { itemId: 'wood_log', amount: 5 };
        }

        if (req) {
          const turnedIn = activeQuest?.turnedInAmount || 0;
          const remaining = req.amount - turnedIn;

          const inventory = await InventoryEngine.getInventory();
          const invItem = inventory.find(i => i.id === req.itemId);
          const hasAmount = invItem ? invItem.quantity : 0;

          if (hasAmount > 0) {
            const amountToGive = Math.min(remaining, hasAmount);
            await InventoryEngine.removeItem(req.itemId, amountToGive);
            await QuestLogEngine.addProgress(questId, amountToGive);

            const newTurnedIn = turnedIn + amountToGive;
            if (newTurnedIn < req.amount) {
              const itemName = i18n.t(`items.${req.itemId}`, { defaultValue: req.itemId });
              const dynamicText = i18n.t('map.dialogs.common.partial_turn_in', {
                amount: amountToGive,
                item: itemName,
                remaining: req.amount - newTurnedIn,
                defaultValue: `Danke für %{amount}x %{item}, aber mir fehlen noch %{remaining}!`
              });
              setActiveNPC({
                ...activeNPC,
                data: {
                  ...npcTarget.data,
                  dialog: {
                    ...npcTarget.data.dialog,
                    'partial_turn_in_node': {
                      text: dynamicText,
                      options: [{ label: 'map.dialogs.common.see_you', next: 'end' }]
                    }
                  }
                }
              });
              setDialogNode('partial_turn_in_node');
              return;
            }
          } else if (remaining > 0) {
            const dynamicText = i18n.t('map.need_more_items', { defaultValue: 'Du hast nichts dabei was ich gebrauchen könnte' });
            setActiveNPC({
              ...activeNPC,
              data: {
                ...npcTarget.data,
                dialog: {
                  ...npcTarget.data.dialog,
                  'no_items_node': {
                    text: dynamicText,
                    options: [{ label: 'map.dialogs.common.see_you', next: 'end' }]
                  }
                }
              }
            });
            setDialogNode('no_items_node');
            return;
          }

          const itemRewardId = nextNode?.rewardItem || 'copper_coins';
          const xpGained = nextNode?.xpReward || 50;
          await InventoryEngine.addItem({ id: itemRewardId, name: itemRewardId, type: 'quest_reward' }, 1);
          await QuestLogEngine.completeQuest(questId);
          handleGainXP(xpGained, 'quest');
          
          const translatedRewardName = i18n.t(`items.${itemRewardId}`, { defaultValue: itemRewardId });
          setChestLootResult({
            amount: 1,
            name: translatedRewardName,
            icon: 'star',
            color: '#FFD700'
          });
        }
      }
    }

    if (option.next === 'end') {
      setActiveNPC(null);
    } else {
      setDialogNode(option.next);
    }
  };

  const centerAndReload = () => {
    if (effectiveLocation && mapRef.current) {
      const { longitude, latitude } = effectiveLocation.coords;

      // Center map
      mapRef.current.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 1000);

      // Reload quests
      console.log("[MapScreen] Fetching nearby quests..."); QuestEngine.checkNearbyQuests(longitude, latitude)
        .then(async nearbyQuests => {
          if (Array.isArray(nearbyQuests)) {
            const activeNodes = await NodeStateEngine.getActiveNodes(nearbyQuests);
            console.log(`[MapScreen] Updating quests state with ${activeNodes.length} nodes...`);
            setQuests(prev => {
              const map = new Map();
              prev.forEach(p => {
                if (p.distance_meters === undefined || p.distance_meters < 1500 || p.id === pinnedQuestId || activeQuestIds.includes(p.id)) {
                  map.set(p.id, p);
                }
              });
              activeNodes.forEach(n => map.set(n.id, n));
              return Array.from(map.values());
            });
            setSupabaseError(null);
          } else if (nearbyQuests === null || nearbyQuests === undefined) {
            // Keep existing quests instead of clearing them to prevent index crash
          }
        })
        .catch(e => {
          setSupabaseError("Supabase Quota Exceeded");
        });
    }
  };

  useEffect(() => {
    if (effectiveLocation) {

      const { longitude, latitude } = effectiveLocation.coords;
      const now = Date.now();
      let shouldUpdate = false;

      if (!lastUpdateLocRef.current) {
        shouldUpdate = true;
      } else {
        const { lat, lon } = lastUpdateLocRef.current;
        // Einfache Distanzberechnung ohne extra Library
        const R = 6371e3;
        const φ1 = lat * Math.PI / 180;
        const φ2 = latitude * Math.PI / 180;
        const Δφ = (latitude - lat) * Math.PI / 180;
        const Δλ = (longitude - lon) * Math.PI / 180;
        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        if (distance > 20) shouldUpdate = true;
      }

      if (shouldUpdate) {
        lastUpdateLocRef.current = { lat: latitude, lon: longitude };
        // Trigger backend update only on >20m move
        QuestEngine.recordMovement(longitude, latitude).catch(e => {
          console.log("Movement Record Error", e.message || e);
        });
      }

      // Update distances locally every 400ms, but only fetch from backend if we moved > 20m
      console.log(`[MapScreen] useEffect triggered. shouldUpdate: ${shouldUpdate}`); if (shouldUpdate || quests.length === 0) {
        lastFetchRef.current = now;
        QuestEngine.checkNearbyQuests(longitude, latitude)
          .then(async nearbyQuests => {
            if (Array.isArray(nearbyQuests)) {
              const activeNodes = await NodeStateEngine.getActiveNodes(nearbyQuests);
              setQuests(prev => {
                const map = new Map();
                prev.forEach(p => {
                  if (p.distance_meters === undefined || p.distance_meters < 1500 || p.id === pinnedQuestId || activeQuestIds.includes(p.id)) {
                    map.set(p.id, p);
                  }
                });
                activeNodes.forEach(n => map.set(n.id, n));
                return Array.from(map.values());
              });
              setSupabaseError(null);
            } else if (nearbyQuests === null || nearbyQuests === undefined) {
              // Keep existing quests
            }
          })
          .catch(e => {
            setSupabaseError("Supabase Quota Exceeded");
          });
      } else if (now - lastFetchRef.current > 400) {
        lastFetchRef.current = now;
        setQuests(prev => prev.map(q => {
          let qLoc = q.location;
          if (typeof qLoc === 'string') {
            try { qLoc = JSON.parse(qLoc); } catch (e) { }
          }
          let qLat = Number(qLoc?.coordinates?.[1]);
          let qLon = Number(qLoc?.coordinates?.[0]);
          return {
            ...q,
            distance_meters: (!isNaN(qLat) && !isNaN(qLon)) ? getDistance(latitude, longitude, qLat, qLon) : 9999
          };
        }));
      }

      // Background Check für Umgebung (nur alle ~100m Bewegung scannen)
      const distFromLastWaterCheck = Math.abs(lastWaterCheckRef.current.lat - latitude) + Math.abs(lastWaterCheckRef.current.lon - longitude);
      if (distFromLastWaterCheck > 0.001 || lastWaterCheckRef.current.lat === 0) {
        lastWaterCheckRef.current = { lat: latitude, lon: longitude };

        // Random Beggar Encounter (2% chance every ~100m)
        if (Math.random() < 0.02 && !activeNPC) {
          const beggarNPC = {
            id: 'random_beggar_' + Date.now(),
            type: 'npc',
            title: 'map.markers.beggar',
            data: {
              dialog: {
                start: { text: 'map.dialogs.beggar.start', options: [{ label: 'map.dialogs.common.tell_more', next: 'ask_trade' }, { label: 'map.dialogs.common.no_time', next: 'end' }] },
                ask_trade: { text: 'map.dialogs.beggar.ask_trade', options: [{ label: 'map.dialogs.common.help_quest', next: 'accept_quest' }, { label: 'map.dialogs.common.no_thanks', next: 'end' }] },
                accept_quest: { text: 'map.dialogs.beggar.accept_quest', action: 'trade_bread', options: [{ label: 'map.dialogs.common.see_you', next: 'end' }] }
              }
            }
          };
          setActiveNPC(beggarNPC);
          setDialogNode('start');
        }

        checkEnvironmentInOSMBackground(latitude, longitude);
      }

      // Survival Drain Check (alle ~50m)
      const distFromLastDrainCheck = Math.abs(lastDrainCheckRef.current.lat - latitude) + Math.abs(lastDrainCheckRef.current.lon - longitude);
      if (distFromLastDrainCheck > 0.0005 || lastDrainCheckRef.current.lat === 0) {
        lastDrainCheckRef.current = { lat: latitude, lon: longitude };
        SurvivalEngine.drainStats(50).then(stats => setSurvivalStats(stats));
      }
    }
  }, [effectiveLocation]);


  if (errorMsg) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  if (!effectiveLocation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#B8860B" />
        <Text style={styles.text}>{i18n.t('map.loading')}</Text>
        <Text style={{ color: 'white', marginTop: 20, fontSize: 10 }}>{i18n.t('map.debug_waiting_gps', { defaultValue: 'Debug: Waiting for GPS...' })}</Text>
        {errorMsg ? <Text style={{ color: 'red' }}>{errorMsg}</Text> : null}
      </View>
    );
  }

  const renderEdgeIndicator = () => {
    if (!pinnedQuestId) return null;
    const target = quests.find(q => q.id === pinnedQuestId);
    if (!target) return null;

    const centerLat = mapRegion ? mapRegion.latitude : (effectiveLocation?.coords?.latitude || 0);
    const centerLon = mapRegion ? mapRegion.longitude : (effectiveLocation?.coords?.longitude || 0);
    const latDelta = mapRegion ? mapRegion.latitudeDelta : 0.005;
    const lonDelta = mapRegion ? mapRegion.longitudeDelta : 0.005;

    if (!centerLat) return null;

    const dx = (target.location?.coordinates[0] || 0) - centerLon;
    const dy = (target.location?.coordinates[1] || 0) - centerLat;

    const { width, height } = Dimensions.get('window');
    const cx = width / 2;
    const cy = height / 2;

    // Pixel mapping exakt basierend auf der aktuellen MapRegion
    const rawX = cx + (dx / lonDelta) * width;
    const rawY = cy - (dy / latDelta) * height;

    // Ist das Ziel physisch auf dem Bildschirm sichtbar?
    const isVisible = rawX >= 0 && rawX <= width && rawY >= 0 && rawY <= height;

    if (isVisible) {
      return null; // Wenn das Ziel sichtbar ist, komplett ausblenden!
    }

    // Am Bildschirmrand klemmen (sicherer UI Bereich)
    const padX = 40;
    const padYTop = 180; // Platz für Pinned HUD
    const padYBot = 150; // Platz für Joystick

    const minX = padX;
    const maxX = width - padX;
    const minY = padYTop;
    const maxY = height - padYBot;

    const scaleX = Math.abs((rawX > cx ? maxX - cx : cx - minX) / (rawX - cx));
    const scaleY = Math.abs((rawY > cy ? maxY - cy : cy - minY) / (rawY - cy));
    const scale = Math.min(scaleX, scaleY);

    const finalX = cx + (rawX - cx) * scale;
    const finalY = cy + (rawY - cy) * scale;

    // Winkel berechnen (dx muss mit cosLat skaliert werden für den optisch korrekten Winkel)
    const cosLat = Math.cos(centerLat * Math.PI / 180);
    const angleRad = Math.atan2(-dy, dx * cosLat);
    const rotationDeg = (angleRad * 180 / Math.PI) + 90;

    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          left: finalX - 24, // Zentrieren
          top: finalY - 24,
          width: 48,
          height: 48,
          backgroundColor: 'rgba(62, 39, 35, 0.9)',
          borderRadius: 24,
          borderWidth: 2,
          borderColor: '#FFD700',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          shadowColor: '#FFD700',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 8,
        }}
        onPress={() => {
          if (mapRef.current) {
            mapRef.current.animateToRegion({
              latitude: target.location?.coordinates[1] || centerLat,
              longitude: target.location?.coordinates[0] || centerLon,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }, 1000);
          }
        }}
      >
        <Feather name="arrow-up" size={28} color="#FFD700" style={{ transform: [{ rotate: `${rotationDeg}deg` }] }} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        style={styles.map}
        customMapStyle={mapStyle}
        initialRegion={{
          latitude: effectiveLocation.coords.latitude,
          longitude: effectiveLocation.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        showsUserLocation={false}
        showsUserHeading={false}
        showsCompass={false}
        showsMyLocationButton={false}
        showsIndoorLevelPicker={false}
        showsPointsOfInterest={false}
        onRegionChange={(region) => setMapRegion(region)}
        onPress={() => {
          // Ein leerer onPress-Handler auf der MapView stellt sicher,
          // dass Touch-Events auf die Karte registriert werden und
          // native Marker-Callouts (Popups) geschlossen werden.
        }}
      >

        {/* Player Avatar */}
        <Marker
          coordinate={{
            latitude: effectiveLocation.coords.latitude,
            longitude: effectiveLocation.coords.longitude
          }}
          zIndex={999}
          tappable={false}
          flat={true}
          anchor={{ x: 0.5, y: 0.5 }}
          rotation={heading || 0}
        >
          <View style={{
            width: 32,
            height: 32,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(30,30,30,0.8)',
            borderRadius: 16,
            borderWidth: 2,
            borderColor: '#B8860B',
          }} pointerEvents="none">
            <Feather name="navigation" size={18} color="#B8860B" />
          </View>
        </Marker>

        {quests.map((q) => {
          let qLoc = q.location;
          if (typeof qLoc === 'string') {
            try { qLoc = JSON.parse(qLoc); } catch (e) { }
          }
          let qLat = Number(qLoc?.coordinates?.[1]);
          let qLon = Number(qLoc?.coordinates?.[0]);

          return (
            <MemoizedQuestMarker
              key={q.id}
              q={q}
              qLat={qLat}
              qLon={qLon}
              effectiveLocation={effectiveLocation}
              onPress={() => {
                if (q.type === 'chest' || q.type === 'treasure_mark') {
                  if (q.distance_meters > 50) {
                    //alert(i18n.t('map.too_far_title', { defaultValue: 'Zu weit weg' }));
                    return;
                  }
                  setActiveChest(q);
                  return;
                }
                handleNPCInteraction(q);
              }}
            />
          );
        })}
      </MapView>

      {/* Off-screen Edge Indicator for Pinned Quest */}
      {renderEdgeIndicator()}

      {/* HUD UI - Minimalist Style */}
      <TouchableOpacity style={styles.topPill} onPress={() => setIsQuestListVisible(true)}>
        <Text style={styles.pillText}>
          {supabaseError ? i18n.t('map.offline') : i18n.t('map.questsNearby', { count: quests.length })}
        </Text>
        <Feather name="chevron-down" size={16} color="#F5E6CE" style={{ marginLeft: 5 }} />
      </TouchableOpacity>

      {/* Profile Button (Top Right) */}
      <TouchableOpacity style={styles.profileBtn} onPress={() => setIsProfileModalVisible(true)}>
        <Feather name="user" size={24} color="#E9BC62" />
        <View style={styles.levelBadge}>
          <Text style={styles.levelBadgeText}>{playerLevel}</Text>
        </View>
      </TouchableOpacity>

      {/* Pinned Quest HUD */}
      {!!pinnedQuestId && quests.find(q => q.id === pinnedQuestId) && (
        <View style={styles.pinnedHUD}>
          <Feather name="map-pin" size={16} color="#FFD700" style={{ marginRight: 8 }} />
          <View style={{ marginRight: 8, maxWidth: 250 }}>
            <Text style={styles.pinnedText} numberOfLines={1}>{i18n.t(quests.find(q => q.id === pinnedQuestId).title, { defaultValue: quests.find(q => q.id === pinnedQuestId).title })}</Text>
            <Text style={styles.pinnedDistance}>{i18n.t('map.distance_away', { distance: Math.round(quests.find(q => q.id === pinnedQuestId).distance_meters), defaultValue: `${Math.round(quests.find(q => q.id === pinnedQuestId).distance_meters)}m entfernt` })}</Text>
          </View>
          <TouchableOpacity
            style={{ padding: 4 }}
            onPress={() => {
              PinEngine.setPinnedNodeId(null);
              setPinnedQuestId(null);
            }}
          >
            <Feather name="x" size={20} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      )}

      {/* Survival HUD */}
      <View style={styles.survivalHUD}>
        <View style={styles.survivalBarContainer}>
          <Feather name="coffee" size={14} color="#8B4513" style={{ marginRight: 6 }} />
          <View style={styles.survivalBarBG}>
            <View style={[styles.survivalBarFill, { width: `${survivalStats.hunger}%`, backgroundColor: '#CD853F' }]} />
          </View>
        </View>
        <View style={[styles.survivalBarContainer, { marginTop: 8 }]}>
          <Feather name="droplet" size={14} color="#4169E1" style={{ marginRight: 6 }} />
          <View style={styles.survivalBarBG}>
            <View style={[styles.survivalBarFill, { width: `${survivalStats.thirst}%`, backgroundColor: '#1E90FF' }]} />
          </View>
        </View>
      </View>

      {/* Center & Reload Button */}
      <TouchableOpacity style={styles.centerButton} onPress={centerAndReload}>
        <Text style={styles.centerButtonText}>◎</Text>
      </TouchableOpacity>

      {/* Joystick */}
      <View style={styles.joystickBase} {...panResponder.panHandlers}>
        <Animated.View style={[styles.joystickThumb, { transform: joystickThumb.getTranslateTransform() }]} />
      </View>

      {/* Water Button (Context Aware) */}
      {(isNearWater || isNearWell) && (
        <TouchableOpacity
          style={styles.waterButton}
          onPress={fillWater}
          disabled={isGatheringWater}
        >
          {isGatheringWater ? (
            <ActivityIndicator color="#4169E1" size="small" />
          ) : (
            <Feather name="droplet" size={24} color="#4169E1" />
          )}
        </TouchableOpacity>
      )}

      {/* Chest Dialog Modal */}
      <Modal
        visible={!!activeChest}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.dialogBox}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.dialogTitle}>{activeChest?.data?.isLocked ? i18n.t('chest.locked_title') : i18n.t('chest.title')}</Text>
              <TouchableOpacity onPress={() => setActiveChest(null)}>
                <Feather name="x" size={24} color="#8B4513" />
              </TouchableOpacity>
            </View>
            <View style={styles.dialogLine} />
            <Text style={styles.dialogText}>{activeChest?.data?.isLocked ? i18n.t('chest.locked_desc') : i18n.t('chest.desc')}</Text>

            <View style={styles.dialogOptions}>
              {!activeChest?.data?.isLocked && (
                <TouchableOpacity style={styles.dialogButton} onPress={() => handleOpenChest('normal')}>
                  <Text style={styles.dialogButtonText}>&gt; {i18n.t('chest.open_normal')}</Text>
                </TouchableOpacity>
              )}
              {activeChest?.data?.isLocked && (
                <TouchableOpacity style={styles.dialogButton} onPress={() => handleOpenChest('lockpick')}>
                  <Text style={styles.dialogButtonText}>&gt; {i18n.t('chest.open_lockpick')}</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.dialogButton} onPress={() => handleOpenChest('ad')}>
                <Text style={styles.dialogButtonText}>&gt; {i18n.t('chest.open_ad')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Loot Result Modal */}
      <Modal
        visible={!!chestLootResult}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.dialogBox, { alignItems: 'center' }]}>
            <Text style={[styles.dialogTitle, { marginBottom: 15 }]}>{i18n.t('chest.looted')}</Text>
            <MaterialCommunityIcons name={chestLootResult?.icon || 'treasure-chest'} size={80} color={chestLootResult?.color || "#FFD700"} style={{ marginBottom: 15 }} />
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#3E2723', marginBottom: 25 }}>
              +{chestLootResult?.amount} {chestLootResult?.name}
            </Text>
            <TouchableOpacity
              style={styles.dialogButton}
              onPress={() => setChestLootResult(null)}
            >
              <Text style={styles.dialogButtonText}>{i18n.t('map.collect', { defaultValue: 'Einsammeln' })}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Mushroom Button (Context Aware) */}
      {isNearForest && (
        <TouchableOpacity
          style={styles.mushroomButton}
          onPress={gatherMushrooms}
          disabled={isGatheringMushrooms}
        >
          {isGatheringMushrooms ? (
            <ActivityIndicator color="#FF1493" size="small" />
          ) : (
            <Text style={{ fontSize: 24 }}>🍄</Text>
          )}
        </TouchableOpacity>
      )}

      {/* Inventory Button */}
      <TouchableOpacity style={styles.inventoryButton} onPress={() => navigation.navigate('Inventory')}>
        <Feather name="briefcase" size={24} color="#f5f1e6" />
      </TouchableOpacity>

      {/* QuestLog Button */}
      <TouchableOpacity style={styles.questLogButton} onPress={() => navigation.navigate('QuestLog')}>
        <Feather name="book" size={24} color="#f5f1e6" />
      </TouchableOpacity>

      {/* Dialog Modal */}
      <Modal
        visible={!!activeNPC}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.dialogBox}>
            <Text style={styles.dialogTitle}>{i18n.t(activeNPC?.title || "...", { defaultValue: activeNPC?.title || "..." })}</Text>
            <View style={styles.dialogLine} />

            <ScrollView style={styles.dialogTextContainer}>
              <Text style={styles.dialogText}>
                {i18n.t(activeNPC?.data?.dialog?.[dialogNode]?.text || "...", { defaultValue: activeNPC?.data?.dialog?.[dialogNode]?.text || "..." })}
              </Text>
            </ScrollView>

            <View style={styles.dialogOptions}>
              {activeNPC?.data?.dialog?.[dialogNode]?.options?.map((opt, idx) => (
                <TouchableOpacity key={idx} style={styles.dialogButton} onPress={() => handleDialogOption(opt)}>
                  <Text style={styles.dialogButtonText}>&gt; {i18n.t(opt.label, { defaultValue: opt.label })}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* Native iOS Quest Sheet */}
      <Modal
        visible={!!activeQuest}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setActiveQuest(null)}
      >
        <View style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1A1A1A' }}>{i18n.t(activeQuest?.title || "...", { defaultValue: activeQuest?.title || "Quest" })}</Text>
            <TouchableOpacity onPress={() => setActiveQuest(null)} style={{ padding: 5, backgroundColor: '#E0E0E0', borderRadius: 15 }}>
              <Feather name="x" size={20} color="#333" />
            </TouchableOpacity>
          </View>
          <ScrollView style={{ padding: 20 }}>
            <View style={{ backgroundColor: '#FFF', padding: 15, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, marginBottom: 20 }}>
              <Text style={{ fontSize: 16, color: '#4A4A4A', lineHeight: 24 }}>
                {i18n.t(activeQuest?.data?.desc || "...", { defaultValue: activeQuest?.data?.desc || "Keine Beschreibung verfügbar." })}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#E3F2FD', padding: 15, borderRadius: 12, marginBottom: 30 }}>
              <Feather name="award" size={24} color="#1E88E5" style={{ marginRight: 10 }} />
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1E88E5' }}>Belohnung: {activeQuest?.data?.xpReward || 50} XP</Text>
            </View>
            <TouchableOpacity
              style={{ backgroundColor: '#007AFF', padding: 18, borderRadius: 14, alignItems: 'center', shadowColor: '#007AFF', shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } }}
              onPress={() => {
                QuestLogEngine.addQuest({
                  id: `quest_${activeQuest?.id}`,
                  title: activeQuest?.title,
                  description: activeQuest?.data?.desc,
                  xpReward: activeQuest?.data?.xpReward || 50,
                  targetAmount: 1,
                  type: 'visit'
                });
                alert('Quest angenommen!');
                setActiveQuest(null);
                setQuests(prev => prev.filter(q => q.id !== activeQuest?.id));
                handleGainXP(10, 'explore');
              }}
            >
              <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold' }}>Quest annehmen</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Role Selection Modal */}
      <RoleSelectionModal
        visible={isRoleSelectionVisible}
        onRoleSelected={() => setIsRoleSelectionVisible(false)}
      />

      {/* Profile Modal */}
      <ProfileModal
        visible={isProfileModalVisible}
        onClose={() => setIsProfileModalVisible(false)}
      />

      {/* Quest List Modal */}
      <Modal
        visible={isQuestListVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsQuestListVisible(false)}
      >
        <View style={styles.questListContainer}>
          <View style={styles.questListHeader}>
            <Text style={styles.questListTitle}>{i18n.t('map.nearbyTitle', { count: quests.length, defaultValue: `In der Nähe (${quests.length})` })}</Text>
            <TouchableOpacity onPress={() => setIsQuestListVisible(false)}>
              <Feather name="x" size={24} color="#E9BC62" />
            </TouchableOpacity>
          </View>
          <View style={styles.sortOptionsContainer}>
            <TouchableOpacity
              onPress={() => { if (sortMode === 'distance') setSortAscending(!sortAscending); else { setSortMode('distance'); setSortAscending(true); } }}
              style={[styles.sortButton, sortMode === 'distance' && styles.sortButtonActive]}
            >
              <Text style={[styles.sortButtonText, sortMode === 'distance' && styles.sortButtonTextActive]}>{i18n.t('map.sortDistance')}</Text>
              {sortMode === 'distance' && <Feather name={sortAscending ? "arrow-up" : "arrow-down"} size={14} color="#E9BC62" style={{ marginLeft: 4 }} />}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { if (sortMode === 'name') setSortAscending(!sortAscending); else { setSortMode('name'); setSortAscending(true); } }}
              style={[styles.sortButton, sortMode === 'name' && styles.sortButtonActive]}
            >
              <Text style={[styles.sortButtonText, sortMode === 'name' && styles.sortButtonTextActive]}>{i18n.t('map.sortName')}</Text>
              {sortMode === 'name' && <Feather name={sortAscending ? "arrow-up" : "arrow-down"} size={14} color="#E9BC62" style={{ marginLeft: 4 }} />}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { if (sortMode === 'type') setSortAscending(!sortAscending); else { setSortMode('type'); setSortAscending(true); } }}
              style={[styles.sortButton, sortMode === 'type' && styles.sortButtonActive]}
            >
              <Text style={[styles.sortButtonText, sortMode === 'type' && styles.sortButtonTextActive]}>{i18n.t('map.sortType')}</Text>
              {sortMode === 'type' && <Feather name={sortAscending ? "arrow-up" : "arrow-down"} size={14} color="#E9BC62" style={{ marginLeft: 4 }} />}
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.questListScroll}>
            {[...quests].filter(q => !(q.type === 'chest' && q.distance_meters > 200)).sort((a, b) => {
              let res = 0;
              if (sortMode === 'distance') res = a.distance_meters - b.distance_meters;
              else if (sortMode === 'name') res = a.title.localeCompare(b.title);
              else if (sortMode === 'type') res = a.type.localeCompare(b.type);
              return sortAscending ? res : -res;
            }).map(q => {
              const isPinned = pinnedQuestId === q.id;
              return (
                <View key={q.id} style={[styles.questListItem, isPinned && styles.questListItemPinned]}>
                  <View style={styles.questListItemInfo}>
                    <Text style={styles.questListItemTitle}>
                      {q.type === 'chest' ? (q.data?.isLocked ? i18n.t('chest.locked_title') : i18n.t('chest.title')) : i18n.t(q.title, { defaultValue: q.title })}
                    </Text>
                    <Text style={styles.questListItemType}>{i18n.t(`map.sortType_${q.type}`, { defaultValue: q.type.toUpperCase() })}</Text>
                    <Text style={styles.questListItemDistance}>
                      {q.distance_meters >= 1000 ? (q.distance_meters / 1000).toFixed(1).replace('.', ',') + 'km' : Math.round(q.distance_meters) + 'm'} entfernt
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.pinButton, isPinned && styles.pinButtonActive]}
                    onPress={() => {
                      const newId = isPinned ? null : q.id;
                      setPinnedQuestId(newId);
                      PinEngine.setPinnedNodeId(newId);
                      setIsQuestListVisible(false);
                    }}
                  >
                    <Feather name="map-pin" size={18} color={isPinned ? "#1a100a" : "#E9BC62"} />
                  </TouchableOpacity>
                </View>
              );
            })}
            {quests.length === 0 && (
              <Text style={styles.emptyText}>{i18n.t('map.nothingNearby', { defaultValue: 'Nichts gefunden.' })}</Text>
            )}
          </ScrollView>
        </View>
      </Modal>

      {floatingTexts.length > 0 && (
        <View style={styles.floatingTextContainer} pointerEvents="none">
          {floatingTexts.map(ft => (
            <FloatingText key={ft.id} text={ft.text} subtext={ft.subtext} icon={ft.icon} iconColor={ft.iconColor} onComplete={() => {
              setFloatingTexts(prev => prev.filter(f => f.id !== ft.id));
            }} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ebe3cd',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#ebe3cd',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  topPill: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    backgroundColor: 'rgba(62, 39, 35, 0.9)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    zIndex: 10,
    borderWidth: 1,
    borderColor: '#B8860B',
    flexDirection: 'row',
    alignItems: 'center',
  },
  pillText: {
    color: '#F5E6CE',
    fontSize: 15,
    fontWeight: 'bold',
  },
  profileBtn: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(30, 20, 15, 0.9)',
    borderWidth: 1,
    borderColor: '#4a3525',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    zIndex: 10,
  },
  levelBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#FFD700',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1a100a',
  },
  levelBadgeText: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    color: '#1a100a',
  },
  pinnedHUD: {
    position: 'absolute',
    top: 110,
    alignSelf: 'center',
    backgroundColor: 'rgba(20, 30, 20, 0.9)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFD700',
    width: "auto",
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  pinnedText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
  },
  pinnedDistance: {
    color: '#F5E6CE',
    fontSize: 12,
  },
  survivalHUD: {
    position: 'absolute',
    bottom: 160,
    left: 20,
    backgroundColor: 'rgba(30, 20, 15, 0.8)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#B8860B',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  survivalBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  survivalBarBG: {
    width: 80,
    height: 10,
    backgroundColor: '#3a2c22',
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1a100a',
  },
  survivalBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  text: {
    color: '#523735',
    fontSize: 16,
    marginTop: 15,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#8B0000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  centerButton: {
    position: 'absolute',
    bottom: 120, // Above inventory button
    right: 30,
    backgroundColor: 'rgba(62, 39, 35, 0.9)',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#B8860B',
  },
  inventoryButton: {
    position: 'absolute',
    bottom: 40,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3a2c22',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#B8860B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 8,
  },
  questLogButton: {
    position: 'absolute',
    top: 110,
    left: 30, // Left side instead of right
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3a2c22',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#B8860B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 8,
  },
  waterButton: {
    position: 'absolute',
    bottom: 200, // Above center button
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1E2A38',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4169E1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 8,
  },
  centerButtonText: {
    color: '#B8860B',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  joystickBase: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(62, 39, 35, 0.7)',
    borderWidth: 2,
    borderColor: '#B8860B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  joystickThumb: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E9BC62',
    borderWidth: 2,
    borderColor: '#8B4513',
  },
  // Dialog Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  dialogBox: {
    backgroundColor: '#F5E6CE',
    borderWidth: 2,
    borderColor: '#8B4513',
    borderRadius: 4,
    padding: 20,
    maxHeight: '60%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  dialogTitle: {
    color: '#3E2723',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dialogLine: {
    height: 2,
    backgroundColor: '#8B4513',
    marginVertical: 10,
    opacity: 0.7,
  },
  dialogTextContainer: {
    marginBottom: 15,
  },
  dialogText: {
    color: '#1A1A1A',
    fontSize: 17,
    lineHeight: 24,
  },
  dialogOptions: {
    marginTop: 10,
  },
  dialogButton: {
    backgroundColor: 'rgba(139, 69, 19, 0.1)',
    padding: 12,
    borderRadius: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#8B4513',
  },
  dialogButtonText: {
    color: '#E9BC62',
    fontSize: 16,
    fontWeight: 'bold',
  },
  questListContainer: {
    flex: 1,
    backgroundColor: '#1a100a',
    padding: 20,
  },
  questListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#4a3525',
    paddingBottom: 10,
  },
  questListTitle: {
    color: '#E9BC62',
    fontSize: 20,
    fontWeight: 'bold',
  },
  sortOptionsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'flex-start',
  },
  sortButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4a3525',
    marginRight: 8,
    backgroundColor: 'rgba(30, 20, 15, 0.5)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortButtonActive: {
    backgroundColor: 'rgba(233, 188, 98, 0.2)',
    borderColor: '#E9BC62',
  },
  sortButtonText: {
    color: '#A67B38',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sortButtonTextActive: {
    color: '#E9BC62',
  },
  questListScroll: {
    flexGrow: 0,
  },
  questListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 20, 15, 0.8)',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#4a3525',
  },
  questListItemPinned: {
    borderColor: '#FFD700',
    backgroundColor: 'rgba(40, 40, 20, 0.9)',
  },
  questListItemInfo: {
    flex: 1,
  },
  questListItemTitle: {
    color: '#F5E6CE',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  questListItemType: {
    color: '#E9BC62',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  questListItemDistance: {
    color: '#A67B38',
    fontSize: 14,
  },
  pinButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1,
    borderColor: '#E9BC62',
  },
  pinButtonActive: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  emptyText: {
    color: '#A67B38',
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 20,
  },
  floatingTextContainer: {
    position: 'absolute',
    top: '30%',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    elevation: 9999,
  },
});
