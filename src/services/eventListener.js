import database from '@react-native-firebase/database';
import { showNotification } from '../utils/notify';

let attached = false;
let ref = null;
let lastTime = 0;

export const startBusEventListener = () => {
  if (attached) return;

  attached = true;

  console.log('👂 BUS EVENT LISTENER ATTACHED');

  ref = database().ref('bus/events');

  ref.on('child_added', snap => {
    const data = snap.val();

    // 🔥 ignore old events
    if (!data?.time || data.time <= lastTime) return;

    lastTime = data.time;

    console.log('🔥 EVENT:', data);

    if (data.type === 'START') {
      showNotification('🚌 Bus Started', 'Bus has started the trip');
    }

    if (data.type === 'STOP') {
      showNotification('🚌 Bus Reached', data.stopName);
    }
  });
};

export const stopBusEventListener = () => {
  if (!attached || !ref) return;

  ref.off();
  attached = false;
};
