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
import categoriesService from '../../services/categories';
import { Category } from '../../types/finance';

export default function CategoriesScreen() {
  const [rows, setRows] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState<Category['type']>('expense');

  async function load() {
    setLoading(true);
    try {
      const list = await categoriesService.getCategories();
      setRows(list);
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to load categories.');
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
    setType('expense');
    setModalOpen(true);
  }

  function openEdit(c: Category) {
    setEditing(c);
    setName(c.name);
    setType(c.type);
    setModalOpen(true);
  }

  async function save() {
    if (!name.trim()) {
      Alert.alert('Validation', 'Category name is required.');
      return;
    }
    try {
      if (editing) {
        await categoriesService.updateCategory(editing.id, { name: name.trim(), type });
      } else {
        await categoriesService.createCategory({ name: name.trim(), type });
      }
      setModalOpen(false);
      await load();
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to save category.');
    }
  }

  async function remove(id: string) {
    Alert.alert('Delete', 'Delete this category?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await categoriesService.deleteCategory(id);
            await load();
          } catch (e: any) {
            Alert.alert('Error', e?.message || 'Failed to delete category.');
          }
        },
      },
    ]);
  }

  return (
    <Screen>
      <View style={styles.headerRow}>
        <AppText variant="title">Categories</AppText>
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
            <AppText style={{ fontWeight: '800' }}>No categories</AppText>
            <AppText variant="muted" style={{ marginTop: 6 }}>
              Tap “Add” to create your first category.
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
              <AppText variant="caption">{item.type}</AppText>
            </View>
            <AppText variant="caption">Edit</AppText>
          </TouchableOpacity>
        )}
      />

      <Modal visible={modalOpen} transparent animationType="fade" onRequestClose={() => setModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <Card style={styles.modalCard}>
            <AppText style={{ fontWeight: '900', fontSize: 18 }}>
              {editing ? 'Edit category' : 'New category'}
            </AppText>

            <AppText variant="caption" style={{ marginTop: 12 }}>
              Name
            </AppText>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Category name"
              style={styles.input}
            />

            <AppText variant="caption" style={{ marginTop: 12 }}>
              Type
            </AppText>
            <View style={styles.typeRow}>
              {(['expense', 'income', 'both'] as const).map(v => (
                <TouchableOpacity
                  key={v}
                  onPress={() => setType(v)}
                  style={[
                    styles.typeChip,
                    type === v && styles.typeChipActive,
                  ]}
                >
                  <AppText
                    style={[
                      styles.typeChipText,
                      type === v && styles.typeChipTextActive,
                    ]}
                  >
                    {v}
                  </AppText>
                </TouchableOpacity>
              ))}
            </View>

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
  },
  typeChipTextActive: {
    color: tokens.colors.primary,
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

