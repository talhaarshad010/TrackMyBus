import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '../screens/auth/LoginScreen';
import Signup from '../screens/auth/SignupScreen';
import Forget from '../screens/auth/ForgetPasswordScreen';
import OTPScreen from '../screens/auth/OTPScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="Forget" component={Forget} />
            <Stack.Screen name="OTP" component={OTPScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        </Stack.Navigator>
    );
}
