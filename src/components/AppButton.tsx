import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { authColors } from '../theme/authTheme';

type Props = {
  title: string;
  onPress: () => void;
  style?: object | object[];
  loading?: boolean;
};

const AppButton = ({ title, onPress, style, loading }: Props) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.88}
    style={[styles.button, loading && styles.buttonDisabled, style]}
    disabled={!!loading}
    accessibilityRole="button"
    accessibilityState={{ disabled: !!loading, busy: !!loading }}
  >
    {loading ? (
      <View style={styles.loadingRow}>
        <ActivityIndicator color="#fff" size="small" />
      </View>
    ) : (
      <Text style={styles.text}>{title}</Text>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    width: '100%',
    backgroundColor: authColors.primary,
    paddingVertical: 15,
    minHeight: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: authColors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 6,
  },
  buttonDisabled: {
    opacity: 0.92,
  },
  loadingRow: {
    minHeight: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default AppButton;
