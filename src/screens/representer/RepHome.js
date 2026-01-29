import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  PermissionsAndroid,
} from 'react-native';

export default function RepHomeScreen({ navigation }) {
  const requestLocationPermissions = async () => {
    try {
      if (Platform.OS !== 'android') return true;

      const version = Number(Platform.Version);

      // Android < 6
      if (version < 23) return true;

      const fine = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );

      if (fine !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('Location permission required');
        return false;
      }

      // Step 2 — Background (Android 10+)
      if (version >= 29) {
        setTimeout(async () => {
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
          );
        }, 500);
      }

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  const handleStart = async () => {
    const granted = await requestLocationPermissions();
    console.log('granted:', granted);
    if (granted) {
      navigation.replace('TripActive');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bus Offline</Text>

      <TouchableOpacity style={styles.startBtn} onPress={handleStart}>
        <Text style={styles.startText}>Start Trip</Text>
      </TouchableOpacity>
    </View>
  );
}

// styles same as before...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 40,
  },

  startBtn: {
    backgroundColor: '#000',
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 14,
  },

  startText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
