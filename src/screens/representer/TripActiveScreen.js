import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
} from 'react-native';

import database from '@react-native-firebase/database';
import { startTracking, stopTracking } from '../../services/locationService';

export default function TripActiveScreen({ navigation }) {
  const [speed, setSpeed] = useState(0);
  const [tracking, setTracking] = useState(false);

  const requestPermission = async () => {
    if (Platform.OS !== 'android') return true;

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  useEffect(() => {
    let ref;

    const init = async () => {
      console.log('📍 TripActive mounted');

      const allowed = await requestPermission();
      if (!allowed) return;

      await startTracking();
      setTracking(true);

      ref = database().ref('bus/location');

      ref.on('value', snap => {
        const data = snap.val();

        setSpeed(data?.speed ?? 0);
      });
    };

    init();

    // CLEANUP
    return () => {
      console.log('🛑 TripActive unmounted');
      if (ref) ref.off();
      stopTracking();
    };
  }, []);

  const handleStop = async () => {
    await stopTracking();
    navigation.replace('RepHome');
  };

  // ==========================
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.live}>🟢 Live Tracking</Text>

        <Text style={styles.speed}>{Math.round(speed * 3.6)} km/h</Text>
      </View>

      <TouchableOpacity style={styles.stopBtn} onPress={handleStop}>
        <Text style={styles.stopText}>Stop Trip</Text>
      </TouchableOpacity>
    </View>
  );
}

// ==========================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  status: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },

  speed: {
    fontSize: 16,
    color: '#000',
    marginBottom: 40,
  },

  stopBtn: {
    backgroundColor: '#000',
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 14,
  },

  stopText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 18,
    alignItems: 'center',
    elevation: 5,
  },

  live: {
    color: 'green',
    fontWeight: 'bold',
    marginBottom: 10,
  },

  speed: {
    fontSize: 40,
    fontWeight: 'bold',
  },

  stopBtn: {
    marginTop: 40,
    backgroundColor: '#FF3B30',
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
  },
});
