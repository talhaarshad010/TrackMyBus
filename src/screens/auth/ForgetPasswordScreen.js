// import React, { useState } from 'react';
// import { Text, StyleSheet } from 'react-native';
// import { Formik } from 'formik';
// import auth from '@react-native-firebase/auth';

// import AuthLayout from '../../components/auth/AuthLayout';
// import AuthInput from '../../components/auth/AuthInput';
// import AuthButton from '../../components/auth/AuthButton';
// import { showError, showSuccess } from '../../components/AppToast';
// import { emailSchema } from '../../utils/validationSchemas';
// import colors from '../../theme/colors';
// import BrandHeader from '../../components/auth/BrandHeader';
// export default function ForgetPasswordScreen({ navigation }) {
//   const [loading, setLoading] = useState(false);

//   const handleReset = async ({ email }) => {
//     try {
//       setLoading(true);

//       await auth().sendPasswordResetEmail(email.trim());

//       showSuccess('Reset link sent 📩 Check email');

//       navigation.goBack(); // back to login
//     } catch (e) {
//       showError(e.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AuthLayout>
//       <BrandHeader />
//       {/* 🔥 same hierarchy as login */}
//       <Text style={styles.title}>Forgot Password</Text>
//       <Text style={styles.subtitle}>
//         Enter your email to receive reset link
//       </Text>

//       <Formik
//         initialValues={{ email: '' }}
//         validationSchema={emailSchema}
//         onSubmit={handleReset}
//       >
//         {({ handleChange, handleSubmit, values, errors }) => (
//           <>
//             <AuthInput
//               placeholder="Email address"
//               value={values.email}
//               onChangeText={handleChange('email')}
//               error={errors.email}
//               keyboardType="email-address"
//               autoCapitalize="none"
//             />

//             <AuthButton
//               title="Send Reset Link"
//               onPress={handleSubmit}
//               loading={loading}
//             />
//           </>
//         )}
//       </Formik>
//     </AuthLayout>
//   );
// }

// const styles = StyleSheet.create({
//   title: {
//     fontSize: 26,
//     fontWeight: '700',
//     marginBottom: 6,
//   },
//   subtitle: {
//     color: colors.subText,
//     marginBottom: 30,
//   },
// });
import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import auth from '@react-native-firebase/auth';

import AuthLayout from '../../components/auth/AuthLayout';
import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';
import BrandHeader from '../../components/auth/BrandHeader';
import AppText from '../../components/AppText';

import { showError, showSuccess } from '../../components/AppToast';
import { emailSchema } from '../../utils/validationSchemas';

export default function ForgetPasswordScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  const handleReset = async ({ email }) => {
    try {
      setLoading(true);

      await auth().sendPasswordResetEmail(email.trim());

      showSuccess(
        'Reset link sent 📩 Check your email. It takes (2 to 3) minutes to arrive.',
      );

      navigation.goBack();
    } catch (e) {
      showError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* 🔥 Branding */}
      <BrandHeader />

      {/* 🔥 Header section (same as login/signup) */}
      <View style={styles.header}>
        <AppText style={styles.title}>Forgot Password</AppText>
        <AppText style={styles.subtitle}>
          Don’t worry. Enter your email and we’ll send you a reset link.
        </AppText>
      </View>

      {/* 🔥 Form */}
      <Formik
        initialValues={{ email: '' }}
        validationSchema={emailSchema}
        onSubmit={handleReset}
      >
        {({ handleChange, handleSubmit, values, errors }) => (
          <>
            <AuthInput
              placeholder="Email address"
              keyboardType="email-address"
              autoCapitalize="none"
              value={values.email}
              onChangeText={handleChange('email')}
              error={errors.email}
            />

            <AuthButton
              title="Send Reset Link"
              onPress={handleSubmit}
              loading={loading}
            />
          </>
        )}
      </Formik>

      {/* 🔥 Footer link */}
      <TouchableOpacity
        style={styles.footer}
        onPress={() => navigation.goBack()}
      >
        <AppText style={styles.footerText}>Back to Login</AppText>
      </TouchableOpacity>
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

  footer: {
    marginTop: 28,
    alignItems: 'center',
  },

  footerText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
});
