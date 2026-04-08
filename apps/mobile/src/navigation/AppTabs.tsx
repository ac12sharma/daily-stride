import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { LeaderboardScreen } from '../screens/LeaderboardScreen';
import { RewardsScreen } from '../screens/RewardsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ActivityHistoryView } from '../screens/ActivityHistoryView';
import { palette } from '../theme/palette';

const Tab = createBottomTabNavigator();

export function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: palette.surface,
          borderTopColor: palette.border,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: palette.accent,
        tabBarInactiveTintColor: palette.textSecondary,
        tabBarIcon: ({ color, size }) => {
          const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
            Home: 'walk-outline',
            'Activity History': 'bar-chart-outline',
            Leaderboard: 'trophy-outline',
            Rewards: 'gift-outline',
            Profile: 'person-outline',
          };
          return <Ionicons name={iconMap[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Activity History" component={ActivityHistoryView} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Tab.Screen name="Rewards" component={RewardsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
