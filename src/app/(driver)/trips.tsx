import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { AppSafeAreaView } from '@/components/ui/AppSafeAreaView';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../../context/AppContext';
import { Typography, BorderRadius, Shadows, Spacing } from '../../constants/theme';
import { EmptyState, StatusBadge } from '../../components/ui/AppStates';
import { Header } from '@/components/ui/Header';

type TripTab = 'upcoming' | 'today' | 'completed';

export default function DriverTripsScreen() {
  const router = useRouter();
  const { rides, themeColors } = useApp();
  const [activeTab, setActiveTab] = useState<TripTab>('upcoming');

  const upcoming = rides.filter((r) => ['SCHEDULED'].includes(r.status));
  const today = rides.filter((r) => ['BOARDING', 'IN_TRANSIT'].includes(r.status));
  const completed = rides.filter((r) => ['COMPLETED', 'ARRIVED'].includes(r.status));

  const display =
    activeTab === 'upcoming' ? upcoming : activeTab === 'today' ? today : completed;

  const titles: Record<TripTab, string> = {
    upcoming: 'No Upcoming Trips',
    today: 'No Trips Today',
    completed: 'No Completed Trips',
  };
  const descs: Record<TripTab, string> = {
    upcoming: 'Your scheduled trips will appear here when assigned.',
    today: 'Start your shift to see today\'s trips here.',
    completed: 'Completed trips will be listed here.',
  };

  const tabs: { key: TripTab; label: string; count: number; icon: string }[] = [
    { key: 'upcoming', label: 'Upcoming', count: upcoming.length, icon: 'calendar-outline' },
    { key: 'today', label: 'Today', count: today.length, icon: 'today-outline' },
    { key: 'completed', label: 'Completed', count: completed.length, icon: 'checkmark-circle-outline' },
  ];

  return (
    <AppSafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <Header title="My Trips" showBack />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Tab Bar */}
        <View style={styles.tabBar}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                style={[styles.tab, isActive && { backgroundColor: themeColors.secondary }]}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={tab.icon as any}
                  size={16}
                  color={isActive ? '#FFF' : themeColors.textMuted}
                />
                <Text style={[styles.tabLabel, { color: isActive ? '#FFF' : themeColors.textSecondary }]}>
                  {tab.label}
                </Text>
                {tab.count > 0 && (
                  <View style={[styles.tabBadge, { backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : themeColors.backgroundElement }]}>
                    <Text style={[styles.tabCount, { color: isActive ? '#FFF' : themeColors.textMuted }]}>
                      {tab.count}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Trip List */}
        {display.length === 0 ? (
          <EmptyState title={titles[activeTab]} description={descs[activeTab]} icon="calendar-outline" />
        ) : (
          display.map((ride) => (
            <TouchableOpacity
              key={ride.id}
              onPress={() => router.push('/(driver)/active-trip')}
              style={[styles.tripCard, { backgroundColor: themeColors.cardBackground }, Shadows.card]}
              activeOpacity={0.7}
            >
              <View style={styles.tripHeader}>
                <View style={[styles.tripIcon, { backgroundColor: themeColors.secondaryLight }]}>
                  <Ionicons name="bus" size={20} color={themeColors.secondary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.tripName, { color: themeColors.text }]}>
                    {ride.route?.name || 'Route 36'}
                  </Text>
                  <Text style={[styles.tripRoute, { color: themeColors.textSecondary }]}>
                    {ride.pickup.name} → {ride.drop.name}
                  </Text>
                </View>
                <StatusBadge status={ride.status} size="sm" />
              </View>

              <View style={[styles.tripFooter, { borderTopColor: themeColors.borderLight }]}>
                <View style={styles.tripMeta}>
                  <Ionicons name="time-outline" size={14} color={themeColors.textMuted} />
                  <Text style={[styles.tripMetaText, { color: themeColors.textSecondary }]}>
                    {ride.date} • {ride.time}
                  </Text>
                </View>
                <View style={styles.tripMeta}>
                  <Ionicons name="people-outline" size={14} color={themeColors.textMuted} />
                  <Text style={[styles.tripMetaText, { color: themeColors.textSecondary }]}>
                    {ride.coPassengersCount ?? 0} passengers
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: Spacing.base, paddingBottom: 40 },
  tabBar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    gap: 6,
  },
  tabLabel: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold as any,
  },
  tabBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: BorderRadius.full,
  },
  tabCount: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.bold as any,
  },
  tripCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    padding: 16,
    marginBottom: 12,
  },
  tripHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tripIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tripName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.semibold as any,
  },
  tripRoute: { fontSize: Typography.fontSizes.sm, marginTop: 2 },
  tripFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  tripMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  tripMetaText: { fontSize: Typography.fontSizes.xs },
});
