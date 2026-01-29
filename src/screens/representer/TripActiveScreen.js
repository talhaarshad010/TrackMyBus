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

  // ==========================
  // LOCATION PERMISSION
  // ==========================
  const requestPermission = async () => {
    if (Platform.OS !== 'android') return true;

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  // ==========================
  // START ON MOUNT
  // ==========================
  useEffect(() => {
    let ref;

    const init = async () => {
      console.log('📍 TripActive mounted');

      const allowed = await requestPermission();
      if (!allowed) return;

      await startTracking();
      setTracking(true);

      // Firebase listener
      ref = database().ref('bus/location');

      ref.on('value', snap => {
        const data = snap.val();

        // safe speed handling
        setSpeed(data?.speed ?? 0);
      });
    };

    init();

    // CLEANUP
    return () => {
      console.log('🛑 TripActive unmounted');
      if (ref) ref.off();
      stopTracking(); // auto stop if screen closed
    };
  }, []);

  // ==========================
  // STOP BUTTON
  // ==========================
  const handleStop = async () => {
    await stopTracking();
    navigation.replace('RepHome');
  };

  // ==========================
  return (
    <View style={styles.container}>
      <Text style={styles.status}>
        {tracking ? 'Sharing Live Location...' : 'Starting GPS...'}
      </Text>

      <Text style={styles.speed}>Speed: {Math.round(speed * 3.6)} km/h</Text>

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
});
