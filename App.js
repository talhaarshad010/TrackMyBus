import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import database from '@react-native-firebase/database';
import notifee, { AndroidImportance } from '@notifee/react-native';
import AuthStack from './src/navigation/AuthStack';
import UserStack from './src/navigation/UserStack';
import RepStack from './src/navigation/RepStack';
import OnboardingModal from './src/screens/auth/OnboardingModal';
import Toast from 'react-native-toast-message';
import { PermissionsAndroid, Platform } from 'react-native';
import SplashScreen from './src/components/SplashScreen';
console.log('Firebase apps:', firebase.apps);

export default function App() {
  const [authState, setAuthState] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    }
  }, []);

  useEffect(() => {
    notifee.createChannel({
      id: 'default',
      name: 'Default',
      importance: AndroidImportance.HIGH,
    });
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('🔥 FOREGROUND MESSAGE:', remoteMessage);
    });

    return unsubscribe;
  }, []);

  // ========================================
  // 🔥 AUTH + TOKEN SAVE (CORRECT PLACE)
  // ========================================
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async u => {
      if (!u) {
        setAuthState(false);
        return;
      }

      const ref = database().ref(`users/${u.uid}`);
      const snap = await ref.once('value');

      let data = snap.val();

      // first time profile create
      if (!data) {
        data = {
          email: u.email,
          name: '',
          phone: '',
          department: '',
          semester: '',
          role: 'user',
          profileComplete: false,
        };

        await ref.set(data);
      }

      // ====================================
      // 🔥 SAVE FCM TOKEN (after login)
      // ====================================
      try {
        await messaging().requestPermission();

        const token = await messaging().getToken();

        console.log('🔥 FCM TOKEN:', token);

        await ref.update({ fcmToken: token });

        console.log('✅ Token saved');
      } catch (e) {
        console.log('Token error:', e);
      }

      // ====================================

      setUserData({ ...data, uid: u.uid });

      if (!data.profileComplete) {
        setShowOnboarding(true);
      }

      setAuthState({
        user: u,
        role: data.role,
      });
    });

    return unsubscribe;
  }, []);

  // ========================================

  // if (authState === null) return <AppLoader />;

  if (authState === false)
    return (
      <>
        <NavigationContainer>
          <AuthStack />
          <Toast />
        </NavigationContainer>
        <SplashScreen />
      </>
    );

  return (
    <>
      <NavigationContainer>
        {authState === false && <AuthStack />}

        {authState && (
          <>
            {authState.role === 'representer' ? <RepStack /> : <UserStack />}

            {showOnboarding && (
              <OnboardingModal
                user={userData}
                onComplete={() => setShowOnboarding(false)}
              />
            )}
          </>
        )}

        <Toast />
      </NavigationContainer>

      {/* Always show splash on top */}
      <SplashScreen />
    </>
  );
}
