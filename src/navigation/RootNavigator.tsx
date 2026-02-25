// src/navigation/RootNavigator.tsx

import React from 'react';
import { useAppSelector } from '../store/hooks';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';

const RootNavigator = () => {
  // Redux স্টোর থেকে টোকেন চেক করা হচ্ছে
  const token = useAppSelector(state => state.auth.token);

  // যদি টোকেন থাকে, তাহলে মূল অ্যাপ দেখাও, নাহলে অথেনটিকেশন ফ্লো দেখাও
  return token ? <AppNavigator /> : <AuthNavigator />;
};

export default RootNavigator;
