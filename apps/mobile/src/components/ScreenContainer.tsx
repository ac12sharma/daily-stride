import { ReactNode } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { palette } from '../theme/palette';

type Props = {
  children: ReactNode;
};

export function ScreenContainer({ children }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: palette.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 18,
  },
});
