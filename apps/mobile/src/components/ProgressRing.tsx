import { StyleSheet, Text, View } from 'react-native';
import { palette } from '../theme/palette';

type Props = {
  steps: number;
  goal: number;
};

export function ProgressRing({ steps, goal }: Props) {
  const pct = Math.min(Math.round((steps / goal) * 100), 100);

  return (
    <View style={styles.wrapper}>
      <View style={styles.ring}>
        <Text style={styles.value}>{steps.toLocaleString()}</Text>
        <Text style={styles.sub}>of {goal.toLocaleString()} steps</Text>
      </View>
      <View style={styles.progressBarTrack}>
        <View style={[styles.progressBarFill, { width: `${pct}%` }]} />
      </View>
      <Text style={styles.pct}>{pct}% complete</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: 14,
  },
  ring: {
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 14,
    borderColor: '#1E2D3C',
    backgroundColor: palette.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    color: palette.textPrimary,
    fontSize: 42,
    fontWeight: '700',
  },
  sub: {
    color: palette.textSecondary,
    fontSize: 13,
  },
  progressBarTrack: {
    width: '100%',
    height: 10,
    borderRadius: 20,
    backgroundColor: '#1E2D3C',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 20,
    backgroundColor: palette.accent,
  },
  pct: {
    color: palette.textSecondary,
    fontSize: 12,
  },
});
