import React, { useState } from 'react';
import { TextInput, StyleSheet, View } from 'react-native';

import AppText from '../AppText';
import colors from '../../theme/colors';

export default function AuthInput({
  error,
  label,
  style,
  inputStyle,
  ...props
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      {/* 🔥 Optional label */}
      {label && <AppText style={styles.label}>{label}</AppText>}

      <View
        style={[
          styles.inputContainer,
          focused && styles.focused,
          error && styles.errorBorder,
          style,
        ]}
      >
        <TextInput
          allowFontScaling={false}
          placeholderTextColor="#9CA3AF"
          style={[styles.input, inputStyle]}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
      </View>

      {/* 🔥 Error text */}
      {error && <AppText style={styles.error}>{error}</AppText>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 18,
  },

  label: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 6,
    color: '#374151',
  },

  inputContainer: {
    borderWidth: 1,
    borderColor: colors.border,

    borderRadius: 16,
    backgroundColor: '#fff',

    height: 56,
    paddingHorizontal: 16,

    justifyContent: 'center',

    // 🔥 soft shadow
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },

    elevation: 2,
  },

  input: {
    fontSize: 16,
    color: '#000',
  },

  focused: {
    borderColor: '#000', // 🔥 black focus
    shadowOpacity: 0.12,
  },

  errorBorder: {
    borderColor: colors.danger,
  },

  error: {
    marginTop: 6,
    fontSize: 12,
    color: colors.danger,
  },
});
