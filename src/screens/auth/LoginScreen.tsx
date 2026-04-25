// src/screens/auth/LoginScreen.tsx

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import AuthStyles from '../../components/AuthStyles';
import AuthScreenShell from '../../components/AuthScreenShell';
import InputField from '../../components/InputField';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginUser } from '../../store/authSlice';
import { useTranslation } from '../../i18n';
import LanguageToggle from '../../components/LanguageToggle';
import Icon from 'react-native-vector-icons/Ionicons';
import AppButton from '../../components/AppButton';
import { authMetrics } from '../../theme/authTheme';

const LoginScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const authLoading = useAppSelector(s => s.auth.loading);
  const { width } = useWindowDimensions();
  const m = authMetrics(width);
  const logoInner = m.logoSize * 0.48;

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

      try {
        // RootNavigator will switch to AppNavigator once token is set.
      } catch (e) {
        console.warn('navigate after login failed', e);
      }
    } catch (err: any) {
      Alert.alert(err?.message ?? t('auth.alerts.loginFailed'));
    }
  };

  return (
    <AuthScreenShell centerVertical>
      <View style={AuthStyles.topRow}>
        <LanguageToggle />
      </View>

      <View style={AuthStyles.headerContainer}>
        <View
          style={[
            AuthStyles.logoBackground,
            {
              width: m.logoSize,
              height: m.logoSize,
              borderRadius: m.logoSize / 2,
            },
          ]}
        >
          <Text style={[AuthStyles.logoText, { fontSize: logoInner }]}>H</Text>
        </View>
        <Text style={AuthStyles.brandTagline}>HisaabKhaata</Text>
        <Text style={[AuthStyles.title, { fontSize: m.titleSize }]}>
          {t('auth.loginTitle')}
        </Text>
        <Text style={[AuthStyles.subtitle, { fontSize: m.subtitleSize }]}>
          {t('auth.loginSubtitle')}
        </Text>
      </View>

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
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel={
                isPasswordVisible ? 'Hide password' : 'Show password'
              }
            >
              <Icon
                name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                size={22}
                color="#64748b"
              />
            </TouchableOpacity>
          }
        />

        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}
          accessibilityRole="button"
        >
          <Text style={AuthStyles.forgotPassword}>
            {t('auth.links.forgotPassword')}
          </Text>
        </TouchableOpacity>
      </View>

      <AppButton
        title={t('auth.buttons.login')}
        onPress={handleLogin}
        loading={authLoading}
      />

      <View style={AuthStyles.signupContainer}>
        <Text style={AuthStyles.signupText}>{t('auth.links.signupPrompt')}</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
          accessibilityRole="button"
        >
          <Text style={AuthStyles.signupLink}>{t('auth.links.signupLink')}</Text>
        </TouchableOpacity>
      </View>
    </AuthScreenShell>
  );
};

export default LoginScreen;
