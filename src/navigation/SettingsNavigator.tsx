import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SettingsHomeScreen from '../screens/settings/SettingsHomeScreen';
import PartiesListScreen from '../screens/ledger/PartiesListScreen';
import PartyLedgerScreen from '../screens/ledger/PartyLedgerScreen';
import CategoriesScreen from '../screens/settings/CategoriesScreen';
import PaymentMethodsScreen from '../screens/settings/PaymentMethodsScreen';

export type SettingsStackParamList = {
  SettingsHome: undefined;
  Parties: undefined;
  PartyLedger: { partyId: string };
  Categories: undefined;
  PaymentMethods: undefined;
};

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export default function SettingsNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsHome" component={SettingsHomeScreen} />
      <Stack.Screen name="Parties" component={PartiesListScreen} />
      <Stack.Screen name="PartyLedger" component={PartyLedgerScreen} />
      <Stack.Screen name="Categories" component={CategoriesScreen} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
    </Stack.Navigator>
  );
}

