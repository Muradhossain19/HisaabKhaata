import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthStyles from '../../components/AuthStyles';
import LanguageToggle from '../../components/LanguageToggle';
import InputField from '../../components/InputField';
import AppButton from '../../components/AppButton';
import apiClient from '../../api/client';
import { useTranslation } from '../../i18n';

const ForgotPassword = ({ navigation }: any) => {
  const { t } = useTranslation();
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
    <SafeAreaView style={AuthStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f4f8" />
      <View style={AuthStyles.contentView}>
        <View style={AuthStyles.headerContainer}>
          <LanguageToggle />
          <Text style={AuthStyles.title}>{t('auth.forgotTitle')}</Text>
          <Text style={AuthStyles.subtitle}>{t('auth.forgotSubtitle')}</Text>
        </View>

        <View style={AuthStyles.formContainer}>
          <InputField
            value={email}
            onChange={setEmail}
            placeholder={t('auth.placeholders.email')}
            keyboardType="email-address"
          />
        </View>

        <AppButton
          title={t('auth.buttons.sendReset')}
          onPress={submit}
          loading={loading}
        />
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
    </SafeAreaView>
  );
};

export default ForgotPassword;
