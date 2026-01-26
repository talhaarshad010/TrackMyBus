import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Formik } from 'formik';
import auth from '@react-native-firebase/auth';

import BrandHeader from '../../components/auth/BrandHeader';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';
import AppText from '../../components/AppText';

import { showError, showSuccess } from '../../components/AppToast'; // ✅ IMPORT ADD

export default function LoginScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  const handleLogin = async values => {
    try {
      setLoading(true);

      await auth().signInWithEmailAndPassword(
        values.email.trim(),
        values.password.trim(),
      );

      // ✅ SUCCESS TOAST
      showSuccess('Welcome back 👋');
    } catch (e) {
      // ✅ CLEAN ERRORS
      let message = 'Something went wrong';

      switch (e.code) {
        case 'auth/user-not-found':
          message = 'Account not found';
          break;

        case 'auth/wrong-password':
          message = 'Incorrect password';
          break;

        case 'auth/invalid-email':
          message = 'Invalid email address';
          break;

        case 'auth/network-request-failed':
          message = 'No internet connection';
          break;

        case 'auth/too-many-requests':
          message = 'Too many attempts. Try later';
          break;
      }

      showError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <BrandHeader />

      <View style={styles.header}>
        <AppText style={styles.title}>Welcome back</AppText>
        <AppText style={styles.subtitle}>
          Sign in to continue to TrackMyBus
        </AppText>
      </View>

      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={handleLogin}
      >
        {({ handleChange, handleSubmit, values }) => (
          <>
            <AuthInput
              placeholder="Email address"
              keyboardType="email-address"
              autoCapitalize="none"
              value={values.email}
              onChangeText={handleChange('email')}
            />

            <AuthInput
              placeholder="Password"
              secureTextEntry
              value={values.password}
              onChangeText={handleChange('password')}
            />

            <AuthButton
              title="Login"
              onPress={handleSubmit}
              loading={loading}
            />
          </>
        )}
      </Formik>

      <View style={styles.links}>
        <TouchableOpacity onPress={() => navigation.navigate('Forget')}>
          <AppText style={styles.linkLight}>Forgot password?</AppText>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <AppText style={styles.linkBold}>Create new account</AppText>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 28,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },

  links: {
    marginTop: 28,
    alignItems: 'center',
    gap: 10,
  },

  linkLight: {
    fontSize: 14,
    color: '#6B7280',
  },

  linkBold: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
});
