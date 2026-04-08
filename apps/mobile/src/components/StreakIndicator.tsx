import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { palette } from '../theme/palette';

type Props = {
  streak: number;
  bestStreak: number;
};

export function StreakIndicator({ streak, bestStreak }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="flame" size={16} color={palette.warning} />
        <Text style={styles.title}>Streak</Text>
      </View>
      <View style={styles.row}>
        <View>
          <Text style={styles.value}>{streak} days</Text>
          <Text style={styles.meta}>Current run</Text>
        </View>
        <View style={styles.divider} />
        <View>
          <Text style={styles.value}>{bestStreak} days</Text>
          <Text style={styles.meta}>Best run</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 16,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    color: palette.textSecondary,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  divider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: palette.border,
  },
  value: {
    color: palette.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  meta: {
    color: palette.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
});
