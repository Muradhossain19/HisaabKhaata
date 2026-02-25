// src/navigation/AuthNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// আমাদের স্ক্রিনগুলো ইমপোর্ট করুন
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPassword from '../screens/auth/ForgotPassword';
import TransactionsListScreen from '../screens/TransactionsListScreen';
import DashboardScreen from '../screens/DashboardScreen';

// স্ক্রিনগুলোর জন্য টাইপ ডিফাইন করা (TypeScript Best Practice)
export type AuthStackParamList = {
  Login: undefined; // Login স্ক্রিনের কোনো প্যারামিটার নেই
  Register: undefined;
  ForgotPassword: undefined;
  Transactions: undefined;
  Dashboard: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // আমরা কোনো ডিফল্ট হেডার চাই না
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen
        name="Transactions"
        component={TransactionsListScreen}
        options={{ headerShown: true, title: 'Transactions' }}
      />
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ headerShown: true, title: 'Dashboard' }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
