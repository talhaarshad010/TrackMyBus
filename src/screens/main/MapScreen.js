// import React, { useEffect, useRef, useState } from 'react';
// import {
//   View,
//   StyleSheet,
//   TouchableOpacity,
//   PermissionsAndroid,
//   Platform,
// } from 'react-native';

// import MapView, {
//   Marker,
//   AnimatedRegion,
//   PROVIDER_GOOGLE,
// } from 'react-native-maps';

// import Geolocation from 'react-native-geolocation-service';
// import notifee from '@notifee/react-native';
// import { getDistance } from 'geolib';

// import {
//   getDatabase,
//   ref,
//   set,
//   onValue,
// } from '@react-native-firebase/database';
// import auth from '@react-native-firebase/auth';

// import AppText from '../../components/AppText';
// import AuthButton from '../../components/auth/AuthButton';

// import routeStops from '../../data/routeA.json';

// const UPDATE_INTERVAL = 3000;
// const STOP_RADIUS = 80; // meters

// export default function MapScreen() {
//   const db = getDatabase();
//   const uid = auth().currentUser.uid;

//   const [role, setRole] = useState('student');
//   const [tracking, setTracking] = useState(false);

//   const intervalRef = useRef(null);

//   const busRegion = useRef(
//     new AnimatedRegion({
//       latitude: 24.9123,
//       longitude: 67.0821,
//       latitudeDelta: 0.01,
//       longitudeDelta: 0.01,
//     }),
//   ).current;

//   const visitedStops = useRef(new Set());

//   // -------------------------------------------------
//   // 🔥 PERMISSION
//   // -------------------------------------------------

//   const requestLocation = async () => {
//     if (Platform.OS === 'android') {
//       await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//       );
//     }
//   };

//   // -------------------------------------------------
//   // 🔥 GET USER ROLE
//   // -------------------------------------------------

//   useEffect(() => {
//     const unsub = onValue(ref(db, `users/${uid}`), snap => {
//       setRole(snap.val()?.role || 'student');
//     });

//     return () => unsub();
//   }, []);

//   // -------------------------------------------------
//   // 🔥 STUDENT LISTENER (receive bus location)
//   // -------------------------------------------------

//   useEffect(() => {
//     const locationRef = ref(db, 'bus/location');

//     const unsub = onValue(locationRef, snap => {
//       const loc = snap.val();
//       if (!loc) return;

//       busRegion
//         .timing({
//           latitude: loc.lat,
//           longitude: loc.lng,
//           duration: 2500,
//           useNativeDriver: false,
//         })
//         .start();

//       checkStops(loc);
//     });

//     return () => unsub();
//   }, []);

//   // -------------------------------------------------
//   // 🔥 STOP DETECTION + NOTIFICATION
//   // -------------------------------------------------

//   const checkStops = async location => {
//     for (let stop of routeStops) {
//       if (visitedStops.current.has(stop.id)) continue;

//       const distance = getDistance(
//         { latitude: location.lat, longitude: location.lng },
//         { latitude: stop.lat, longitude: stop.lng },
//       );

//       if (distance < STOP_RADIUS) {
//         visitedStops.current.add(stop.id);

//         await notifee.displayNotification({
//           title: 'Bus arriving 🚍',
//           body: `${stop.name} is near`,
//           android: {
//             channelId: 'default',
//           },
//         });
//       }
//     }
//   };

//   // -------------------------------------------------
//   // 🔥 REPRESENTATIVE START TRACKING
//   // -------------------------------------------------

//   const startTracking = async () => {
//     await requestLocation();

//     setTracking(true);

//     await set(ref(db, 'bus/tracking'), true);

//     intervalRef.current = setInterval(() => {
//       Geolocation.getCurrentPosition(
//         pos => {
//           set(ref(db, 'bus/location'), {
//             lat: pos.coords.latitude,
//             lng: pos.coords.longitude,
//             updatedAt: Date.now(),
//           });
//         },
//         err => console.log(err),
//         {
//           enableHighAccuracy: true,
//           timeout: 15000,
//         },
//       );
//     }, UPDATE_INTERVAL);
//   };

//   // -------------------------------------------------
//   // 🔥 STOP TRACKING
//   // -------------------------------------------------

//   const stopTracking = async () => {
//     clearInterval(intervalRef.current);
//     setTracking(false);

//     await set(ref(db, 'bus/tracking'), false);
//   };

//   // -------------------------------------------------
//   // UI
//   // -------------------------------------------------

//   return (
//     <View style={styles.container}>
//       <MapView
//         provider={PROVIDER_GOOGLE}
//         style={styles.map}
//         showsUserLocation
//         initialRegion={{
//           latitude: 24.9123,
//           longitude: 67.0821,
//           latitudeDelta: 0.02,
//           longitudeDelta: 0.02,
//         }}
//       >
//         {/* 🔥 BUS MARKER */}
//         <Marker.Animated coordinate={busRegion} title="Bus 🚍" />

//         {/* 🔥 STOPS */}
//         {routeStops.map(stop => (
//           <Marker
//             key={stop.id}
//             coordinate={{ latitude: stop.lat, longitude: stop.lng }}
//             title={stop.name}
//             pinColor="black"
//           />
//         ))}
//       </MapView>

//       {/* 🔥 REPRESENTATIVE CONTROLS */}
//       {role === 'rep' && (
//         <View style={styles.controls}>
//           {tracking ? (
//             <AuthButton title="Stop Tracking" onPress={stopTracking} />
//           ) : (
//             <AuthButton title="Start Tracking" onPress={startTracking} />
//           )}
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },

//   map: {
//     flex: 1,
//   },

//   controls: {
//     position: 'absolute',
//     bottom: 30,
//     left: 20,
//     right: 20,
//   },
// });

// // import React from 'react';
// // import { StyleSheet, View } from 'react-native';
// // import Mapbox from '@rnmapbox/maps';

// // export default function MapScreen() {
// //   return (
// //     <View style={styles.container}>
// //       <Mapbox.MapView style={styles.map}>
// //         <Mapbox.Camera
// //           zoomLevel={14}
// //           centerCoordinate={[24.887184, 67.127719]} // Lahore test
// //         />
// //       </Mapbox.MapView>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1 },
// //   map: { flex: 1 },
// // });

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚌 Bus Tracking</Text>
      <Text style={styles.subtitle}>Map will be enabled soon...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.6,
  },
});
