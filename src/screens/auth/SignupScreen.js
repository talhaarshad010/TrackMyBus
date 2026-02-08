import React, { useState, useEffect } from 'react';
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

  const handleSignup = async values => {
    try {
      setLoading(true);

      const res = await auth().createUserWithEmailAndPassword(
        values.email.trim(),
        values.password.trim(),
      );

      const uid = res.user.uid;

      // ✅ ALWAYS STUDENT
      await database().ref(`users/${uid}`).set({
        email: values.email,
        role: 'user',
        createdAt: Date.now(),
      });

      await auth().signOut();

      showSuccess('Account created 🎉 Please login');

      // navigation.replace('Login');
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
