import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AuthHeader from '../../components/auth/AuthHeader';
import AppButton from '../../components/auth/AuthButton';
import OTPInput from '../../components/otp/OTPInput';
import { showError, showSuccess } from '../../components/AppToast';
import { sendOTP } from '../../services/otpService';

export default function OTPScreen({ navigation, route }) {
  const { email, otp: initialOtp } = route.params;

  const [serverOtp, setServerOtp] = useState(initialOtp);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);

  // timer
  useEffect(() => {
    if (timer <= 0) return;

    const t = setInterval(() => setTimer(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [timer]);

  const handleVerify = (enteredOtp, shake) => {
    if (enteredOtp === serverOtp) {
      showSuccess('OTP Verified 🎉');
      navigation.navigate('ResetPassword', { email });
    } else {
      shake();
      showError('Wrong code');
    }
  };

  const resend = async () => {
    try {
      setLoading(true);
      const newOtp = await sendOTP(email);

      setServerOtp(newOtp);
      setTimer(60);

      showSuccess('OTP resent 📩');
    } catch {
      showError('Failed to resend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <AuthHeader title="Enter OTP" subtitle={`Code sent to ${email}`} />

        <OTPInput onComplete={handleVerify} />

        <AppButton title="Verify" onPress={() => {}} disabled />

        <View style={styles.footer}>
          {timer > 0 ? (
            <Text style={styles.timer}>Resend in {timer}s</Text>
          ) : (
            <TouchableOpacity onPress={resend} disabled={loading}>
              <Text style={styles.resend}>Resend Code</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  timer: {
    color: '#9CA3AF',
  },
  resend: {
    color: '#2563EB',
    fontWeight: '600',
  },
});
