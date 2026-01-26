// import React, { useEffect, useState } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import auth from '@react-native-firebase/auth';
// import database from '@react-native-firebase/database';

// import AuthStack from './src/navigation/AuthStack';
// import UserStack from './src/navigation/UserStack';
// import RepStack from './src/navigation/RepStack';

// import AppLoader from './src/components/AppLoader';
// import Toast from 'react-native-toast-message';

// export default function App() {
//   const [authState, setAuthState] = useState(null);

//   useEffect(() => {
//     const unsubscribe = auth().onAuthStateChanged(async u => {
//       if (!u) {
//         setAuthState(false);
//         return;
//       }

//       try {
//         const snap = await database().ref(`users/${u.uid}`).once('value');

//         const role = snap.val()?.role || 'user';

//         // ⭐ SINGLE UPDATE (no flicker)
//         setAuthState({
//           user: u,
//           role,
//         });
//       } catch (e) {
//         setAuthState({
//           user: u,
//           role: 'user',
//         });
//       }
//     });

//     return unsubscribe;
//   }, []);

//   // ⭐ LOADING
//   if (authState === null) {
//     return <AppLoader />;
//   }

//   // ⭐ LOGGED OUT
//   if (authState === false) {
//     return (
//       <NavigationContainer>
//         <AuthStack />
//         <Toast />
//       </NavigationContainer>
//     );
//   }

//   // ⭐ LOGGED IN (NO FLASH GUARANTEED)
//   return (
//     <NavigationContainer>
//       {authState.role === 'representer' ? <RepStack /> : <UserStack />}
//       <Toast />
//     </NavigationContainer>
//   );
// }

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import AuthStack from './src/navigation/AuthStack';
import UserStack from './src/navigation/UserStack';
import RepStack from './src/navigation/RepStack';

import AppLoader from './src/components/AppLoader';
import OnboardingModal from './src/screens/auth/OnboardingModal';
import Toast from 'react-native-toast-message';

export default function App() {
  const [authState, setAuthState] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async u => {
      if (!u) {
        setAuthState(false);
        return;
      }

      const ref = database().ref(`users/${u.uid}`);
      const snap = await ref.once('value');

      let data = snap.val();

      // ⭐ FIRST TIME CREATE PROFILE
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

      setUserData({ ...data, uid: u.uid });

      // ⭐ BLOCK USER IF PROFILE NOT COMPLETE
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

  // loading
  if (authState === null) return <AppLoader />;

  // logged out
  if (authState === false)
    return (
      <NavigationContainer>
        <AuthStack />
        <Toast />
      </NavigationContainer>
    );

  return (
    <NavigationContainer>
      {authState.role === 'representer' ? <RepStack /> : <UserStack />}

      {/* ⭐ FIRST TIME MODAL */}
      {showOnboarding && (
        <OnboardingModal
          user={userData}
          onComplete={() => setShowOnboarding(false)}
        />
      )}

      <Toast />
    </NavigationContainer>
  );
}
