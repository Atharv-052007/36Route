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
import { Typography, BorderRadius } from '../../constants/theme';
import { EmptyState } from '../../components/ui/AppStates';

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

  return (
    <AppSafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: themeColors.text }]}>My Trips</Text>
        </View>

        <View style={[styles.tabs, { backgroundColor: themeColors.backgroundElement }]}>
          {([
            { key: 'upcoming', label: 'Upcoming', count: upcoming.length },
            { key: 'today', label: 'Today', count: today.length },
            { key: 'completed', label: 'Completed', count: completed.length },
          ] as { key: TripTab; label: string; count: number }[]).map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[styles.tab, activeTab === tab.key && { backgroundColor: themeColors.secondary }]}
            >
              <Text style={[styles.tabText, { color: activeTab === tab.key ? '#FFF' : themeColors.textSecondary }]}>
                {tab.label}
              </Text>
              <Text style={[styles.tabCount, { color: activeTab === tab.key ? 'rgba(255,255,255,0.85)' : themeColors.textMuted }]}>
                {tab.count}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {display.length === 0 ? (
          <View>
            <EmptyState title={titles[activeTab]} description={descs[activeTab]} icon="calendar-outline" />
          </View>
        ) : (
          display.map((ride, index) => (
            <View
              key={ride.id}
            >
              <TouchableOpacity
                onPress={() => router.push('/(driver)/active-trip')}
                style={[styles.tripCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}
                activeOpacity={0.7}
              >
                <View style={styles.tripCardHeader}>
                  <View style={[styles.tripIcon, { backgroundColor: themeColors.secondaryLight }]}>
                    <Ionicons name="bus" size={18} color={themeColors.secondary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.tripName, { color: themeColors.text }]}>
                      {ride.route?.name || 'Route 36'}
                    </Text>
                    <Text style={[styles.tripPoints, { color: themeColors.textSecondary }]}>
                      {ride.pickup.name} → {ride.drop.name}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={themeColors.textMuted} />
                </View>
                <View style={[styles.tripFooter, { borderTopColor: themeColors.borderLight }]}>
                  <Text style={[styles.tripDate, { color: themeColors.textSecondary }]}>
                    {ride.date} • {ride.time}
                  </Text>
                  <Text style={[styles.tripSeats, { color: themeColors.textSecondary }]}>
                    {ride.coPassengersCount ?? 0} passengers
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 18, paddingBottom: 40 },
  header: { marginBottom: 16 },
  headerTitle: { fontSize: Typography.fontSizes.xl, fontWeight: Typography.weights.bold as any },
  tabs: {
    flexDirection: 'row',
    borderRadius: BorderRadius.md,
    padding: 4,
    marginBottom: 14,
  },
  tab: { flex: 1, paddingVertical: 10, borderRadius: BorderRadius.sm, alignItems: 'center' },
  tabText: { fontSize: Typography.fontSizes.sm, fontWeight: Typography.weights.semibold as any },
  tabCount: { fontSize: Typography.fontSizes.xs, marginTop: 2 },
  tripCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
  },
  tripCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  tripIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tripName: { fontSize: Typography.fontSizes.md, fontWeight: Typography.weights.semibold as any },
  tripPoints: { fontSize: Typography.fontSizes.sm },
  tripFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  tripDate: { fontSize: Typography.fontSizes.xs },
  tripSeats: { fontSize: Typography.fontSizes.xs },
});
