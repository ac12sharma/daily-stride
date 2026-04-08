import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { DailyGoalProgress } from '../components/DailyGoalProgress';
import { MetricCard } from '../components/MetricCard';
import { ScreenContainer } from '../components/ScreenContainer';
import { StepCountHero } from '../components/StepCountHero';
import { StreakIndicator } from '../components/StreakIndicator';
import { homeStats } from '../data/mockData';
import { palette } from '../theme/palette';

export function HomeScreen() {
  return (
    <ScreenContainer>
      <View>
        <Text style={styles.title}>Step Dashboard</Text>
        <Text style={styles.subtitle}>Track your movement and hit your daily goal.</Text>
      </View>

      <StepCountHero steps={homeStats.steps} />
      <DailyGoalProgress steps={homeStats.steps} goal={homeStats.goal} />
      <StreakIndicator streak={homeStats.streak} bestStreak={homeStats.bestStreak} />

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
  row: {
    flexDirection: 'row',
    gap: 10,
  },
});
