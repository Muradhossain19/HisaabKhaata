// src/navigation/AppNavigator.tsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import DashboardNavigator from './DashboardNavigator';
import TransactionsNavigator from './TransactionsNavigator';
import ReportsNavigator from './ReportsNavigator';
import SettingsNavigator from './SettingsNavigator';
import { tokens } from '../theme/tokens';

export type AppTabParamList = {
  Dashboard: undefined;
  Transactions: undefined;
  Reports: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();

// কাস্টম ট্যাব আইকন কম্পোনেন্ট
const TabBarIcon = ({
  routeName,
  focused,
  color,
}: {
  routeName: keyof AppTabParamList;
  focused: boolean;
  color: string;
}) => {
  let iconName: string;
  let label: string;

  switch (routeName) {
    case 'Dashboard':
      iconName = focused ? 'grid' : 'grid-outline';
      label = 'ড্যাশবোর্ড';
      break;
    case 'Transactions':
      iconName = focused ? 'list' : 'list-outline';
      label = 'লেনদেন';
      break;
    case 'Reports':
      iconName = focused ? 'bar-chart' : 'bar-chart-outline';
      label = 'রিপোর্ট';
      break;
    case 'Settings':
      iconName = focused ? 'person' : 'person-outline';
      label = 'সেটিংস';
      break;
    default:
      iconName = 'alert-circle';
      label = 'Error';
  }

  return (
    <View style={styles.tabIconContainer}>
      <Icon name={iconName} size={focused ? 24 : 22} color={color} />
      <Text style={[styles.tabLabel, focused ? styles.tabLabelActive : styles.tabLabelInactive]}>
        {label}
      </Text>
    </View>
  );
};

const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ focused, color }) => (
          <TabBarIcon
            routeName={route.name as keyof AppTabParamList}
            focused={focused}
            color={color}
          />
        ),
        tabBarActiveTintColor: tokens.colors.primary,
        tabBarInactiveTintColor: tokens.colors.textMuted,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardNavigator} />
      <Tab.Screen name="Transactions" component={TransactionsNavigator} />
      <Tab.Screen name="Reports" component={ReportsNavigator} />
      <Tab.Screen name="Settings" component={SettingsNavigator} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute', // ✅ আপনার পছন্দের ভাসমান স্টাইল
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: tokens.colors.surface,
    borderRadius: 20,
    height: 70,
    borderTopWidth: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    top: 5,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: tokens.colors.primary,
  },
  tabLabelInactive: {
    color: tokens.colors.textMuted,
  },
});

export default AppNavigator;
