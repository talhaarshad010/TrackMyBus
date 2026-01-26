import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import MapScreen from '../screens/main/MapScreen';
import StopsScreen from '../screens/main/StopsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function UserTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
        },
      }}
    >
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Stops" component={StopsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
