// import React, { useState } from 'react';
// import { StyleSheet, View, TouchableOpacity } from 'react-native';
// import { Formik } from 'formik';
// import { useNavigation } from '@react-navigation/native';
// import auth from '@react-native-firebase/auth';

// import AuthLayout from '../../components/auth/AuthLayout';
// import AuthInput from '../../components/auth/AuthInput';
// import AuthButton from '../../components/auth/AuthButton';
// import BrandHeader from '../../components/auth/BrandHeader';
// import AppText from '../../components/AppText';

// import { signup } from '../../services/authService';
// import { signupSchema } from '../../utils/validationSchemas';
// import { showError, showSuccess } from '../../components/AppToast';

// export default function SignupScreen() {
//   const navigation = useNavigation();
//   const [loading, setLoading] = useState(false);

//   const handleSignup = async values => {
//     try {
//       setLoading(true);

//       await signup(values.email.trim(), values.password.trim());

//       await auth().signOut(); // 👈 THIS IS ENOUGH

//       showSuccess('Account created successfully 🎉');

//       // ❌ NO navigation here
//     } catch (e) {
//       showError(e.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AuthLayout>
//       {/* 🔥 Branding */}
//       <BrandHeader />

//       {/* 🔥 Title Section */}
//       <View style={styles.header}>
//         <AppText style={styles.title}>Create Account</AppText>
//         <AppText style={styles.subtitle}>
//           Join TrackMyBus and start tracking smarter
//         </AppText>
//       </View>

//       {/* 🔥 Form */}
//       <Formik
//         initialValues={{ email: '', password: '' }}
//         validationSchema={signupSchema}
//         onSubmit={handleSignup}
//       >
//         {({ handleChange, handleSubmit, values, errors }) => (
//           <>
//             <AuthInput
//               placeholder="Email address"
//               keyboardType="email-address"
//               autoCapitalize="none"
//               value={values.email}
//               onChangeText={handleChange('email')}
//               error={errors.email}
//             />

//             <AuthInput
//               placeholder="Password"
//               secureTextEntry
//               value={values.password}
//               onChangeText={handleChange('password')}
//               error={errors.password}
//             />

//             <AuthButton
//               title="Create Account"
//               onPress={handleSubmit}
//               loading={loading}
//             />
//           </>
//         )}
//       </Formik>

//       {/* 🔥 Footer link */}
//       <TouchableOpacity
//         style={styles.footer}
//         onPress={() => navigation.goBack()}
//       >
//         <AppText style={styles.footerText}>
//           Already have an account? Login
//         </AppText>
//       </TouchableOpacity>
//     </AuthLayout>
//   );
// }

// const styles = StyleSheet.create({
//   header: {
//     marginBottom: 28,
//   },

//   title: {
//     fontSize: 28,
//     fontWeight: '700',
//     color: '#000',
//     marginBottom: 6,
//   },

//   subtitle: {
//     fontSize: 14,
//     color: '#6B7280',
//   },

//   footer: {
//     marginTop: 28,
//     alignItems: 'center',
//   },

//   footerText: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#000',
//   },
// });

import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Switch } from 'react-native';

import { Formik } from 'formik';
import { useNavigation } from '@react-navigation/native';

import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import AuthLayout from '../../components/auth/AuthLayout';
import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';
import BrandHeader from '../../components/auth/BrandHeader';
import AppText from '../../components/AppText';

import { signupSchema } from '../../utils/validationSchemas';
import { showError, showSuccess } from '../../components/AppToast';

export default function SignupScreen() {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [isRep, setIsRep] = useState(false); // 🔥 role toggle

  const handleSignup = async values => {
    try {
      setLoading(true);

      // ✅ create auth user
      const res = await auth().createUserWithEmailAndPassword(
        values.email.trim(),
        values.password.trim(),
      );

      const uid = res.user.uid;

      // ✅ save profile in DB
      await database()
        .ref(`users/${uid}`)
        .set({
          email: values.email,
          role: isRep ? 'representer' : 'user',
          createdAt: Date.now(),
        });

      showSuccess('Account created successfully 🎉');

      await auth().signOut();

      // navigation.goBack();
    } catch (e) {
      showError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <BrandHeader />

      <View style={styles.header}>
        <AppText style={styles.title}>Create Account</AppText>
      </View>

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={signupSchema}
        onSubmit={handleSignup}
      >
        {({ handleChange, handleSubmit, values, errors }) => (
          <>
            <AuthInput
              placeholder="Email"
              value={values.email}
              onChangeText={handleChange('email')}
              error={errors.email}
            />

            <AuthInput
              placeholder="Password"
              secureTextEntry
              value={values.password}
              onChangeText={handleChange('password')}
              error={errors.password}
            />

            {/* 🔥 REPRESENTATIVE SWITCH */}
            <View style={styles.roleRow}>
              <AppText>Register as Bus Representative</AppText>
              <Switch value={isRep} onValueChange={setIsRep} />
            </View>

            <AuthButton
              title="Create Account"
              onPress={handleSubmit}
              loading={loading}
            />
          </>
        )}
      </Formik>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <AppText style={styles.footerText}>Already have account? Login</AppText>
      </TouchableOpacity>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 24,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
  },

  roleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 14,
  },

  footerText: {
    textAlign: 'center',
    marginTop: 20,
  },
});
