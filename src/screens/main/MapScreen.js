import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import database from '@react-native-firebase/database';
import busIcon from '../../assets/bus.png';
import { getDistance } from 'geolib';
import { STOPS } from '../../data/stops';
export default function MapScreen() {
  const [busLocation, setBusLocation] = useState(null);
  const [isActive, setIsActive] = useState(null);
  const [nextStop, setNextStop] = useState(null);

  const getNextStop = (busLat, busLng) => {
    let nearest = null;
    let minDist = Infinity;

    STOPS.forEach(stop => {
      const dist = getDistance(
        { latitude: busLat, longitude: busLng },
        { latitude: stop.lat, longitude: stop.lng },
      );

      if (dist < minDist) {
        minDist = dist;
        nearest = stop;
      }
    });

    return nearest;
  };

  console.log('Data:', busLocation);
  useEffect(() => {
    const ref = database().ref('bus/location');

    const listener = ref.on('value', snap => {
      const data = snap.val();

      if (!data) return;

      setIsActive(data.active); // 🔥 important

      if (data.active) {
        setBusLocation(data);

        const stop = getNextStop(data.lat, data.lng);
        setNextStop(stop?.name);
      }
    });

    return () => ref.off('value', listener);
  }, []);

  // =============================
  // OFFLINE
  // =============================
  if (isActive === false) {
    return (
      <View style={styles.center}>
        <Text style={styles.offline}>🚌 Bus is Offline</Text>
      </View>
    );
  }

  // =============================
  // LOADING FIRST (important)
  // =============================
  if (isActive === null) {
    return (
      <View style={styles.center}>
        <Text>Checking bus status...</Text>
      </View>
    );
  }

  // =============================
  // Loading state
  // =============================
  if (!busLocation) {
    return (
      <View style={styles.center}>
        <Text>Connecting to bus...</Text>
      </View>
    );
  }

  // =============================
  // LIVE MAP
  // =============================
  return (
    <MapView
      style={styles.map}
      region={{
        latitude: busLocation.lat,
        longitude: busLocation.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    >
      <Marker
        coordinate={{
          latitude: busLocation.lat,
          longitude: busLocation.lng,
        }}
        anchor={{ x: 0.5, y: 0.5 }}
      >
        <Image
          source={busIcon}
          style={{ width: 70, height: 70, resizeMode: 'contain' }}
        />

        <Callout tooltip>
          <View style={styles.callout}>
            <Text style={styles.title}>🚌 Bus Live</Text>
            <Text>Speed: {(busLocation.speed * 3.6).toFixed(1)} km/h</Text>
            <Text>Next Stop: {nextStop ?? 'Calculating...'}</Text>
          </View>
        </Callout>
      </Marker>
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  offline: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  sub: {
    marginTop: 6,
    opacity: 0.6,
  },
  callout: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 12,
    minWidth: 140,
    elevation: 5,
  },

  title: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
});
