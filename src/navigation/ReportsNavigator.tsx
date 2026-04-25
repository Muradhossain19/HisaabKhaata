import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ReportsHomeScreen from '../screens/reports/ReportsHomeScreen';

export type ReportsStackParamList = {
  ReportsHome: undefined;
};

const Stack = createNativeStackNavigator<ReportsStackParamList>();

export default function ReportsNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ReportsHome" component={ReportsHomeScreen} />
    </Stack.Navigator>
  );
}

