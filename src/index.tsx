// src/index.tsx

import React from 'react';
import { Platform, StatusBar } from 'react-native'; // StatusBar ইমপোর্ট করুন

// API URL সেট করার কোড অপরিবর্তিত থাকবে
(globalThis as any).__API_URL__ =
  Platform.OS === 'android' ? 'http://10.0.2.2:8088' : 'http://127.0.0.1:8088';

import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import store from './store';

// ✅ RootNavigator ইমপোর্ট করুন, যা আমাদের মূল সিদ্ধান্ত গ্রহণকারী
import RootNavigator from './navigation/RootNavigator';

const AppEntry = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        {/* একটি গ্লোবাল স্ট্যাটাস বার যোগ করা হলো, যা পুরো অ্যাপে একটি সামঞ্জস্যপূর্ণ লুক দেবে */}
        <StatusBar barStyle="dark-content" backgroundColor="#f0f4f8" />
        <NavigationContainer>
          {/* ✅ AuthNavigator এর পরিবর্তে এখন আমরা RootNavigator ব্যবহার করব */}
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
};

export default AppEntry;
