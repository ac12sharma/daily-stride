import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { leaderboard } from '../data/mockData';
import { palette } from '../theme/palette';

const podiumLabels = ['1st', '2nd', '3rd'];

export function LeaderboardView() {
  return (
    <ScreenContainer>
      <View>
        <Text style={styles.title}>Step Leaderboard</Text>
        <Text style={styles.subtitle}>Compete with your crew and climb the rankings.</Text>
      </View>

      {leaderboard.map((entry, index) => {
        const rank = index + 1;
        const isPodium = rank <= 3;

        return (
          <View
            key={entry.id}
            style={[
              styles.row,
              rank === 1 && styles.firstPlace,
              rank === 2 && styles.secondPlace,
              rank === 3 && styles.thirdPlace,
              entry.isCurrentUser && styles.currentUser,
            ]}
          >
            <View style={styles.rankBlock}>
              <Text style={[styles.rank, isPodium && styles.rankPodium]}>{rank}</Text>
              {isPodium && <Text style={styles.rankBadge}>{podiumLabels[index]}</Text>}
            </View>

            <View style={[styles.avatar, isPodium && styles.podiumAvatar]}>
              <Text style={styles.avatarText}>{entry.avatar}</Text>
            </View>

            <View style={styles.meta}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{entry.name}</Text>
                {entry.isCurrentUser && (
                  <View style={styles.youChip}>
                    <Text style={styles.youChipText}>YOU</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.steps, isPodium && styles.stepsPodium]}>
                {entry.steps.toLocaleString()} steps
              </Text>
            </View>

            {isPodium && <Ionicons name="flash" size={16} color={palette.warning} />}
          </View>
        );
      })}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    color: palette.textPrimary,
    fontSize: 30,
    fontWeight: '800',
  },
  subtitle: {
    color: palette.textSecondary,
    marginTop: 6,
    fontSize: 13,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    padding: 12,
  },
  firstPlace: {
    borderColor: '#F6B73C',
    backgroundColor: '#2C2413',
  },
  secondPlace: {
    borderColor: '#9DB2C7',
    backgroundColor: '#1D2732',
  },
  thirdPlace: {
    borderColor: '#C88C5A',
    backgroundColor: '#2C2018',
  },
  currentUser: {
    borderColor: palette.accent,
    shadowColor: palette.accent,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  rankBlock: {
    width: 42,
    alignItems: 'center',
    gap: 2,
  },
  rank: {
    color: palette.textSecondary,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 24,
  },
  rankPodium: {
    color: palette.textPrimary,
  },
  rankBadge: {
    color: palette.warning,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#23374D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  podiumAvatar: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarText: {
    color: palette.textPrimary,
    fontWeight: '700',
  },
  meta: {
    flex: 1,
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    color: palette.textPrimary,
    fontWeight: '700',
    fontSize: 15,
  },
  youChip: {
    backgroundColor: palette.accent,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  youChipText: {
    color: '#0B0F12',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  steps: {
    color: palette.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  stepsPodium: {
    color: palette.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
});
