import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { MetricCard } from '../components/MetricCard';
import { ProgressRing } from '../components/ProgressRing';
import { ScreenContainer } from '../components/ScreenContainer';
import { homeStats } from '../data/mockData';
import { palette } from '../theme/palette';

export function HomeScreen() {
  return (
    <ScreenContainer>
      <View>
        <Text style={styles.title}>Daily Stride</Text>
        <Text style={styles.subtitle}>Keep your streak alive 🔥</Text>
      </View>

      <ProgressRing steps={homeStats.steps} goal={homeStats.goal} />

      <View style={styles.row}>
        <MetricCard
          label="Streak"
          value={`${homeStats.streak}d`}
          icon={<Ionicons name="flame" size={16} color={palette.warning} />}
        />
        <MetricCard
          label="Weekly Growth"
          value={`+${homeStats.weeklyDelta}%`}
          icon={<Ionicons name="trending-up" size={16} color={palette.accent} />}
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
