import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { Category, Transaction } from '../types/finance';
import defaultCategories from '../data/defaultCategories';
import transactionsService from '../services/transactions';

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
  const snapPoints = useMemo(() => ['45%', '80%'], []);
  const sheetRef = useRef<any>(null);

  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    recentCategories?.[0]?.id ?? defaultCategories[0].id,
  );

  async function handleSave() {
    const numeric = parseFloat(amount || '0');
    if (numeric <= 0) return; // simple validation
    const payload: Partial<Transaction> = {
      amount: numeric,
      type: 'expense',
      categoryId: selectedCategory ?? null,
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
            data={defaultCategories}
            keyExtractor={i => i.id}
            renderItem={renderCategory}
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 8 }}
          />

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
