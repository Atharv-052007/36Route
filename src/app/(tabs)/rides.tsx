import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../../context/AppContext';
import { Typography, Shadows } from '../../constants/theme';
import { RideCard } from '../../components/ui/RideCards';
import { EmptyState, ConfirmationModal } from '../../components/ui/AppStates';
import { AppButton } from '../../components/ui/AppButton';

export default function RidesScreen() {
  const router = useRouter();
  const { rides, cancelRide, refreshRides, themeColors } = useApp();
  const [tab, setTab] = useState<'UPCOMING' | 'HISTORY'>('UPCOMING');
  const [filter, setFilter] = useState<'ALL' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [refreshing, setRefreshing] = useState(false);

  const [selectedCancelId, setSelectedCancelId] = useState<string | null>(null);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshRides();
    setRefreshing(false);
  };

  const upcomingRides = rides.filter(
    (r) => r.status === 'SCHEDULED' || r.status === 'BOARDING' || r.status === 'IN_TRANSIT'
  );

  const historyRides = rides.filter((r) => {
    if (r.status !== 'COMPLETED' && r.status !== 'CANCELLED') return false;
    if (filter === 'COMPLETED') return r.status === 'COMPLETED';
    if (filter === 'CANCELLED') return r.status === 'CANCELLED';
    return true;
  });

  const handleConfirmCancel = async () => {
    if (selectedCancelId) {
      await cancelRide(selectedCancelId);
      setSelectedCancelId(null);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Top Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: themeColors.text }]}>My Commutes</Text>
          <AppButton
            title="+ Book"
            onPress={() => router.push('/book-ride')}
            size="sm"
            style={{ borderRadius: 20 }}
          />
        </View>

        {/* Tab Switcher */}
        <View style={[styles.tabBar, { backgroundColor: themeColors.borderLight }]}>
          <TouchableOpacity
            style={[
              styles.tabBtn,
              tab === 'UPCOMING' && { backgroundColor: themeColors.cardBackground },
              Shadows.small,
            ]}
            onPress={() => setTab('UPCOMING')}
          >
            <Text
              style={[
                styles.tabText,
                { color: tab === 'UPCOMING' ? themeColors.primary : themeColors.textSecondary },
              ]}
            >
              Upcoming ({upcomingRides.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabBtn,
              tab === 'HISTORY' && { backgroundColor: themeColors.cardBackground },
              Shadows.small,
            ]}
            onPress={() => setTab('HISTORY')}
          >
            <Text
              style={[
                styles.tabText,
                { color: tab === 'HISTORY' ? themeColors.primary : themeColors.textSecondary },
              ]}
            >
              History
            </Text>
          </TouchableOpacity>
        </View>

        {/* History Filters */}
        {tab === 'HISTORY' && (
          <View style={styles.filterRow}>
            {(['ALL', 'COMPLETED', 'CANCELLED'] as const).map((f) => (
              <TouchableOpacity
                key={f}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor:
                      filter === f ? themeColors.primaryLight : themeColors.cardBackground,
                    borderColor: filter === f ? themeColors.primary : themeColors.border,
                  },
                ]}
                onPress={() => setFilter(f)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    { color: filter === f ? themeColors.primary : themeColors.textSecondary },
                  ]}
                >
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Content Section */}
        {tab === 'UPCOMING' ? (
          upcomingRides.length > 0 ? (
            upcomingRides.map((ride) => (
              <RideCard
                key={ride.id}
                ride={ride}
                onTrack={
                  ride.status === 'IN_TRANSIT' ? () => router.push('/(tabs)/track') : undefined
                }
                onViewDetails={() =>
                  router.push({ pathname: '/ride-details', params: { id: ride.id } })
                }
                onCancel={() => setSelectedCancelId(ride.id)}
              />
            ))
          ) : (
            <EmptyState
              title="No Upcoming Commutes"
              description="You have no active or scheduled rides at this time."
              actionTitle="Schedule a Ride"
              onAction={() => router.push('/book-ride')}
            />
          )
        ) : historyRides.length > 0 ? (
          historyRides.map((ride) => (
            <RideCard
              key={ride.id}
              ride={ride}
              onViewDetails={() =>
                router.push({ pathname: '/ride-details', params: { id: ride.id } })
              }
            />
          ))
        ) : (
          <EmptyState
            title="No Commute History"
            description="Your completed and cancelled rides will appear here."
          />
        )}
      </ScrollView>

      {/* Cancel Confirmation Modal */}
      <ConfirmationModal
        visible={!!selectedCancelId}
        title="Cancel Scheduled Commute?"
        message="Are you sure you want to cancel this ride? Late cancellations may notify your transport coordinator."
        confirmText="Yes, Cancel"
        cancelText="Keep Ride"
        isDanger
        onConfirm={handleConfirmCancel}
        onCancel={() => setSelectedCancelId(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    padding: 18,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.weights.bold as any,
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.bold as any,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
  },
  filterChipText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.semibold as any,
  },
});
