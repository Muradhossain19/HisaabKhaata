// src/screens/TransactionsListScreen.tsx

import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  // Image,
  ActivityIndicator,
} from 'react-native';
import QuickEntry from '../components/QuickEntry';
import transactionsService from '../services/transactions';
import syncService from '../services/sync';
import { Transaction } from '../types/finance';
import CustomHeader from '../components/CustomHeader'; // ✅ কাস্টম হেডার ইমপোর্ট করা হয়েছে
import Icon from 'react-native-vector-icons/Ionicons';
import defaultCategories from '../data/defaultCategories';
import { tokens } from '../theme/tokens';

// ট্রানজেকশন লিস্টের জন্য একটি নতুন, আধুনিক রো কম্পোনেন্ট
const TransactionRow = ({
  item,
  onDelete,
}: {
  item: Transaction;
  onDelete: (id: string) => void;
}) => {
  const category = defaultCategories.find(c => c.id === item.categoryId);
  const isIncome = item.type === 'income';

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onLongPress={() => onDelete(item.id)}
      style={styles.row}
    >
      {/* ক্যাটাগরি আইকন */}
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: category?.color || '#9ca3af' },
        ]}
      >
        <Icon name={category?.icon || 'help'} size={20} color="#fff" />
      </View>

      {/* ট্রানজেকশনের বিবরণ */}
      <View style={styles.detailsContainer}>
        <Text style={styles.noteText} numberOfLines={1}>
          {item.note || category?.name || 'লেনদেন'}
        </Text>
        <Text style={styles.dateText}>
          {new Date(item.date).toLocaleDateString('bn-BD', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </Text>
      </View>

      {/* টাকার পরিমাণ এবং সিঙ্ক স্ট্যাটাস */}
      <View style={styles.amountContainer}>
        <Text
          style={[
            styles.amountText,
            isIncome ? styles.incomeColor : styles.expenseColor,
          ]}
        >
          {isIncome ? '+' : '-'} ৳{item.amount.toFixed(2)}
        </Text>
        {item.isSynced ? (
          <Icon name="cloud-done-outline" size={16} color="#34d399" />
        ) : (
          <Icon name="cloud-offline-outline" size={16} color="#fbbf24" />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default function TransactionsListScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [quickOpen, setQuickOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    setRefreshing(true);
    try {
      const list = await transactionsService.getAllTransactions();
      setTransactions(list);
    } catch {
      Alert.alert('Error', 'Failed to load transactions.');
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSaved() {
    await load();
  }

  async function handleDelete(id: string) {
    Alert.alert('Delete', 'এই লেনদেনটি ডিলিট করতে চান?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const ok = await transactionsService.deleteTransaction(id);
          if (!ok) Alert.alert('Error', 'Failed to delete transaction.');
          await load();
        },
      },
    ]);
  }

  async function doSync() {
    setRefreshing(true);
    try {
      const { ok, failed } = await syncService.syncOnce();
      Alert.alert('Sync Finished', `Synced: ${ok}, Failed: ${failed}`);
      await load();
    } catch (e: any) {
      console.warn('sync error', e);
      Alert.alert('Sync Error', e.message || 'An unknown error occurred.');
    } finally {
      setRefreshing(false);
    }
  }

  const sections = useMemo(() => {
    // group by yyyy-mm-dd
    const map = new Map<string, Transaction[]>();
    for (const t of transactions) {
      const key = new Date(t.date).toISOString().slice(0, 10);
      const arr = map.get(key) ?? [];
      arr.push(t);
      map.set(key, arr);
    }

    const keys = Array.from(map.keys()).sort((a, b) => (a < b ? 1 : -1));
    return keys.map(k => ({
      title: k,
      data: (map.get(k) ?? []).sort((a, b) => (a.date < b.date ? 1 : -1)),
    }));
  }, [transactions]);

  const dailyBalanceMap = useMemo(() => {
    // Compute running balance by day (oldest -> newest, then read per day)
    const sorted = [...transactions].sort((a, b) => (a.date < b.date ? -1 : 1));
    let running = 0;
    const byDay = new Map<string, number>();
    for (const t of sorted) {
      running += t.type === 'income' ? t.amount : -t.amount;
      const day = new Date(t.date).toISOString().slice(0, 10);
      byDay.set(day, running);
    }
    return byDay;
  }, [transactions]);

  return (
    // ✅ SafeAreaView এর পরিবর্তে View ব্যবহার করা হয়েছে কারণ হেডার নিজেই সেফ এরিয়া হ্যান্ডেল করছে
    <View style={styles.container}>
      <CustomHeader
        title="সকল লেনদেন"
        rightAccessory={
          <TouchableOpacity
            onPress={doSync}
            disabled={refreshing}
            style={styles.syncButton}
          >
            {refreshing ? (
              <ActivityIndicator size="small" color="#2563eb" />
            ) : (
              <Icon name="sync-outline" size={24} color="#2563eb" />
            )}
          </TouchableOpacity>
        }
      />

      <SectionList
        sections={sections}
        keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <TransactionRow item={item} onDelete={handleDelete} />
        )}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeaderText}>
                {new Date(section.title).toLocaleDateString('bn-BD', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </Text>
              <Text style={styles.sectionHeaderBalance}>
                Balance: ৳{(dailyBalanceMap.get(section.title) ?? 0).toFixed(2)}
              </Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContentContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="receipt-outline" size={60} color="#cbd5e1" />
            <Text style={styles.emptyText}>কোনো লেনদেন পাওয়া যায়নি।</Text>
            <Text style={styles.emptySubText}>
              শুরু করতে নিচের '+' বাটনে চাপ দিন।
            </Text>
          </View>
        }
        onRefresh={load}
        refreshing={refreshing}
        stickySectionHeadersEnabled={false}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setQuickOpen(true)}>
        <Icon name="add" size={30} color="#fff" />
      </TouchableOpacity>

      <QuickEntry
        visible={quickOpen}
        onClose={() => setQuickOpen(false)}
        onSave={async payload => {
          await transactionsService.addTransaction(payload);
          await handleSaved();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.bg,
  },
  syncButton: {
    padding: 6,
  },
  listContentContainer: {
    padding: 16,
    paddingBottom: 80, // FAB বাটনের জন্য জায়গা
  },
  sectionHeader: {
    paddingTop: 10,
    paddingBottom: 6,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionHeaderText: {
    fontSize: 13,
    fontWeight: '700',
    color: tokens.colors.textMuted,
    marginLeft: 4,
  },
  sectionHeaderBalance: {
    fontSize: 12,
    fontWeight: '700',
    color: tokens.colors.textSubtle,
    marginRight: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailsContainer: {
    flex: 1,
  },
  noteText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  dateText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  incomeColor: {
    color: '#10b981',
  },
  expenseColor: {
    color: '#ef4444',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#475569',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#2563eb',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
});
