import React from 'react';
import { Text } from 'react-native';

export default function AppText({ style, ...props }) {
  return (
    <Text
      allowFontScaling={false}
      style={[{ color: '#111', fontSize: 14 }, style]}
      {...props}
    />
  );
}
