import { StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { MetricCard } from '../components/MetricCard';
import { palette } from '../theme/palette';

export function ProfileScreen() {
  return (
    <ScreenContainer>
      <View style={styles.header}>
        <View style={styles.avatar}><Text style={styles.avatarText}>Y</Text></View>
        <View>
          <Text style={styles.title}>Your Profile</Text>
          <Text style={styles.subtitle}>Runner level: Momentum</Text>
        </View>
      </View>

      <View style={styles.row}>
        <MetricCard label="Badges" value="9" />
        <MetricCard label="Friends" value="24" />
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Launch readiness</Text>
        <Text style={styles.panelText}>• Notifications configured</Text>
        <Text style={styles.panelText}>• Sync status healthy</Text>
        <Text style={styles.panelText}>• Last backup: today</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: palette.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: palette.border,
  },
  avatarText: {
    color: palette.textPrimary,
    fontSize: 24,
    fontWeight: '700',
  },
  title: {
    color: palette.textPrimary,
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: palette.textSecondary,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  panel: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    padding: 14,
    gap: 8,
  },
  panelTitle: {
    color: palette.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  panelText: {
    color: palette.textSecondary,
  },
});
