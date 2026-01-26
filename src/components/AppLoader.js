import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

export default function AppLoader() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4CAF50" />
      <Text style={styles.text}>Loading TrackMyBus...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6F7FB',
  },
  text: {
    marginTop: 12,
    fontSize: 14,
    color: '#555',
  },
});
