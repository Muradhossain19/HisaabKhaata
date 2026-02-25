// src/screens/auth/RegisterScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import Icon from 'react-native-vector-icons/Ionicons';
import AppButton from '../../components/AppButton';
import AuthStyles from '../../components/AuthStyles';
import InputField from '../../components/InputField';
import useForm from '../../hooks/useForm';
import { useAppDispatch } from '../../store/hooks';
import { registerUser } from '../../store/authSlice';
import { useTranslation } from '../../i18n';
import LanguageToggle from '../../components/LanguageToggle';

const RegisterScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const dispatch = useAppDispatch();

  const { t } = useTranslation();

  const { values, setField, errors, handleSubmit, reset } = useForm({
    initialValues: {
      name: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: vals => {
      const e: any = {};
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

  // already have `t` from useTranslation above

  const onSubmit = async (vals: any) => {
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

      // check result: if rejected, show backend message
      // @ts-ignore
      if (action.type && action.type.endsWith('/rejected')) {
        // prefer returned payload message (structured payload from thunk)
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

        // show server validation details when available
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
    } catch (err: any) {
      Alert.alert(err?.message ?? t('auth.alerts.registrationFailed'));
    }
  };

  return (
    <SafeAreaView style={AuthStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f4f8" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={AuthStyles.keyboardView}
      >
        {/* ScrollView যোগ করা হয়েছে যাতে ছোট স্ক্রিনেও ফর্মটি স্ক্রল করা যায় */}
        <ScrollView
          contentContainerStyle={AuthStyles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={AuthStyles.contentView}>
            {/* ১. হেডার এবং ফিরে যাওয়ার বাটন */}
            <View style={AuthStyles.headerContainer}>
              <LanguageToggle />
              <Text style={AuthStyles.title}>{t('auth.registerTitle')}</Text>
              <Text style={AuthStyles.subtitle}>
                {t('auth.registerSubtitle')}
              </Text>
            </View>

            {/* ২. রেজিস্ট্রেশন ফর্ম */}
            <View style={AuthStyles.formContainer}>
              <InputField
                value={values.name}
                onChange={v => setField('name', v)}
                placeholder={t('auth.placeholders.name')}
                icon="person-outline"
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
                  >
                    <Icon
                      name={
                        isPasswordVisible ? 'eye-off-outline' : 'eye-outline'
                      }
                      size={22}
                      color="#6b7280"
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
                  >
                    <Icon
                      name={
                        isConfirmPasswordVisible
                          ? 'eye-off-outline'
                          : 'eye-outline'
                      }
                      size={22}
                      color="#6b7280"
                    />
                  </TouchableOpacity>
                }
              />
              {errors.confirmPassword ? (
                <Text style={AuthStyles.errorText}>
                  {errors.confirmPassword}
                </Text>
              ) : null}
            </View>

            {/* ৩. রেজিস্ট্রেশন বাটন */}
            <AppButton
              title={t('auth.buttons.register')}
              onPress={() => handleSubmit(onSubmit)}
            />

            {/* ৪. লগইন স্ক্রিনে ফিরে যাওয়ার লিঙ্ক */}
            <View style={AuthStyles.signupContainer}>
              <Text style={AuthStyles.signupText}>
                {t('auth.links.loginPrompt')}{' '}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={AuthStyles.signupLink}>
                  {t('auth.links.loginLink')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
export default RegisterScreen;
