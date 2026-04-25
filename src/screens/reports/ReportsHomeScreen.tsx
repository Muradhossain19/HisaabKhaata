import React, { useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import Screen from '../../components/ui/Screen';
import AppText from '../../components/ui/AppText';
import Card from '../../components/ui/Card';
import { tokens } from '../../theme/tokens';
import DateRangeFilter from '../../components/DateRangeFilter';
import transactionsService from '../../services/transactions';
import exportService from '../../services/export';
import { Transaction } from '../../types/finance';
import categoriesService from '../../services/categories';
import CategoryPieChart from '../../components/Charts/CategoryPieChart';
import { Category } from '../../types/finance';

export default function ReportsHomeScreen() {
  const [from, setFrom] = useState<Date | undefined>(undefined);
  const [to, setTo] = useState<Date | undefined>(undefined);
  const [rows, setRows] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const list = await categoriesService.getCategories();
        setCategories(list);
      } catch {
        // ignore
      }
    })();
  }, []);

  const totals = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const t of rows) {
      if (t.type === 'income') income += t.amount;
      else expense += t.amount;
    }
    return { income, expense, balance: income - expense };
  }, [rows]);

  const categoryBreakdown = useMemo(() => {
    const nameById = new Map(categories.map(c => [c.id, c.name]));
    const colorById = new Map(categories.map(c => [c.id, c.color]));

    const income = new Map<string, number>();
    const expense = new Map<string, number>();

    for (const t of rows) {
      const key = t.categoryId ?? 'uncategorized';
      const bucket = t.type === 'income' ? income : expense;
      bucket.set(key, (bucket.get(key) ?? 0) + t.amount);
    }

    function toTopList(map: Map<string, number>) {
      const items = Array.from(map.entries())
        .map(([id, value]) => ({
          id,
          name: nameById.get(id) ?? (id === 'uncategorized' ? 'Uncategorized' : id),
          value,
          color: colorById.get(id) ?? undefined,
        }))
        .sort((a, b) => b.value - a.value);

      const top = items.slice(0, 6);
      const rest = items.slice(6);
      const restSum = rest.reduce((acc, i) => acc + i.value, 0);
      if (restSum > 0) {
        top.push({ id: 'others', name: 'Others', value: restSum, color: '#94a3b8' });
      }
      return top;
    }

    return {
      income: toTopList(income),
      expense: toTopList(expense),
    };
  }, [rows, categories]);

  async function load() {
    setLoading(true);
    try {
      const list = await transactionsService.getTransactions({
        from: from ? from.toISOString() : undefined,
        to: to ? to.toISOString() : undefined,
      });
      setRows(list);
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to load report data.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen style={styles.container}>
      <Card style={styles.card}>
        <AppText variant="title">রিপোর্ট</AppText>
        <AppText variant="muted" style={styles.subtitle}>
          Date range সিলেক্ট করে রিপোর্ট দেখুন, তারপর PDF/CSV এক্সপোর্ট করুন।
        </AppText>

        <View style={styles.filterRow}>
          <DateRangeFilter
            onChange={(f, t) => {
              setFrom(f);
              setTo(t);
            }}
          />
          <TouchableOpacity
            onPress={load}
            style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
            disabled={loading}
          >
            <AppText style={styles.primaryBtnText}>
              {loading ? 'Loading…' : 'Load'}
            </AppText>
          </TouchableOpacity>
        </View>
      </Card>

      <Card style={styles.card}>
        <AppText variant="body" style={styles.sectionTitle}>
          Summary
        </AppText>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <AppText variant="caption">Income</AppText>
            <AppText style={[styles.summaryValue, { color: tokens.colors.success }]}>
              ৳{totals.income.toFixed(2)}
            </AppText>
          </View>
          <View style={styles.summaryItem}>
            <AppText variant="caption">Expense</AppText>
            <AppText style={[styles.summaryValue, { color: tokens.colors.danger }]}>
              ৳{totals.expense.toFixed(2)}
            </AppText>
          </View>
          <View style={styles.summaryItem}>
            <AppText variant="caption">Balance</AppText>
            <AppText style={styles.summaryValue}>৳{totals.balance.toFixed(2)}</AppText>
          </View>
        </View>

        <View style={styles.exportRow}>
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => exportService.shareTransactionsCSV(rows)}
            disabled={!rows.length}
          >
            <AppText style={styles.secondaryBtnText}>Export CSV</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={async () => {
              try {
                await exportService.shareTransactionsPDF({
                  title: 'Transactions Report',
                  rows,
                  totals,
                });
              } catch {
                Alert.alert('Error', 'Failed to export PDF.');
              }
            }}
            disabled={!rows.length}
          >
            <AppText style={styles.secondaryBtnText}>Export PDF</AppText>
          </TouchableOpacity>
        </View>
      </Card>

      <Card style={styles.card}>
        <AppText variant="body" style={styles.sectionTitle}>
          Category breakdown (Income)
        </AppText>
        {categoryBreakdown.income.length ? (
          <CategoryPieChart data={categoryBreakdown.income} />
        ) : (
          <AppText variant="muted">No income data</AppText>
        )}
      </Card>

      <Card style={styles.card}>
        <AppText variant="body" style={styles.sectionTitle}>
          Category breakdown (Expense)
        </AppText>
        {categoryBreakdown.expense.length ? (
          <CategoryPieChart data={categoryBreakdown.expense} />
        ) : (
          <AppText variant="muted">No expense data</AppText>
        )}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: tokens.spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 520,
    marginBottom: tokens.spacing.lg,
  },
  subtitle: {
    marginTop: 10,
    textAlign: 'center',
  },
  filterRow: {
    marginTop: tokens.spacing.lg,
    gap: tokens.spacing.md,
  },
  primaryBtn: {
    backgroundColor: tokens.colors.primary,
    borderRadius: tokens.radii.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryBtnDisabled: { opacity: 0.75 },
  primaryBtnText: { color: '#fff', fontWeight: '700' },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: tokens.spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
  },
  summaryItem: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: tokens.colors.border,
    borderRadius: tokens.radii.md,
    padding: tokens.spacing.md,
  },
  summaryValue: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: '800',
  },
  exportRow: {
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
  secondaryBtnText: {
    fontWeight: '700',
    color: tokens.colors.text,
  },
});

