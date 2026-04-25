// src/screens/DashboardScreen.tsx

import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import transactionsService from '../services/transactions';
import { Transaction } from '../types/finance';
import Icon from 'react-native-vector-icons/Ionicons';
import QuickEntry from '../components/QuickEntry';
import { useAppSelector } from '../store/hooks';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppTabParamList } from '../navigation/AppNavigator';
import defaultCategories from '../data/defaultCategories';
import Screen from '../components/ui/Screen';
import Card from '../components/ui/Card';
import AppText from '../components/ui/AppText';
import { tokens } from '../theme/tokens';

// ড্যাশবোর্ডের জন্য নতুন, গ্র্যান্ড হেডার
const DashboardHeader = () => {
  const user = useAppSelector(state => state.auth.user);

  return (
    <View style={styles.headerContainer}>
      <View>
        <AppText variant="muted" style={styles.headerGreeting}>
          স্বাগতম,
        </AppText>
        <AppText style={styles.headerUsername}>
          {user?.name || 'ব্যবহারকারী'}
        </AppText>
      </View>
      <TouchableOpacity>
        <Image
          source={{ uri: `https://i.pravatar.cc/150?u=${user?.email}` }}
          style={styles.avatar}
        />
      </TouchableOpacity>
    </View>
  );
};

// "আমার হিসাব" কার্ড - সম্পূর্ণ নতুন ডিজাইন
const AccountSummaryCard = ({
  balance,
  income,
  expense,
}: {
  balance: number;
  income: number;
  expense: number;
}) => {
  const total = income + expense;
  const incomePercentage = total > 0 ? (income / total) * 100 : 0;

  return (
    <Card style={styles.summaryCard}>
      <View style={styles.balanceSection}>
        <AppText variant="muted" style={styles.balanceLabel}>
          বর্তমান ব্যালেন্স
        </AppText>
        <AppText style={styles.balanceValue}>৳{balance.toFixed(2)}</AppText>
      </View>

      {/* আয়-ব্যয়ের গ্রাফিক্যাল বার */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.incomeBar, { width: `${incomePercentage}%` }]} />
      </View>

      <View style={styles.incomeExpenseSection}>
        <View style={styles.incomeDetail}>
          <View
            style={[styles.dot, { backgroundColor: tokens.colors.success }]}
          />
          <AppText variant="caption" style={styles.detailLabel}>
            মোট আয়
          </AppText>
          <AppText style={styles.incomeValue}>৳{income.toFixed(2)}</AppText>
        </View>
        <View style={styles.expenseDetail}>
          <View style={[styles.dot, { backgroundColor: tokens.colors.danger }]} />
          <AppText variant="caption" style={styles.detailLabel}>
            মোট ব্যয়
          </AppText>
          <AppText style={styles.expenseValue}>৳{expense.toFixed(2)}</AppText>
        </View>
      </View>
    </Card>
  );
};

// কুইক অ্যাকশন বাটন
const QuickActions = ({
  onAddIncome,
  onAddExpense,
}: {
  onAddIncome: () => void;
  onAddExpense: () => void;
}) => (
  <View style={styles.quickActionsContainer}>
    <TouchableOpacity style={styles.actionButton} onPress={onAddIncome}>
      <Icon
        name="add-circle-outline"
        size={22}
        color={tokens.colors.success}
      />
      <AppText style={styles.actionButtonText}>টাকা যোগ করুন</AppText>
    </TouchableOpacity>
    <TouchableOpacity style={styles.actionButton} onPress={onAddExpense}>
      <Icon
        name="remove-circle-outline"
        size={22}
        color={tokens.colors.danger}
      />
      <AppText style={styles.actionButtonText}>খরচ যোগ করুন</AppText>
    </TouchableOpacity>
  </View>
);

// সাম্প্রতিক ট্রানজেকশন রো
const RecentTransactionRow = ({ item }: { item: Transaction }) => {
  const category = defaultCategories.find(c => c.id === item.categoryId);
  const isIncome = item.type === 'income';
  const amountColor = isIncome ? tokens.colors.success : tokens.colors.danger;

  return (
    <View style={styles.recentRow}>
      <View
        style={[
          styles.recentIconContainer,
          {
            backgroundColor: category?.color
              ? `${category.color}20`
              : tokens.colors.border,
          },
        ]}
      >
        <Icon
          name={category?.icon || 'help'}
          size={20}
          color={category?.color || tokens.colors.textMuted}
        />
      </View>
      <View style={styles.recentDetails}>
        <AppText style={styles.recentNote} numberOfLines={1}>
          {item.note || category?.name || 'লেনদেন'}
        </AppText>
        <AppText variant="caption" style={styles.recentDate}>
          {new Date(item.date).toLocaleDateString('bn-BD', {
            day: 'numeric',
            month: 'short',
          })}
        </AppText>
      </View>
      <AppText style={[styles.recentAmount, { color: amountColor }]}>
        {isIncome ? '+' : '-'}৳{item.amount.toFixed(2)}
      </AppText>
    </View>
  );
};

export default function DashboardScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppTabParamList>>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [quickOpen, setQuickOpen] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const list = await transactionsService.getAllTransactions();
    setTransactions(list);
  }

  const summary = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const t of transactions) {
      if (t.type === 'income') income += t.amount;
      else expense += t.amount;
    }
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const recent = transactions.slice(0, 5);

  return (
    <Screen padded={false} backgroundColor={tokens.colors.bg}>
      <DashboardHeader />
      <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
        <AccountSummaryCard
          balance={summary.balance}
          income={summary.income}
          expense={summary.expense}
        />

        <QuickActions
          onAddIncome={() => setQuickOpen(true)}
          onAddExpense={() => setQuickOpen(true)}
        />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AppText style={styles.sectionTitle}>সাম্প্রতিক লেনদেন</AppText>
            <TouchableOpacity
              onPress={() => navigation.navigate('Transactions')}
            >
              <AppText style={styles.seeAllText}>সব দেখুন</AppText>
            </TouchableOpacity>
          </View>
          {recent.length > 0 ? (
            <Card padded={false} style={styles.recentListContainer}>
              {recent.map(item => (
                <RecentTransactionRow key={item.id} item={item} />
              ))}
            </Card>
          ) : (
            <Card style={styles.noTransactionsContainer}>
              <Icon
                name="document-text-outline"
                size={40}
                color={tokens.colors.textSubtle}
              />
              <AppText variant="muted" style={styles.noTransactionsText}>
                কোনো সাম্প্রতিক লেনদেন নেই।
              </AppText>
            </Card>
          )}
        </View>
      </ScrollView>

      <QuickEntry
        visible={quickOpen}
        onClose={() => setQuickOpen(false)}
        onSave={async payload => {
          await transactionsService.addTransaction(payload);
          await load();
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.bg,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.lg,
    paddingTop: tokens.spacing.md,
    paddingBottom: tokens.spacing.md,
  },
  headerGreeting: {
    fontSize: tokens.typography.size.sm,
  },
  headerUsername: {
    fontSize: tokens.typography.size.xl,
    fontWeight: tokens.typography.weight.extrabold,
    color: tokens.colors.text,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#fff',
  },
  scrollView: {
    paddingHorizontal: tokens.spacing.lg,
    paddingBottom: 100,
  },
  summaryCard: {
    borderRadius: tokens.radii.xl,
  },
  balanceSection: {
    marginBottom: tokens.spacing.lg,
  },
  balanceLabel: {
    fontSize: tokens.typography.size.sm,
  },
  balanceValue: {
    fontSize: tokens.typography.size['2xl'],
    fontWeight: tokens.typography.weight.extrabold,
    color: tokens.colors.text,
    marginTop: 4,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: tokens.colors.danger,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: tokens.spacing.lg,
  },
  incomeBar: {
    height: '100%',
    backgroundColor: tokens.colors.success,
    borderRadius: 4,
  },
  incomeExpenseSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  incomeDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expenseDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  detailLabel: {
    marginRight: 8,
  },
  incomeValue: {
    fontSize: tokens.typography.size.sm,
    fontWeight: tokens.typography.weight.semibold,
    color: tokens.colors.success,
  },
  expenseValue: {
    fontSize: tokens.typography.size.sm,
    fontWeight: tokens.typography.weight.semibold,
    color: tokens.colors.danger,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radii.md,
    paddingVertical: 14,
    elevation: 2,
    shadowColor: '#475569',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: tokens.colors.textMuted,
    marginLeft: 8,
  },
  section: {
    marginTop: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: tokens.typography.size.lg,
    fontWeight: tokens.typography.weight.extrabold,
    color: tokens.colors.text,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: tokens.colors.primary,
  },
  recentListContainer: {
    borderRadius: tokens.radii.lg,
    padding: tokens.spacing.sm,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  recentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recentDetails: {
    flex: 1,
  },
  recentNote: {
    fontSize: 15,
    fontWeight: '500',
    color: tokens.colors.text,
  },
  recentDate: {
    marginTop: 2,
  },
  recentAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  noTransactionsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    borderRadius: tokens.radii.lg,
  },
  noTransactionsText: {
    marginTop: 12,
  },
});
