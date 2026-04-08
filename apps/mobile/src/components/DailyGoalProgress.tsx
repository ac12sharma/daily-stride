import { StyleSheet, Text, View } from 'react-native';
import { palette } from '../theme/palette';

type Props = {
  steps: number;
  goal: number;
};

export function DailyGoalProgress({ steps, goal }: Props) {
  const progress = Math.min(steps / goal, 1);
  const pct = Math.round(progress * 100);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>Daily goal progress</Text>
        <Text style={styles.value}>{pct}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%` }]} />
      </View>
      <Text style={styles.meta}>{steps.toLocaleString()} / {goal.toLocaleString()} steps</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: palette.textSecondary,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '600',
  },
  value: {
    color: palette.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  track: {
    width: '100%',
    height: 12,
    borderRadius: 999,
    backgroundColor: '#1E2D3C',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: palette.accent,
  },
  meta: {
    color: palette.textSecondary,
    fontSize: 12,
  },
});
