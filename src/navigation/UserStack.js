import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserTabs from './UserTabs';

const Stack = createNativeStackNavigator();

export default function UserStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserTabs" component={UserTabs} />
    </Stack.Navigator>
  );
}
