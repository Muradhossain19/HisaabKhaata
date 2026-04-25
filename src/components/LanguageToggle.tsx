import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTranslation } from '../i18n';
import { authColors } from '../theme/authTheme';

const LanguageToggle: React.FC = () => {
  const { lang, setLang } = useTranslation();
  return (
    <View
      style={styles.container}
      accessibilityRole="toolbar"
      accessibilityLabel="Language selector"
    >
      <TouchableOpacity
        accessibilityLabel={
          lang === 'bn' ? 'Switch to English' : 'Switch to Bangla'
        }
        accessibilityState={{ selected: false }}
        style={styles.pill}
        onPress={() => setLang(lang === 'bn' ? 'en' : 'bn')}
        activeOpacity={0.85}
      >
        <Text style={styles.label}>{lang === 'bn' ? 'EN' : 'বাংলা'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: authColors.inputBg,
    borderWidth: 1.5,
    borderColor: authColors.border,
  },
  label: {
    color: authColors.text,
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.2,
  },
});

export default React.memo(LanguageToggle);
