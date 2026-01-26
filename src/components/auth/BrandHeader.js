import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';

export default function BrandHeader({ title, subtitle }) {
  return (
    <View style={styles.container}>
      {/* 🔥 Bus Icon */}
      <Text style={styles.icon}>🚌</Text>

      {/* App Name */}
      <Text style={styles.brand}>TrackMyBus</Text>

      {/* Screen Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Subtitle */}
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 0,
  },
  icon: {
    fontSize: 42,
    marginBottom: 6,
  },
  brand: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: colors.text,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  subtitle: {
    color: colors.subText,
    marginTop: 4,
  },
});
