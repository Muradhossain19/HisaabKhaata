import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { tokens } from '../../theme/tokens';

type Variant = 'title' | 'subtitle' | 'body' | 'muted' | 'caption';

type Props = TextProps & {
  variant?: Variant;
};

export default function AppText({ variant = 'body', style, ...rest }: Props) {
  return <Text style={[styles.base, styles[variant], style]} {...rest} />;
}

const styles = StyleSheet.create({
  base: {
    color: tokens.colors.text,
  },
  title: {
    fontSize: tokens.typography.size.xl,
    fontWeight: tokens.typography.weight.bold,
  },
  subtitle: {
    fontSize: tokens.typography.size.md,
    lineHeight: 22,
    color: tokens.colors.textMuted,
    fontWeight: tokens.typography.weight.medium,
  },
  body: {
    fontSize: tokens.typography.size.md,
  },
  muted: {
    fontSize: tokens.typography.size.sm,
    color: tokens.colors.textMuted,
  },
  caption: {
    fontSize: tokens.typography.size.xs,
    color: tokens.colors.textSubtle,
  },
});

