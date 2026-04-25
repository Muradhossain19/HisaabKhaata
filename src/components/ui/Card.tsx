import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { tokens } from '../../theme/tokens';

type Props = ViewProps & {
  padded?: boolean;
};

export default function Card({ padded = true, style, ...rest }: Props) {
  return (
    <View
      style={[styles.card, padded && styles.padded, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: tokens.colors.border,
    ...tokens.shadow.card,
  },
  padded: {
    padding: tokens.spacing.lg,
  },
});

