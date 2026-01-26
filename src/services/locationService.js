import Geolocation from 'react-native-geolocation-service';
import database from '@react-native-firebase/database';

let watchId = null;

export const startTracking = () => {
  try {
    if (watchId) return;

    watchId = Geolocation.watchPosition(
      pos => {
        const { latitude, longitude, speed } = pos.coords;

        database()
          .ref('bus/location')
          .set({
            lat: latitude,
            lng: longitude,
            speed: speed || 0,
            active: true,
            updatedAt: Date.now(),
          });
      },
      error => {
        console.log('Tracking error:', error);
      },
      {
        enableHighAccuracy: false,
        distanceFilter: 20,
        interval: 5000,
        fastestInterval: 4000,
      },
    );
  } catch (e) {
    console.log('startTracking crash:', e);
  }
};

export const stopTracking = () => {
  if (watchId) {
    Geolocation.clearWatch(watchId);
  }

  database().ref('bus/location').update({
    active: false,
  });
};
