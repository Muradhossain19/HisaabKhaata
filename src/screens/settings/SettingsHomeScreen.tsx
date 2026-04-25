import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Screen from '../../components/ui/Screen';
import AppText from '../../components/ui/AppText';
import Card from '../../components/ui/Card';
import { tokens } from '../../theme/tokens';

export default function SettingsHomeScreen({ navigation }: any) {
  return (
    <Screen style={styles.container}>
      <Card style={styles.card}>
        <AppText variant="title">সেটিংস</AppText>
        <AppText variant="subtitle" style={styles.subtitle}>
          ভাষা (BN/EN), কারেন্সি, ব্যাকআপ/সিঙ্ক স্ট্যাটাস, এবং লগআউট এখানে থাকবে।
        </AppText>

        <View style={styles.divider} />

        <TouchableOpacity
          onPress={() => navigation.navigate('Categories')}
          style={styles.linkRow}
        >
          <AppText style={styles.linkTitle}>Categories</AppText>
          <AppText variant="caption">Manage</AppText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('PaymentMethods')}
          style={styles.linkRow}
        >
          <AppText style={styles.linkTitle}>Payment methods</AppText>
          <AppText variant="caption">Manage</AppText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Parties')}
          style={styles.linkRow}
        >
          <AppText style={styles.linkTitle}>দেনা-পাওনা</AppText>
          <AppText variant="caption">View</AppText>
        </TouchableOpacity>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: tokens.spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 520,
  },
  subtitle: {
    marginTop: 10,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: tokens.colors.border,
    marginTop: tokens.spacing.lg,
    marginBottom: tokens.spacing.md,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  linkTitle: {
    fontWeight: '800',
  },
});

