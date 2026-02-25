// src/screens/TransactionsListScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
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

// ট্রানজেকশন লিস্টের জন্য একটি নতুন, আধুনিক রো কম্পোনেন্ট
const TransactionRow = ({ item }: { item: Transaction }) => {
  const category = defaultCategories.find(c => c.id === item.categoryId);
  const isIncome = item.type === 'income';

  return (
    <View style={styles.row}>
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
    </View>
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

      <FlatList
        data={transactions}
        keyExtractor={i => i.id}
        renderItem={({ item }) => <TransactionRow item={item} />}
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
        onRefresh={load} // Pull-to-refresh এর জন্য `load` ফাংশন ব্যবহার করা হয়েছে
        refreshing={refreshing}
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
    backgroundColor: '#f8fafc', // একটি হালকা ব্যাকগ্রাউন্ড
  },
  syncButton: {
    padding: 6,
  },
  listContentContainer: {
    padding: 16,
    paddingBottom: 80, // FAB বাটনের জন্য জায়গা
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
