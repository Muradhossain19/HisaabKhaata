// src/screens/DashboardScreen.tsx

import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
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

// ড্যাশবোর্ডের জন্য নতুন, গ্র্যান্ড হেডার
const DashboardHeader = () => {
  const user = useAppSelector(state => state.auth.user);

  return (
    <View style={styles.headerContainer}>
      <View>
        <Text style={styles.headerGreeting}>স্বাগতম,</Text>
        <Text style={styles.headerUsername}>{user?.name || 'ব্যবহারকারী'}</Text>
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
    <View style={styles.summaryCard}>
      <View style={styles.balanceSection}>
        <Text style={styles.balanceLabel}>বর্তমান ব্যালেন্স</Text>
        <Text style={styles.balanceValue}>৳{balance.toFixed(2)}</Text>
      </View>

      {/* আয়-ব্যয়ের গ্রাফিক্যাল বার */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.incomeBar, { width: `${incomePercentage}%` }]} />
      </View>

      <View style={styles.incomeExpenseSection}>
        <View style={styles.incomeDetail}>
          <View style={[styles.dot, { backgroundColor: '#22c55e' }]} />
          <Text style={styles.detailLabel}>মোট আয়</Text>
          <Text style={styles.incomeValue}>৳{income.toFixed(2)}</Text>
        </View>
        <View style={styles.expenseDetail}>
          <View style={[styles.dot, { backgroundColor: '#ef4444' }]} />
          <Text style={styles.detailLabel}>মোট ব্যয়</Text>
          <Text style={styles.expenseValue}>৳{expense.toFixed(2)}</Text>
        </View>
      </View>
    </View>
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
      <Icon name="add-circle-outline" size={22} color="#22c55e" />
      <Text style={styles.actionButtonText}>টাকা যোগ করুন</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.actionButton} onPress={onAddExpense}>
      <Icon name="remove-circle-outline" size={22} color="#ef4444" />
      <Text style={styles.actionButtonText}>খরচ যোগ করুন</Text>
    </TouchableOpacity>
  </View>
);

// সাম্প্রতিক ট্রানজেকশন রো
const RecentTransactionRow = ({ item }: { item: Transaction }) => {
  const category = defaultCategories.find(c => c.id === item.categoryId);
  const isIncome = item.type === 'income';

  return (
    <View style={styles.recentRow}>
      <View
        style={[
          styles.recentIconContainer,
          {
            backgroundColor: category?.color
              ? `${category.color}20`
              : '#e2e8f0',
          },
        ]}
      >
        <Icon
          name={category?.icon || 'help'}
          size={20}
          color={category?.color || '#64748b'}
        />
      </View>
      <View style={styles.recentDetails}>
        <Text style={styles.recentNote} numberOfLines={1}>
          {item.note || category?.name || 'লেনদেন'}
        </Text>
        <Text style={styles.recentDate}>
          {new Date(item.date).toLocaleDateString('bn-BD', {
            day: 'numeric',
            month: 'short',
          })}
        </Text>
      </View>
      <Text
        style={[
          styles.recentAmount,
          { color: isIncome ? '#16a34a' : '#dc2626' },
        ]}
      >
        {isIncome ? '+' : '-'}৳{item.amount.toFixed(2)}
      </Text>
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f1f5f9" />
      <DashboardHeader />
      <ScrollView contentContainerStyle={styles.scrollView}>
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
            <Text style={styles.sectionTitle}>সাম্প্রতিক লেনদেন</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Transactions')}
            >
              <Text style={styles.seeAllText}>সব দেখুন</Text>
            </TouchableOpacity>
          </View>
          {recent.length > 0 ? (
            <View style={styles.recentListContainer}>
              {recent.map(item => (
                <RecentTransactionRow key={item.id} item={item} />
              ))}
            </View>
          ) : (
            <View style={styles.noTransactionsContainer}>
              <Icon name="document-text-outline" size={40} color="#94a3b8" />
              <Text style={styles.noTransactionsText}>
                কোনো সাম্প্রতিক লেনদেন নেই।
              </Text>
            </View>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9', // হালকা ধূসর ব্যাকগ্রাউন্ড
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  headerGreeting: {
    fontSize: 16,
    color: '#64748b',
  },
  headerUsername: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#fff',
  },
  scrollView: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#475569',
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  balanceSection: {
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#64748b',
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 4,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#ef4444',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  incomeBar: {
    height: '100%',
    backgroundColor: '#22c55e',
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
    fontSize: 14,
    color: '#64748b',
    marginRight: 8,
  },
  incomeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16a34a',
  },
  expenseValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dc2626',
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
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 14,
    elevation: 2,
    shadowColor: '#475569',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
  },
  recentListContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 10,
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
    color: '#334155',
  },
  recentDate: {
    fontSize: 12,
    color: '#94a3b8',
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
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  noTransactionsText: {
    marginTop: 12,
    fontSize: 15,
    color: '#64748b',
  },
});
