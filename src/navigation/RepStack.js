import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RepHomeScreen from '../screens/representer/RepHome';
import TripActiveScreen from '../screens/representer/TripActiveScreen';
import ManageStudentsScreen from '../screens/representer/ManageStudentsScreen';
import TransferRepScreen from '../screens/representer/TransferRepScreen';
const Stack = createNativeStackNavigator();

export default function RepStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RepHome" component={RepHomeScreen} />
      <Stack.Screen name="TripActive" component={TripActiveScreen} />
      <Stack.Screen name="ManageStudents" component={ManageStudentsScreen} />
      <Stack.Screen name="TransferRep" component={TransferRepScreen} />
    </Stack.Navigator>
  );
}
