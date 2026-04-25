import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { Category, PaymentMethod, Transaction } from '../types/finance';
import defaultCategories from '../data/defaultCategories';
import transactionsService from '../services/transactions';
import categoriesService from '../services/categories';
import paymentMethodsService from '../services/paymentMethods';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (txn: Partial<Transaction>) => void;
  recentCategories?: Category[];
};

export default function QuickEntry({
  visible,
  onClose,
  onSave,
  recentCategories,
}: Props) {
  // Using Modal fallback instead of @gorhom/bottom-sheet to avoid native deps during dev
  useMemo(() => ['45%', '80%'], []);
  useRef<any>(null);

  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [type, setType] = useState<Transaction['type']>('expense');
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    recentCategories?.[0]?.id ?? defaultCategories[0].id,
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (!visible) return;
    (async () => {
      try {
        const remote = await categoriesService.getCategories();
        if (remote.length) setCategories(remote);
      } catch {}
      try {
        const pm = await paymentMethodsService.getPaymentMethods();
        if (pm.length) {
          setPaymentMethods(pm);
          setSelectedPaymentMethod(pm[0]?.id ?? null);
        }
      } catch {}
    })();
  }, [visible]);

  async function handleSave() {
    const numeric = parseFloat(amount || '0');
    if (numeric <= 0) return; // simple validation
    const payload: Partial<Transaction> = {
      amount: numeric,
      type,
      categoryId: selectedCategory ?? null,
      paymentMethodId: selectedPaymentMethod ?? null,
      note: note || undefined,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    try {
      if (onSave) {
        await onSave(payload);
      } else {
        await transactionsService.addTransaction(payload);
      }
    } catch (e) {
      console.warn('QuickEntry save error', e);
    }

    setAmount('');
    setNote('');
    onClose();
  }

  function renderCategory({ item }: { item: Category }) {
    const active = item.id === selectedCategory;
    return (
      <TouchableOpacity
        onPress={() => setSelectedCategory(item.id)}
        style={[styles.chip, active && styles.chipActive]}
      >
        <Text style={[styles.chipText, active && styles.chipTextActive]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  }

  function renderPaymentMethod({ item }: { item: PaymentMethod }) {
    const active = item.id === selectedPaymentMethod;
    return (
      <TouchableOpacity
        onPress={() => setSelectedPaymentMethod(item.id)}
        style={[styles.chip, active && styles.chipActive]}
      >
        <Text style={[styles.chipText, active && styles.chipTextActive]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
      <View style={styles.modalContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Quick Entry</Text>

          <View style={styles.typeRow}>
            <TouchableOpacity
              onPress={() => setType('expense')}
              style={[
                styles.typeChip,
                type === 'expense' && styles.typeChipActiveExpense,
              ]}
            >
              <Text
                style={[
                  styles.typeChipText,
                  type === 'expense' && styles.typeChipTextActive,
                ]}
              >
                Expense
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setType('income')}
              style={[
                styles.typeChip,
                type === 'income' && styles.typeChipActiveIncome,
              ]}
            >
              <Text
                style={[
                  styles.typeChipText,
                  type === 'income' && styles.typeChipTextActive,
                ]}
              >
                Income
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.amount}
            placeholder="0.00"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            autoFocus
          />

          <Text style={styles.label}>Category</Text>
          <FlatList
            horizontal
            data={categories}
            keyExtractor={i => i.id}
            renderItem={renderCategory}
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 8 }}
          />

          {paymentMethods.length ? (
            <>
              <Text style={styles.label}>Payment</Text>
              <FlatList
                horizontal
                data={paymentMethods}
                keyExtractor={i => i.id}
                renderItem={renderPaymentMethod}
                showsHorizontalScrollIndicator={false}
                style={{ marginBottom: 8 }}
              />
            </>
          ) : null}

          <TextInput
            style={styles.note}
            placeholder="Note (optional)"
            value={note}
            onChangeText={setNote}
          />

          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  typeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  typeChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
  },
  typeChipActiveExpense: {
    backgroundColor: '#fee2e2',
  },
  typeChipActiveIncome: {
    backgroundColor: '#dcfce7',
  },
  typeChipText: { fontSize: 14, color: '#334155', fontWeight: '700' },
  typeChipTextActive: { color: '#0f172a' },
  amount: {
    fontSize: 28,
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
    marginBottom: 12,
  },
  label: { fontSize: 14, color: '#444', marginBottom: 6 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f3f3f3',
    borderRadius: 20,
    marginRight: 8,
  },
  chipActive: { backgroundColor: '#007AFF' },
  chipText: { fontSize: 14, color: '#333' },
  chipTextActive: { color: '#fff' },
  note: {
    borderWidth: 1,
    borderColor: '#eee',
    padding: 10,
    borderRadius: 8,
    minHeight: 44,
    marginBottom: 12,
  },
  actions: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelBtn: { padding: 12 },
  cancelText: { color: '#666' },
  saveBtn: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  saveText: { color: '#fff', fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  modalContainer: { justifyContent: 'flex-end', flex: 1 },
});
