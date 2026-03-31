import { StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { leaderboard } from '../data/mockData';
import { palette } from '../theme/palette';

export function LeaderboardScreen() {
  return (
    <ScreenContainer>
      <Text style={styles.title}>Leaderboard</Text>
      {leaderboard.map((entry, index) => (
        <View key={entry.id} style={[styles.row, entry.isCurrentUser && styles.currentUser]}>
          <Text style={styles.rank}>#{index + 1}</Text>
          <View style={styles.avatar}><Text style={styles.avatarText}>{entry.avatar}</Text></View>
          <View style={styles.meta}>
            <Text style={styles.name}>{entry.name}</Text>
            <Text style={styles.steps}>{entry.steps.toLocaleString()} steps</Text>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    padding: 12,
  },
  currentUser: {
    borderColor: palette.accent,
    backgroundColor: palette.surfaceRaised,
  },
  rank: {
    color: palette.textSecondary,
    width: 34,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#23374D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: palette.textPrimary,
    fontWeight: '700',
  },
  meta: {
    flex: 1,
  },
  name: {
    color: palette.textPrimary,
    fontWeight: '600',
  },
  steps: {
    color: palette.textSecondary,
    fontSize: 12,
  },
});
