import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { DailyGoalProgress } from '../components/DailyGoalProgress';
import { MetricCard } from '../components/MetricCard';
import { ScreenContainer } from '../components/ScreenContainer';
import { StepCountHero } from '../components/StepCountHero';
import { StreakIndicator } from '../components/StreakIndicator';
import { homeStats } from '../data/mockData';
import { palette } from '../theme/palette';

export function HomeScreen() {
  const navigation = useNavigation();

  return (
    <ScreenContainer>
      <View>
        <Text style={styles.title}>Step Dashboard</Text>
        <Text style={styles.subtitle}>Track your movement and hit your daily goal.</Text>
      </View>

      <StepCountHero steps={homeStats.steps} />
      <DailyGoalProgress steps={homeStats.steps} goal={homeStats.goal} />
      <StreakIndicator streak={homeStats.streak} bestStreak={homeStats.bestStreak} />

      <Pressable style={styles.historyCard} onPress={() => navigation.navigate('Activity History' as never)}>
        <View>
          <Text style={styles.historyLabel}>Activity history</Text>
          <Text style={styles.historyText}>View your last 7 days of steps</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={palette.textSecondary} />
      </Pressable>

      <View style={styles.row}>
        <MetricCard
          label="Distance"
          value={`${homeStats.distanceMiles.toFixed(1)} mi`}
          icon={<Ionicons name="map-outline" size={16} color={palette.accent} />}
        />
        <MetricCard
          label="Active Min"
          value={`${homeStats.activeMinutes}`}
          icon={<Ionicons name="timer-outline" size={16} color={palette.warning} />}
        />
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
  historyCard: {
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
  historyLabel: {
    color: palette.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  historyText: {
    color: palette.textSecondary,
    marginTop: 2,
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
});
