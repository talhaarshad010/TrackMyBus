import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import MapScreen from '../screens/main/MapScreen';
import StopsScreen from '../screens/main/StopsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function UserTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
        },

        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Map') iconName = 'location';
          if (route.name === 'Stops') iconName = 'list';
          if (route.name === 'Profile') iconName = 'person';

          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Stops" component={StopsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
