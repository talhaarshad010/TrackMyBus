import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

import AppInput from '../../components/auth/AuthInput';
import AppButton from '../../components/auth/AuthButton';
import AuthHeader from '../../components/auth/AuthHeader';
import { showSuccess } from '../../components/AppToast';
import { useNavigation } from '@react-navigation/native';

const schema = Yup.object({
  password: Yup.string().min(6).required(),
});

export default function ResetPassword({}) {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const handleReset = async () => {
    setLoading(true);
    setTimeout(() => {
      showSuccess('Password Updated 🔐');
      navigation.navigate('Login');
      setLoading(false);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <AuthHeader title="Reset Password" subtitle="Create new password" />

      <Formik
        initialValues={{ password: '' }}
        validationSchema={schema}
        onSubmit={handleReset}
      >
        {({ handleChange, handleSubmit, values, errors }) => (
          <>
            <AppInput
              placeholder="New Password"
              secureTextEntry
              value={values.password}
              onChangeText={handleChange('password')}
              error={errors.password}
            />

            <AppButton
              title="Update Password"
              onPress={handleSubmit}
              loading={loading}
            />
          </>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
});
