import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { palette } from '../theme/palette';

type Props = {
  label: string;
  value: string;
  icon?: ReactNode;
};

export function MetricCard({ label, value, icon }: Props) {
  return (
    <View style={styles.card}>
      {icon}
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: palette.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 14,
    gap: 8,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    color: palette.textPrimary,
  },
  label: {
    fontSize: 12,
    color: palette.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
});
