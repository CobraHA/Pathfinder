const fs = require('fs');
let code = fs.readFileSync('src/screens/MapScreen.js', 'utf8');

const missingFunc = `
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
      <View style={{
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
      }}>
        <Feather name="arrow-up" size={28} color="#FFD700" style={{ transform: [{ rotate: \`${rotationDeg}deg\` }] }} />
      </View>
    );
  };
`;

if (!code.includes('const renderEdgeIndicator')) {
  code = code.replace('return (\n    <View style={styles.container}>', missingFunc + '\n  return (\n    <View style={styles.container}>');
  
  // also the deleted code had chest removal:
  // if (q.distance_meters > 50) return; inside quests.map
  
  fs.writeFileSync('src/screens/MapScreen.js', code);
  console.log('Restored');
}
