import notifee, {
  AndroidImportance,
  AndroidVisibility,
} from '@notifee/react-native';

export const showNotification = async (title, body) => {
  console.log('🔔 SHOWING NOTIFICATION:', title);

  await notifee.displayNotification({
    id: Math.random().toString(), // unique

    title,
    body,

    android: {
      channelId: 'default',
      smallIcon: 'ic_notification',
      largeIcon: 'ic_launcher',

      importance: AndroidImportance.HIGH,
      visibility: AndroidVisibility.PUBLIC,

      pressAction: { id: 'default' },

      autoCancel: true,
      ongoing: false,

      showTimestamp: true,
      timestamp: Date.now(),

      // 🔥 CRITICAL (forces shade visibility)
      asForegroundService: false,
    },
  });
};
