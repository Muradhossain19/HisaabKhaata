import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TransactionsListScreen from '../screens/TransactionsListScreen';

export type TransactionsStackParamList = {
  TransactionsHome: undefined;
};

const Stack = createNativeStackNavigator<TransactionsStackParamList>();

export default function TransactionsNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TransactionsHome" component={TransactionsListScreen} />
    </Stack.Navigator>
  );
}

