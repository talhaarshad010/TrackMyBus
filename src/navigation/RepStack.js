import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RepHomeScreen from '../screens/representer/RepHome';
import TripActiveScreen from '../screens/representer/TripActiveScreen';
const Stack = createNativeStackNavigator();

export default function RepStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RepHome" component={RepHomeScreen} />
      <Stack.Screen name="TripActive" component={TripActiveScreen} />
    </Stack.Navigator>
  );
}
