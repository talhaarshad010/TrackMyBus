import { getDistance } from 'geolib';
import { NativeModules, NativeEventEmitter } from 'react-native';
import database from '@react-native-firebase/database';
import { STOPS } from '../data/stops';

const { LocationModule } = NativeModules;

const emitter = new NativeEventEmitter(LocationModule);

const ref = database().ref('bus/location');
const eventRef = database().ref('bus/events');

let subscription = null;
let lastStopId = null;
let isTracking = false;

// =====================================
// START TRACKING
// =====================================
export const startTracking = () => {
  if (isTracking) return; // 🔥 prevent duplicate starts

  console.log('🚀 Trip Started');

  isTracking = true;
  lastStopId = null; // 🔥 reset stops

  // 🔥 push START event
  eventRef.push({
    type: 'START',
    time: Date.now(),
  });

  LocationModule.startTracking();

  ref.onDisconnect().update({ active: false });

  subscription = emitter.addListener('onLocationUpdate', data => {
    const { lat, lng } = data;

    checkStops(lat, lng);

    ref.set({
      ...data,
      active: true,
      updatedAt: Date.now(),
    });
  });
};

// =====================================
// STOP TRACKING
// =====================================
export const stopTracking = () => {
  if (!isTracking) return;

  console.log('🛑 Trip Stopped');

  isTracking = false;

  LocationModule.stopTracking();

  subscription?.remove();

  ref.update({ active: false });

  // 🔥 push END event (important for students)
  eventRef.push({
    type: 'END',
    time: Date.now(),
  });
};

// =====================================
// STOP DETECTION
// =====================================
const checkStops = (lat, lng) => {
  for (const stop of STOPS) {
    const dist = getDistance(
      { latitude: lat, longitude: lng },
      { latitude: stop.lat, longitude: stop.lng },
    );

    if (dist < 80 && lastStopId !== stop.id) {
      lastStopId = stop.id;

      console.log('🛑 STOP:', stop.name);

      eventRef.push({
        type: 'STOP',
        stopName: stop.name,
        time: Date.now(),
      });

      break; // 🔥 prevent multiple in same tick
    }
  }
};
