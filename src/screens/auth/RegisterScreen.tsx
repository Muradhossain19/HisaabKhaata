// src/screens/auth/RegisterScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import Icon from 'react-native-vector-icons/Ionicons';
import AppButton from '../../components/AppButton';
import AuthStyles from '../../components/AuthStyles';
import AuthScreenShell from '../../components/AuthScreenShell';
import InputField from '../../components/InputField';
import useForm from '../../hooks/useForm';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { registerUser } from '../../store/authSlice';
import { useTranslation } from '../../i18n';
import LanguageToggle from '../../components/LanguageToggle';
import { authMetrics } from '../../theme/authTheme';

const RegisterScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const dispatch = useAppDispatch();
  const authLoading = useAppSelector(s => s.auth.loading);
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const m = authMetrics(width);

  const { values, setField, errors, handleSubmit, reset } = useForm({
    initialValues: {
      name: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: vals => {
      const e: Record<string, string> = {};
      if (!vals.name) e.name = t('auth.validation.nameRequired');
      if (!vals.phone) e.phone = t('auth.validation.phoneRequired');
      else if (!/^[0-9]{6,15}$/.test(vals.phone))
        e.phone = t('auth.validation.phoneInvalid');
      if (!vals.email) e.email = t('auth.validation.emailRequired');
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vals.email))
        e.email = t('auth.validation.emailInvalid');
      if (!vals.password) e.password = t('auth.validation.passwordRequired');
      else if (vals.password.length < 6)
        e.password = t('auth.validation.passwordShort');
      if (vals.password !== vals.confirmPassword)
        e.confirmPassword = t('auth.validation.passwordMismatch');
      return e;
    },
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const onSubmit = async (vals: typeof values) => {
    try {
      const action = await dispatch(
        registerUser({
          name: vals.name,
          email: vals.email,
          phone: vals.phone,
          password: vals.password,
          password_confirmation: vals.confirmPassword,
        }),
      );

      // @ts-ignore
      if (action.type && action.type.endsWith('/rejected')) {
        // @ts-ignore
        const payload = action.payload as any;
        try {
          console.log(
            '[ui][register][rejected]',
            payload ?? (action as any).error,
          );
        } catch {}

        const message =
          (payload && payload.message) ||
          (action as any).error?.message ||
          t('auth.alerts.registrationFailed');

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

      Alert.alert(t('auth.alerts.registrationSuccess'));
      reset();
      // After successful register, user is authenticated (token is set in store).
      // RootNavigator will switch to AppNavigator.
    } catch (err: any) {
      Alert.alert(err?.message ?? t('auth.alerts.registrationFailed'));
    }
  };

  return (
    <AuthScreenShell centerVertical={false}>
      <View style={AuthStyles.topRow}>
        <LanguageToggle />
      </View>

      <View style={AuthStyles.headerContainer}>
        <Text style={[AuthStyles.title, { fontSize: m.titleSize }]}>
          {t('auth.registerTitle')}
        </Text>
        <Text style={[AuthStyles.subtitle, { fontSize: m.subtitleSize }]}>
          {t('auth.registerSubtitle')}
        </Text>
      </View>

      <View style={AuthStyles.formContainer}>
        <InputField
          value={values.name}
          onChange={v => setField('name', v)}
          placeholder={t('auth.placeholders.name')}
          icon="person-outline"
          autoCapitalize="words"
        />
        {errors.name ? (
          <Text style={AuthStyles.errorText}>{errors.name}</Text>
        ) : null}

        <InputField
          value={values.phone}
          onChange={v => setField('phone', v)}
          placeholder={t('auth.placeholders.phone')}
          keyboardType="phone-pad"
          icon="call-outline"
        />
        {errors.phone ? (
          <Text style={AuthStyles.errorText}>{errors.phone}</Text>
        ) : null}

        <InputField
          value={values.email}
          onChange={v => setField('email', v)}
          placeholder={t('auth.placeholders.email')}
          keyboardType="email-address"
          icon="mail-outline"
        />
        {errors.email ? (
          <Text style={AuthStyles.errorText}>{errors.email}</Text>
        ) : null}

        <InputField
          value={values.password}
          onChange={v => setField('password', v)}
          placeholder={t('auth.placeholders.password')}
          secure={!isPasswordVisible}
          icon="lock-closed-outline"
          rightAccessory={
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              hitSlop={12}
              accessibilityRole="button"
            >
              <Icon
                name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                size={22}
                color="#64748b"
              />
            </TouchableOpacity>
          }
        />
        {errors.password ? (
          <Text style={AuthStyles.errorText}>{errors.password}</Text>
        ) : null}

        <InputField
          value={values.confirmPassword}
          onChange={v => setField('confirmPassword', v)}
          placeholder={t('auth.placeholders.confirmPassword')}
          secure={!isConfirmPasswordVisible}
          icon="lock-closed-outline"
          rightAccessory={
            <TouchableOpacity
              onPress={() =>
                setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
              }
              hitSlop={12}
              accessibilityRole="button"
            >
              <Icon
                name={
                  isConfirmPasswordVisible ? 'eye-off-outline' : 'eye-outline'
                }
                size={22}
                color="#64748b"
              />
            </TouchableOpacity>
          }
        />
        {errors.confirmPassword ? (
          <Text style={AuthStyles.errorText}>{errors.confirmPassword}</Text>
        ) : null}
      </View>

      <AppButton
        title={t('auth.buttons.register')}
        onPress={() => handleSubmit(onSubmit)}
        loading={authLoading}
      />

      <View style={AuthStyles.signupContainer}>
        <Text style={AuthStyles.signupText}>{t('auth.links.loginPrompt')}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={AuthStyles.signupLink}>{t('auth.links.loginLink')}</Text>
        </TouchableOpacity>
      </View>
    </AuthScreenShell>
  );
};

export default RegisterScreen;
