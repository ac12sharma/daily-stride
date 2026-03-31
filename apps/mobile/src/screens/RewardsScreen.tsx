import { StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { rewards } from '../data/mockData';
import { palette } from '../theme/palette';

export function RewardsScreen() {
  return (
    <ScreenContainer>
      <Text style={styles.title}>Rewards</Text>
      {rewards.map((reward) => (
        <View key={reward.id} style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rewardTitle}>{reward.title}</Text>
            <Text style={[styles.status, reward.unlocked ? styles.unlocked : styles.locked]}>
              {reward.unlocked ? 'Unlocked' : 'In Progress'}
            </Text>
          </View>
          <Text style={styles.description}>{reward.description}</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.round(reward.progress * 100)}%` }]} />
          </View>
        </View>
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    color: palette.textPrimary,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 10,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    padding: 14,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rewardTitle: {
    color: palette.textPrimary,
    fontWeight: '600',
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
  },
  unlocked: {
    color: palette.accent,
  },
  locked: {
    color: palette.textSecondary,
  },
  description: {
    color: palette.textSecondary,
  },
  progressTrack: {
    height: 8,
    borderRadius: 10,
    backgroundColor: '#1E2D3C',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 10,
    backgroundColor: palette.accent,
  },
});
