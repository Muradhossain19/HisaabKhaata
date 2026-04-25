import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import AuthStyles from '../../components/AuthStyles';
import AuthScreenShell from '../../components/AuthScreenShell';
import LanguageToggle from '../../components/LanguageToggle';
import InputField from '../../components/InputField';
import AppButton from '../../components/AppButton';
import apiClient from '../../api/client';
import { useTranslation } from '../../i18n';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { authMetrics } from '../../theme/authTheme';

const ForgotPassword = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const m = authMetrics(width);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email) {
      Alert.alert(t('auth.validation.emailRequired'));
      return;
    }
    setLoading(true);
    try {
      await apiClient.post('/api/password/forgot', { email });
      Alert.alert(t('auth.alerts.forgotPasswordSent'));
      navigation.goBack();
    } catch (err: any) {
      Alert.alert(
        err?.response?.data?.message || t('auth.alerts.forgotPasswordFailed'),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreenShell centerVertical>
      <View style={AuthStyles.navRow}>
        <TouchableOpacity
          style={AuthStyles.backRow}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel={t('auth.links.back')}
        >
          <Icon name="chevron-back" size={24} color="#64748b" />
          <Text style={AuthStyles.backLabel}>{t('auth.links.back')}</Text>
        </TouchableOpacity>
        <LanguageToggle />
      </View>

      <View style={AuthStyles.headerContainer}>
        <Text style={[AuthStyles.title, { fontSize: m.titleSize }]}>
          {t('auth.forgotTitle')}
        </Text>
        <Text style={[AuthStyles.subtitle, { fontSize: m.subtitleSize }]}>
          {t('auth.forgotSubtitle')}
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
      </View>

      <AppButton
        title={t('auth.buttons.sendReset')}
        onPress={submit}
        loading={loading}
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

export default ForgotPassword;
