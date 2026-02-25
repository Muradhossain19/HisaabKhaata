import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTranslation } from '../i18n';

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
        style={[
          styles.pill,
          lang === 'bn' ? styles.inactivePill : styles.inactivePill,
        ]}
        onPress={() => setLang(lang === 'bn' ? 'en' : 'bn')}
      >
        <Text style={[styles.label, styles.inactiveLabel]}>
          {lang === 'bn' ? 'EN' : 'বাংলা'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginRight: 4,
    marginBottom: 8,
    padding: 2,
    backgroundColor: 'transparent',
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  label: {
    color: '#0f172a',
    fontWeight: '600',
    fontSize: 13,
  },
  active: {
    backgroundColor: '#0ea5e9',
    borderColor: '#0ea5e9',
  },
  activeLabel: {
    color: '#fff',
  },
  icon: {
    marginRight: 6,
  },
  activePill: {
    backgroundColor: '#0ea5e9',
    borderWidth: 0,
  },
  inactivePill: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e6eefc',
  },
  inactiveLabel: {
    color: '#0f172a',
  },
});

export default React.memo(LanguageToggle);
