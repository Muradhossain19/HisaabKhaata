import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Screen from '../../components/ui/Screen';
import Card from '../../components/ui/Card';
import AppText from '../../components/ui/AppText';
import { tokens } from '../../theme/tokens';
import paymentMethodsService from '../../services/paymentMethods';
import { PaymentMethod } from '../../types/finance';

export default function PaymentMethodsScreen() {
  const [rows, setRows] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PaymentMethod | null>(null);
  const [name, setName] = useState('');

  async function load() {
    setLoading(true);
    try {
      const list = await paymentMethodsService.getPaymentMethods();
      setRows(list);
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to load payment methods.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditing(null);
    setName('');
    setModalOpen(true);
  }

  function openEdit(p: PaymentMethod) {
    setEditing(p);
    setName(p.name);
    setModalOpen(true);
  }

  async function save() {
    if (!name.trim()) {
      Alert.alert('Validation', 'Name is required.');
      return;
    }
    try {
      if (editing) {
        await paymentMethodsService.updatePaymentMethod(editing.id, {
          name: name.trim(),
        });
      } else {
        await paymentMethodsService.createPaymentMethod({ name: name.trim() });
      }
      setModalOpen(false);
      await load();
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to save payment method.');
    }
  }

  async function remove(id: string) {
    Alert.alert('Delete', 'Delete this payment method?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await paymentMethodsService.deletePaymentMethod(id);
            await load();
          } catch (e: any) {
            Alert.alert('Error', e?.message || 'Failed to delete payment method.');
          }
        },
      },
    ]);
  }

  return (
    <Screen>
      <View style={styles.headerRow}>
        <AppText variant="title">Payment methods</AppText>
        <TouchableOpacity style={styles.primaryBtn} onPress={openCreate}>
          <AppText style={styles.primaryBtnText}>Add</AppText>
        </TouchableOpacity>
      </View>

      <FlatList
        data={rows}
        keyExtractor={i => i.id}
        refreshing={loading}
        onRefresh={load}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={
          <Card>
            <AppText style={{ fontWeight: '800' }}>No payment methods</AppText>
            <AppText variant="muted" style={{ marginTop: 6 }}>
              Tap “Add” to create your first payment method.
            </AppText>
          </Card>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => openEdit(item)}
            onLongPress={() => remove(item.id)}
            style={styles.row}
          >
            <View style={{ flex: 1 }}>
              <AppText style={styles.rowTitle}>{item.name}</AppText>
            </View>
            <AppText variant="caption">Edit</AppText>
          </TouchableOpacity>
        )}
      />

      <Modal visible={modalOpen} transparent animationType="fade" onRequestClose={() => setModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <Card style={styles.modalCard}>
            <AppText style={{ fontWeight: '900', fontSize: 18 }}>
              {editing ? 'Edit payment method' : 'New payment method'}
            </AppText>

            <AppText variant="caption" style={{ marginTop: 12 }}>
              Name
            </AppText>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g. Cash, Bkash"
              style={styles.input}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setModalOpen(false)}
                style={styles.secondaryBtn}
              >
                <AppText style={styles.secondaryBtnText}>Cancel</AppText>
              </TouchableOpacity>
              <TouchableOpacity onPress={save} style={styles.primaryBtnWide}>
                <AppText style={styles.primaryBtnText}>Save</AppText>
              </TouchableOpacity>
            </View>
          </Card>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.lg,
  },
  primaryBtn: {
    backgroundColor: tokens.colors.primary,
    borderRadius: tokens.radii.md,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  primaryBtnWide: {
    flex: 1,
    backgroundColor: tokens.colors.primary,
    borderRadius: tokens.radii.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#fff', fontWeight: '800' },
  row: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radii.lg,
    padding: tokens.spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: tokens.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.md,
  },
  rowTitle: { fontWeight: '900' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: tokens.spacing.lg,
  },
  modalCard: {
    maxWidth: 520,
    alignSelf: 'center',
    width: '100%',
  },
  input: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.radii.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: tokens.colors.surface,
    color: tokens.colors.text,
  },
  modalActions: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
    marginTop: tokens.spacing.lg,
  },
  secondaryBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.radii.md,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: tokens.colors.surface,
  },
  secondaryBtnText: { fontWeight: '800', color: tokens.colors.text },
});

