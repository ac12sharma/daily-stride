import { StyleSheet, Text, View } from 'react-native';
import { palette } from '../theme/palette';

type Props = {
  steps: number;
};

export function StepCountHero({ steps }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Today's Steps</Text>
      <Text style={styles.steps}>{steps.toLocaleString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 6,
  },
  label: {
    color: palette.textSecondary,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  steps: {
    color: palette.textPrimary,
    fontSize: 56,
    fontWeight: '800',
    lineHeight: 62,
  },
});
