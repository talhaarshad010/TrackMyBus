import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import colors from '../../theme/colors';

export default function BrandHeader({ title, subtitle }) {
  return (
    <View style={styles.container}>
      {/* 🔥 Bus Icon */}
      {/* <Text style={styles.icon}>🚌</Text> */}
      <Image
        // resizeMode="contain"
        source={require('../../assets/appLogo.png')}
        style={styles.icon}
      />

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
    width: '100%',
    height: 120,
  },
  brand: {
    fontSize: 22,
    fontWeight: '700',
    // marginBottom: 16,
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
