import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import database from '@react-native-firebase/database';
import { startTracking, stopTracking } from '../../services/locationService';

export default function TripActiveScreen({ navigation }) {
  const [speed, setSpeed] = useState(0);

  // ==========================
  // START when mounted
  // ==========================
  useEffect(() => {
    startTracking();

    const ref = database().ref('bus/location');

    const listener = ref.on('value', snap => {
      const data = snap.val();
      if (data?.speed) setSpeed(data.speed);
    });

    return () => {
      ref.off('value', listener);
    };
  }, []);

  // ==========================
  const handleStop = async () => {
    await stopTracking();
    navigation.replace('RepHome');
  };

  // ==========================
  return (
    <View style={styles.container}>
      <Text style={styles.status}>Sharing Live Location...</Text>

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
