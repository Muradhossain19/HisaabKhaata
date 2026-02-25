// src/navigation/AppNavigator.tsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// আমাদের প্রধান স্ক্রিনগুলো
import DashboardScreen from '../screens/DashboardScreen';
import TransactionsListScreen from '../screens/TransactionsListScreen';

// ডামি স্ক্রিন
const ReportsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Reports</Text>
  </View>
);
const ProfileScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Profile</Text>
  </View>
);

export type AppTabParamList = {
  Dashboard: undefined;
  Transactions: undefined;
  Reports: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();

// কাস্টম ট্যাব আইকন কম্পোনেন্ট
const TabBarIcon = ({
  route,
  focused,
  color,
}: // size,
{
  route: any;
  focused: boolean;
  color: string;
  size: number;
}) => {
  let iconName: string;
  let label: string;

  switch (route.name) {
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
    case 'Profile':
      iconName = focused ? 'person' : 'person-outline';
      label = 'প্রোফাইল';
      break;
    default:
      iconName = 'alert-circle';
      label = 'Error';
  }

  return (
    <View style={styles.tabIconContainer}>
      <Icon name={iconName} size={focused ? 24 : 22} color={color} />
      <Text
        style={[styles.tabLabel, { color: focused ? '#2563eb' : '#64748b' }]}
      >
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
        tabBarIcon: ({ focused, color, size }) => (
          <TabBarIcon
            route={route}
            focused={focused}
            color={color}
            size={size}
          />
        ),
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#64748b',
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Transactions" component={TransactionsListScreen} />
      <Tab.Screen name="Reports" component={ReportsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute', // ✅ আপনার পছন্দের ভাসমান স্টাইল
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#ffffff',
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
});

export default AppNavigator;
