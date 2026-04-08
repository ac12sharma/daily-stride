import { StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { activityHistory } from '../data/mockData';
import { palette } from '../theme/palette';

const MAX_STEPS = Math.max(...activityHistory.map((entry) => entry.steps));

export function ActivityHistoryView() {
  return (
    <ScreenContainer>
      <View>
        <Text style={styles.title}>Activity History</Text>
        <Text style={styles.subtitle}>Your last 7 days of step activity.</Text>
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.sectionLabel}>Weekly chart</Text>
        <View style={styles.chartRow}>
          {activityHistory.map((entry) => {
            const barHeight = Math.max(20, Math.round((entry.steps / MAX_STEPS) * 120));
            return (
              <View key={entry.date} style={styles.barWrap}>
                <View style={[styles.bar, { height: barHeight }]} />
                <Text style={styles.barLabel}>{entry.shortDay}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.listWrap}>
        <Text style={styles.sectionLabel}>Daily totals</Text>
        {activityHistory.map((entry) => (
          <View key={`${entry.date}-row`} style={styles.rowCard}>
            <Text style={styles.date}>{entry.dateLabel}</Text>
            <Text style={styles.steps}>{entry.steps.toLocaleString()}</Text>
          </View>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    color: palette.textPrimary,
    fontSize: 30,
    fontWeight: '700',
  },
  subtitle: {
    color: palette.textSecondary,
    marginTop: 6,
  },
  chartCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    padding: 14,
    gap: 14,
  },
  sectionLabel: {
    color: palette.textSecondary,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.9,
    fontWeight: '700',
  },
  chartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 8,
    minHeight: 144,
  },
  barWrap: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  bar: {
    width: '100%',
    borderRadius: 12,
    backgroundColor: palette.accent,
    minHeight: 20,
  },
  barLabel: {
    color: palette.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  listWrap: {
    gap: 10,
  },
  rowCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  date: {
    color: palette.textSecondary,
    fontSize: 14,
  },
  steps: {
    color: palette.textPrimary,
    fontSize: 24,
    fontWeight: '700',
  },
});
