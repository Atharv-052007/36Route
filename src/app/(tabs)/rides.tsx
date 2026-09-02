import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../../context/AppContext';
import { Typography, BorderRadius } from '../../constants/theme';
import { RideCard } from '../../components/ui/RideCards';
import { ConfirmationModal, EmptyState } from '../../components/ui/AppStates';

export default function RidesScreen() {
  const router = useRouter();
  const { rides, refreshRides, cancelRide, themeColors } = useApp();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
  const [filter, setFilter] = useState<'ALL' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [refreshing, setRefreshing] = useState(false);
  const [cancelId, setCancelId] = useState<string | null>(null);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshRides();
    setRefreshing(false);
  };

  const upcoming = rides.filter((r) => ['SCHEDULED', 'BOARDING', 'IN_TRANSIT'].includes(r.status));
  const history = rides.filter((r) => ['COMPLETED', 'CANCELLED'].includes(r.status));
  const filteredHistory = filter === 'ALL' ? history : history.filter((r) => r.status === filter);

  const displayRides = activeTab === 'upcoming' ? upcoming : filteredHistory;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: themeColors.text }]}>My Rides</Text>
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: themeColors.secondary }]}
            onPress={() => router.push('/book-ride')}
          >
            <Ionicons name="add" size={18} color="#FFF" />
            <Text style={styles.addBtnText}>Book</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={[styles.tabs, { backgroundColor: themeColors.backgroundElement }]}>
          {(['upcoming', 'history'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && { backgroundColor: themeColors.secondary }]}
            >
              <Text style={[styles.tabText, { color: activeTab === tab ? '#FFF' : themeColors.textSecondary }]}>
                {tab === 'upcoming' ? 'Upcoming' : 'History'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* History Filters */}
        {activeTab === 'history' && (
          <View style={styles.filters}>
            {(['ALL', 'COMPLETED', 'CANCELLED'] as const).map((f) => (
              <TouchableOpacity
                key={f}
                onPress={() => setFilter(f)}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: filter === f ? themeColors.secondaryLight : themeColors.cardBackground,
                    borderColor: filter === f ? themeColors.secondary : themeColors.border,
                  },
                ]}
              >
                <Text style={[styles.filterText, { color: filter === f ? themeColors.secondary : themeColors.textSecondary }]}>
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Ride List */}
        {displayRides.length === 0 ? (
          <EmptyState
            title={activeTab === 'upcoming' ? 'No Upcoming Rides' : 'No History'}
            description={activeTab === 'upcoming' ? 'Book a ride for your next shift' : 'Your completed rides will appear here'}
            actionTitle={activeTab === 'upcoming' ? 'Book a Ride' : undefined}
            onAction={activeTab === 'upcoming' ? () => router.push('/book-ride') : undefined}
          />
        ) : (
          displayRides.map((ride) => (
            <RideCard
              key={ride.id}
              ride={ride}
              onTrack={() => router.push('/(tabs)/track')}
              onViewDetails={() => router.push({ pathname: '/ride-details', params: { id: ride.id } })}
              onCancel={() => setCancelId(ride.id)}
            />
          ))
        )}
      </ScrollView>

      <ConfirmationModal
        visible={!!cancelId}
        title="Cancel Ride"
        message="Are you sure you want to cancel this ride?"
        confirmText="Cancel Ride"
        onConfirm={async () => {
          if (cancelId) await cancelRide(cancelId);
          setCancelId(null);
        }}
        onCancel={() => setCancelId(null)}
        variant="danger"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 18, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.weights.bold as any,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    gap: 4,
  },
  addBtnText: {
    color: '#FFF',
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold as any,
  },
  tabs: {
    flexDirection: 'row',
    borderRadius: BorderRadius.md,
    padding: 4,
    marginBottom: 14,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  tabText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold as any,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  filterText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.semibold as any,
  },
});
