import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import ledgerService, { LedgerEntry, PartyHeader } from '../../services/ledger';

export default function PartyLedgerScreen({ route }: any) {
  const partyId: string = route?.params?.partyId;
  const [header, setHeader] = useState<PartyHeader | null>(null);
  const [rows, setRows] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [direction, setDirection] = useState<'you_get' | 'you_give'>('you_get');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await ledgerService.getLedger(partyId);
      setHeader(res.party);
      setRows(res.entries);
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to load ledger.');
    } finally {
      setLoading(false);
    }
  }, [partyId]);

  useEffect(() => {
    if (partyId) load();
  }, [partyId, load]);

  const due = useMemo(() => {
    let total = 0;
    for (const e of rows) total += e.direction === 'you_get' ? e.amount : -e.amount;
    return total;
  }, [rows]);

  return (
    <Screen padded={false}>
      <View style={styles.header}>
        <AppText variant="title">{header?.name || 'Ledger'}</AppText>
        <AppText variant="muted" style={{ marginTop: 6 }}>
          Current due: ৳{due.toFixed(2)}
        </AppText>
      </View>

      <View style={styles.actionsRow}>
        <View style={styles.actionsInner}>
          <TouchableOpacity style={styles.actionBtn} onPress={load}>
            <AppText style={styles.actionBtnText}>
              {loading ? 'Loading…' : 'Refresh'}
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtnSecondary}
            onPress={() => setAddOpen(true)}
          >
            <AppText style={styles.actionBtnSecondaryText}>Add entry</AppText>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={rows}
        keyExtractor={i => i.id}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={load}
        ListEmptyComponent={
          <Card>
            <AppText style={{ fontWeight: '800' }}>No entries</AppText>
            <AppText variant="muted" style={{ marginTop: 6 }}>
              Add due/settle UI পরের ধাপে যোগ হবে।
            </AppText>
          </Card>
        }
        renderItem={({ item }) => (
          <Card style={styles.entryCard}>
            <View style={styles.entryRow}>
              <AppText style={{ fontWeight: '800' }}>
                {item.direction === 'you_get' ? 'পাবো' : 'দেবো'}
              </AppText>
              <AppText
                style={{
                  fontWeight: '900',
                  color:
                    item.direction === 'you_get'
                      ? tokens.colors.success
                      : tokens.colors.danger,
                }}
              >
                ৳{item.amount.toFixed(2)}
              </AppText>
            </View>
            {item.note ? (
              <AppText variant="muted" style={{ marginTop: 6 }}>
                {item.note}
              </AppText>
            ) : null}
            <AppText variant="caption" style={{ marginTop: 8 }}>
              {new Date(item.date).toLocaleDateString('bn-BD', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </AppText>
          </Card>
        )}
      />

      <Modal
        visible={addOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setAddOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <Card style={styles.modalCard}>
            <AppText style={{ fontWeight: '900', fontSize: 18 }}>
              Add ledger entry
            </AppText>

            <AppText variant="caption" style={{ marginTop: 12 }}>
              Type
            </AppText>
            <View style={styles.typeRow}>
              <TouchableOpacity
                onPress={() => setDirection('you_get')}
                style={[
                  styles.typeChip,
                  direction === 'you_get' && styles.typeChipActive,
                ]}
              >
                <AppText
                  style={[
                    styles.typeChipText,
                    direction === 'you_get' && styles.typeChipTextActive,
                  ]}
                >
                  You will get
                </AppText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setDirection('you_give')}
                style={[
                  styles.typeChip,
                  direction === 'you_give' && styles.typeChipActive,
                ]}
              >
                <AppText
                  style={[
                    styles.typeChipText,
                    direction === 'you_give' && styles.typeChipTextActive,
                  ]}
                >
                  You will give
                </AppText>
              </TouchableOpacity>
            </View>

            <AppText variant="caption" style={{ marginTop: 12 }}>
              Amount
            </AppText>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              keyboardType="numeric"
              style={styles.input}
            />

            <AppText variant="caption" style={{ marginTop: 12 }}>
              Note (optional)
            </AppText>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Note"
              style={styles.input}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={() => setAddOpen(false)}
              >
                <AppText style={styles.secondaryBtnText}>Cancel</AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={async () => {
                  const n = Number(amount);
                  if (!Number.isFinite(n) || n <= 0) {
                    Alert.alert('Validation', 'Amount must be greater than 0.');
                    return;
                  }
                  try {
                    await ledgerService.addLedgerEntry(partyId, {
                      direction,
                      amount: n,
                      note: note.trim() || undefined,
                    });
                    setAmount('');
                    setNote('');
                    setAddOpen(false);
                    await load();
                  } catch (e: any) {
                    Alert.alert('Error', e?.message || 'Failed to add entry.');
                  }
                }}
              >
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
  header: {
    paddingHorizontal: tokens.spacing.lg,
    paddingTop: tokens.spacing.lg,
    paddingBottom: tokens.spacing.md,
  },
  actionsRow: {
    paddingHorizontal: tokens.spacing.lg,
    paddingBottom: tokens.spacing.md,
  },
  actionsInner: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: tokens.colors.primary,
    borderRadius: tokens.radii.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionBtnText: { color: '#fff', fontWeight: '800' },
  actionBtnSecondary: {
    flex: 1,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.radii.md,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: tokens.colors.surface,
  },
  actionBtnSecondaryText: { color: tokens.colors.text, fontWeight: '800' },
  list: {
    padding: tokens.spacing.lg,
    gap: tokens.spacing.md,
  },
  entryCard: {
    padding: tokens.spacing.lg,
  },
  entryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
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
  typeRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  typeChip: {
    flex: 1,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.radii.md,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: tokens.colors.surface,
  },
  typeChipActive: {
    borderColor: tokens.colors.primary,
  },
  typeChipText: {
    fontWeight: '800',
    color: tokens.colors.textMuted,
    fontSize: 12,
  },
  typeChipTextActive: {
    color: tokens.colors.primary,
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
  primaryBtn: {
    flex: 1,
    backgroundColor: tokens.colors.primary,
    borderRadius: tokens.radii.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#fff', fontWeight: '800' },
});

