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
import partiesService, { PartySummary } from '../../services/parties';

export default function PartiesListScreen({ navigation }: any) {
  const [rows, setRows] = useState<PartySummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  async function load() {
    setLoading(true);
    try {
      const list = await partiesService.getParties();
      setRows(list);
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to load parties.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <Screen padded={false}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <AppText variant="title">দেনা-পাওনা</AppText>
            <AppText variant="muted" style={{ marginTop: 6 }}>
              ব্যক্তিভিত্তিক বাকি টাকা এবং লেজার
            </AppText>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => setCreateOpen(true)}>
            <AppText style={styles.addBtnText}>Add</AppText>
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
            <AppText variant="body" style={{ fontWeight: '700' }}>
              কোনো পার্টি নেই
            </AppText>
            <AppText variant="muted" style={{ marginTop: 6 }}>
              Backend ledger endpoints connect হলে এখানে list আসবে।
            </AppText>
          </Card>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('PartyLedger', { partyId: item.id })}
            style={styles.row}
          >
            <View style={{ flex: 1 }}>
              <AppText style={styles.rowTitle}>{item.name}</AppText>
              {item.phone ? <AppText variant="caption">{item.phone}</AppText> : null}
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <AppText variant="caption">Due</AppText>
              <AppText style={styles.dueValue}>৳{item.due.toFixed(2)}</AppText>
            </View>
          </TouchableOpacity>
        )}
      />

      <Modal
        visible={createOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setCreateOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <Card style={styles.modalCard}>
            <AppText style={{ fontWeight: '900', fontSize: 18 }}>
              New party
            </AppText>
            <AppText variant="caption" style={{ marginTop: 12 }}>
              Name
            </AppText>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Person / Customer / Supplier"
              style={styles.input}
            />
            <AppText variant="caption" style={{ marginTop: 12 }}>
              Phone (optional)
            </AppText>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="01XXXXXXXXX"
              keyboardType="phone-pad"
              style={styles.input}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={() => setCreateOpen(false)}
              >
                <AppText style={styles.secondaryBtnText}>Cancel</AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={async () => {
                  if (!name.trim()) {
                    Alert.alert('Validation', 'Name is required.');
                    return;
                  }
                  try {
                    await partiesService.createParty({
                      name: name.trim(),
                      phone: phone.trim() || undefined,
                    });
                    setName('');
                    setPhone('');
                    setCreateOpen(false);
                    await load();
                  } catch (e: any) {
                    Alert.alert('Error', e?.message || 'Failed to create party.');
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
  },
  addBtn: {
    backgroundColor: tokens.colors.primary,
    borderRadius: tokens.radii.md,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  addBtnText: { color: '#fff', fontWeight: '800' },
  list: {
    padding: tokens.spacing.lg,
    gap: tokens.spacing.md,
  },
  row: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radii.lg,
    padding: tokens.spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: tokens.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowTitle: {
    fontWeight: '800',
  },
  dueValue: {
    marginTop: 4,
    fontWeight: '800',
    fontSize: 16,
    color: tokens.colors.text,
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

