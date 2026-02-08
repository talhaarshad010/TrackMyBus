import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
  ScrollView,
} from 'react-native';

import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RepHomeScreen({ navigation }) {
  const [active, setActive] = useState(false);
  const [speed, setSpeed] = useState(0);
  const user = auth().currentUser;

  // ==========================
  // LIVE BUS STATUS LISTENER
  // ==========================
  useEffect(() => {
    const ref = database().ref('bus/location');

    ref.on('value', snap => {
      const data = snap.val();

      if (!data) return;

      setActive(data.active);
      setSpeed(Math.round((data.speed ?? 0) * 3.6));
    });

    return () => ref.off();
  }, []);

  // ==========================
  // PERMISSION
  // ==========================
  const requestPermission = async () => {
    if (Platform.OS !== 'android') return true;

    const fine = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    return fine === PermissionsAndroid.RESULTS.GRANTED;
  };

  // ==========================
  // START
  // ==========================
  const handleStart = async () => {
    const ok = await requestPermission();
    if (ok) navigation.replace('TripActive');
  };

  // ==========================
  // LOGOUT
  // ==========================
  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => await auth().signOut(),
      },
    ]);
  };

  // ==========================
  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <Text style={styles.header}>🚌 Representative Dashboard</Text>
      <Text style={styles.sub}>{user?.email}</Text>

      {/* ================= STATS ================= */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Status</Text>
          <Text
            style={[
              styles.statValue,
              { color: active ? '#16a34a' : '#dc2626' },
            ]}
          >
            {active ? 'Online' : 'Offline'}
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Speed</Text>
          <Text style={styles.statValue}>{speed} km/h</Text>
        </View>
      </View>

      {/* ================= ACTIONS ================= */}
      <TouchableOpacity style={styles.primaryBtn} onPress={handleStart}>
        <Text style={styles.primaryText}>▶ Start Trip</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryBtn}
        onPress={() => navigation.navigate('TransferRep')}
      >
        <Text style={styles.secondaryText}>🔄 Transfer Representative</Text>
      </TouchableOpacity>

      {/* ================= LOGOUT ================= */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ================= STYLES =================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },

  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  sub: {
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.6,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },

  statCard: {
    width: '48%',
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },

  statTitle: {
    opacity: 0.6,
    marginBottom: 6,
  },

  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  primaryBtn: {
    backgroundColor: '#000',
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 14,
  },

  primaryText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  secondaryBtn: {
    backgroundColor: '#eee',
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 14,
  },

  secondaryText: {
    fontWeight: '600',
  },

  logoutBtn: {
    marginTop: 30,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dc2626',
    alignItems: 'center',
  },

  logoutText: {
    color: '#dc2626',
    fontWeight: 'bold',
  },
});
