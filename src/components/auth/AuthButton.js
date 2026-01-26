// import React from 'react';
// import {
//   TouchableOpacity,
//   Text,
//   StyleSheet,
//   ActivityIndicator,
// } from 'react-native';

// export default function AppButton({ title, onPress, loading }) {
//   return (
//     <TouchableOpacity style={styles.btn} onPress={onPress} disabled={loading}>
//       {loading ? (
//         <ActivityIndicator color="#fff" />
//       ) : (
//         <Text style={styles.text}>{title}</Text>
//       )}
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   btn: {
//     backgroundColor: '#111',
//     padding: 16,
//     borderRadius: 14,
//     alignItems: 'center',
//   },
//   text: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

import AppText from '../AppText';

export default function AuthButton({
  title,
  loading,
  disabled,
  style,
  textStyle,
  ...props
}) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={isDisabled}
      style={[styles.btn, isDisabled && styles.disabled, style]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <AppText style={[styles.text, textStyle]}>{title}</AppText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#000',

    height: 56, // 🔥 consistent height (pro look)
    borderRadius: 16,

    justifyContent: 'center',
    alignItems: 'center',

    marginTop: 12,

    // 🔥 shadow (iOS)
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },

    // 🔥 elevation (Android)
    elevation: 3,
  },

  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  disabled: {
    opacity: 0.55,
  },
});
