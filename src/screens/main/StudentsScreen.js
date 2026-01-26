import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '../../components/AppText';

export default function StudentsScreen() {
  return (
    <View style={styles.container}>
      <AppText>Students Screen �‍🎓</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
