import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { tokens } from '../../theme/tokens';

type Props = ViewProps & {
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  padded?: boolean;
  backgroundColor?: string;
};

export default function Screen({
  edges = ['top', 'bottom'],
  padded = true,
  backgroundColor,
  style,
  ...rest
}: Props) {
  return (
    <SafeAreaView
      edges={edges}
      style={[
        styles.safe,
        { backgroundColor: backgroundColor ?? tokens.colors.bg },
      ]}
    >
      <View
        style={[styles.container, padded && styles.padded, style]}
        {...rest}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: tokens.spacing.lg,
  },
});

