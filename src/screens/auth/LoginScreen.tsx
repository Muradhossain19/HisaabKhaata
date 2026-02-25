// src/screens/auth/LoginScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import AuthStyles from '../../components/AuthStyles';
import InputField from '../../components/InputField';
import { useAppDispatch } from '../../store/hooks';
import { loginUser } from '../../store/authSlice';
import { useTranslation } from '../../i18n';
import LanguageToggle from '../../components/LanguageToggle';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import AppButton from '../../components/AppButton';

// এখন LoginScreen কম্পোনেন্ট শুরু হচ্ছে
const LoginScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t('auth.alerts.requiredInfo'));
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert(t('auth.validation.emailInvalid'));
      return;
    }

    if (password.length < 6) {
      Alert.alert(t('auth.validation.passwordShort'));
      return;
    }

    try {
      const action = await dispatch(loginUser({ email, password }));
      // if rejected, show server message
      // @ts-ignore
      if (action.type && action.type.endsWith('/rejected')) {
        // @ts-ignore
        const payload = action.payload as any;
        try {
          console.log(
            '[ui][login][rejected]',
            payload ?? (action as any).error,
          );
        } catch {}

        const message =
          (payload && payload.message) ||
          (action as any).error?.message ||
          t('auth.alerts.loginFailed');
        if (payload && payload.data) {
          const details =
            typeof payload.data === 'string'
              ? payload.data
              : JSON.stringify(payload.data);
          Alert.alert(message, details);
        } else {
          Alert.alert(message);
        }
        return;
      }

      // success — navigate directly to Dashboard
      try {
        navigation.replace('Dashboard');
      } catch (e) {
        console.warn('navigate after login failed', e);
      }
    } catch (err: any) {
      Alert.alert(err?.message ?? t('auth.alerts.loginFailed'));
    }
  };

  return (
    <SafeAreaView style={AuthStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f4f8" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={AuthStyles.keyboardView}
      >
        <View style={AuthStyles.contentView}>
          {/* ১. আধুনিক লোগো এবং হেডার */}
          <View style={AuthStyles.headerContainer}>
            <LanguageToggle />
            <View style={AuthStyles.logoBackground}>
              <Text style={AuthStyles.logoText}>H</Text>
            </View>
            <Text style={AuthStyles.title}>{t('auth.loginTitle')}</Text>
            <Text style={AuthStyles.subtitle}>{t('auth.loginSubtitle')}</Text>
          </View>

          {/* ২. আইকনসহ ইনপুট ফর্ম */}
          <View style={AuthStyles.formContainer}>
            <InputField
              value={email}
              onChange={setEmail}
              placeholder={t('auth.placeholders.email')}
              keyboardType="email-address"
              icon="mail-outline"
            />

            <InputField
              value={password}
              onChange={setPassword}
              placeholder={t('auth.placeholders.password')}
              secure={!isPasswordVisible}
              icon="lock-closed-outline"
              rightAccessory={
                <TouchableOpacity
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  <Icon
                    name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                    size={22}
                    color="#6b7280"
                  />
                </TouchableOpacity>
              }
            />

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={AuthStyles.forgotPassword}>
                {t('auth.links.forgotPassword')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* ৩. লগইন বাটন (এখন এটি একটি স্বতন্ত্র কম্পোনেন্ট) */}
          <AppButton title={t('auth.buttons.login')} onPress={handleLogin} />

          {/* ৪. রেজিস্ট্রেশন লিঙ্ক */}
          <View style={AuthStyles.signupContainer}>
            <Text style={AuthStyles.signupText}>
              {t('auth.links.signupPrompt')}{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={AuthStyles.signupLink}>
                {t('auth.links.signupLink')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
