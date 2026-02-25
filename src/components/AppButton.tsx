import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type Props = {
  title: string;
  onPress: () => void;
  style?: any;
  loading?: boolean;
};

const AppButton = ({ title, onPress, style, loading }: Props) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.button, style]}
    disabled={!!loading}
  >
    <Text style={styles.text}>{loading ? '...' : title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    width: '100%',
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 5,
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AppButton;
