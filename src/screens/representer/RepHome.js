import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  PermissionsAndroid, // ← yeh built-in import karo
  Linking, // settings kholne ke liye
} from 'react-native';

export default function RepHomeScreen({ navigation }) {
  const requestLocationPermissions = async () => {
    if (Platform.OS !== 'android') return true;

    try {
      // Step 1: Foreground location (ACCESS_FINE_LOCATION)
      const fineStatus = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );

      if (!fineStatus) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'This app needs access to your location to share live bus position.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            Alert.alert(
              'Permission Blocked',
              'Location permission is permanently denied. Please enable it in Settings → Apps → Your App → Permissions',
              [
                {
                  text: 'Open Settings',
                  onPress: () => Linking.openSettings(),
                },
                { text: 'Cancel', style: 'cancel' },
              ],
            );
          } else {
            Alert.alert(
              'Permission Denied',
              'Location access is required to start trip.',
            );
          }
          return false;
        }
      }

      // Step 2: Background location (Android 10+ i.e. API 29+)
      if (Platform.Version >= 29) {
        const bgStatus = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        );

        if (!bgStatus) {
          const bgGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
            {
              title: 'Background Location',
              message:
                'Allow background location so the app can share your position even when minimized or screen is off.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );

          if (bgGranted !== PermissionsAndroid.RESULTS.GRANTED) {
            if (bgGranted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
              Alert.alert(
                'Background Permission Blocked',
                'Please enable background location in Settings.',
                [
                  {
                    text: 'Open Settings',
                    onPress: () => Linking.openSettings(),
                  },
                  { text: 'Cancel', style: 'cancel' },
                ],
              );
            } else {
              Alert.alert(
                'Permission Needed',
                'Background location is required for live tracking.',
              );
            }
            return false;
          }
        }
      }

      return true;
    } catch (err) {
      console.warn('Permission error:', err);
      Alert.alert(
        'Error',
        'Something went wrong while requesting permissions.',
      );
      return false;
    }
  };

  const handleStart = async () => {
    const granted = await requestLocationPermissions();

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
