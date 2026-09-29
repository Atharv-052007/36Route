import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { Header } from '@/components/ui/Header';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/AppStates';
import { SupervisorTrip } from '@/types';

type TripFilter = 'All' | 'Active' | 'Upcoming' | 'Completed';

const DATE_OPTIONS = ['Today', 'Tomorrow', 'Yesterday'];

export default function TripsScreen() {
  const router = useRouter();
  const { trips, setSelectedTripId, isDarkMode } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('Today');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeFilter, setActiveFilter] = useState<TripFilter>('All');

  const filterTabs: TripFilter[] = ['All', 'Active', 'Upcoming', 'Completed'];

  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        trip.routeSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.tripNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (trip.driverName && trip.driverName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (trip.vehicleModel && trip.vehicleModel.toLowerCase().includes(searchQuery.toLowerCase()));

      let matchesFilter = true;
      if (activeFilter === 'Active') {
        matchesFilter = trip.status === 'Ongoing' || trip.status === 'Needs Attention' || trip.status === 'Assigned';
      } else if (activeFilter === 'Upcoming') {
        matchesFilter = trip.status === 'Upcoming';
      } else if (activeFilter === 'Completed') {
        matchesFilter = trip.status === 'Completed';
      }

      return matchesSearch && matchesFilter;
    });
  }, [trips, searchQuery, activeFilter]);

  const handleTripPress = (trip: SupervisorTrip) => {
    setSelectedTripId(trip.id);
    if (trip.status === 'Needs Attention' && !trip.driverId) {
      router.push('/dispatch');
    } else {
      router.push('/trip-details');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />

      <Header title="Trips" showBack />

      {/* Search Bar + Date Picker */}
      <View style={styles.searchSection}>
        <View style={styles.searchRow}>
          <View
            style={[
              styles.searchBar,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.border,
              },
            ]}
          >
            <Ionicons name="search" size={18} color={theme.textMuted} />
            <TextInput
              style={[styles.searchInput, { color: theme.text }]}
              placeholder="Search route, driver, trip #..."
              placeholderTextColor={theme.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={theme.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {/* Date Picker Button */}
          <View style={{ position: 'relative' }}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowDatePicker((prev) => !prev)}
              style={[
                styles.dateButton,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.border,
                },
              ]}
            >
              <Ionicons name="calendar-outline" size={16} color={theme.textSecondary} />
              <Text style={[styles.dateButtonText, { color: theme.text }]}>{selectedDate}</Text>
              <Ionicons name="chevron-down" size={14} color={theme.textMuted} />
            </TouchableOpacity>

            {showDatePicker && (
              <View
                style={[
                  styles.dateDropdown,
                  {
                    backgroundColor: theme.cardBackground,
                    borderColor: theme.border,
                  },
                ]}
              >
                {DATE_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    onPress={() => {
                      setSelectedDate(opt);
                      setShowDatePicker(false);
                    }}
                    style={[
                      styles.dateOption,
                      selectedDate === opt && { backgroundColor: theme.primaryLight },
                    ]}
                  >
                    <Text
                      style={[
                        styles.dateOptionText,
                        {
                          color: selectedDate === opt ? theme.primary : theme.text,
                          fontWeight: selectedDate === opt ? '600' : '400',
                        },
                      ]}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {filterTabs.map((tab) => {
            const isSelected = activeFilter === tab;
            return (
              <TouchableOpacity
                key={tab}
                activeOpacity={0.7}
                onPress={() => setActiveFilter(tab)}
                style={[
                  styles.filterPill,
                  {
                    backgroundColor: isSelected ? theme.primary : theme.cardBackground,
                    borderColor: isSelected ? theme.primary : theme.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    {
                      color: isSelected ? theme.textInverse : theme.textSecondary,
                      fontWeight: isSelected ? '600' : '500',
                    },
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Trips List */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredTrips.length === 0 ? (
          <EmptyState
            title="No trips found"
            description={`No trips matching "${activeFilter}" filter`}
            icon="bus-outline"
          />
        ) : (
          filteredTrips.map((trip) => {
            const needsDriver = trip.status === 'Needs Attention' && !trip.driverId;
            const statusDisplay = needsDriver ? 'Driver required' : trip.status;

            return (
              <TouchableOpacity
                key={trip.id}
                activeOpacity={0.7}
                onPress={() => handleTripPress(trip)}
                style={[
                  styles.tripCard,
                  {
                    backgroundColor: theme.cardBackground,
                    borderLeftColor: needsDriver
                      ? theme.warning
                      : trip.status === 'Completed'
                      ? theme.completed
                      : trip.status === 'Ongoing'
                      ? theme.onTrip
                      : theme.assigned,
                  },
                ]}
              >
                {/* Top Row: Time + Badge */}
                <View style={styles.cardTopRow}>
                  <View style={styles.timeBlock}>
                    <Ionicons name="time-outline" size={14} color={theme.textMuted} />
                    <Text style={[styles.tripTime, { color: theme.text }]}>
                      {trip.scheduledTime}
                    </Text>
                  </View>
                  <Badge status={statusDisplay} size="sm" />
                </View>

                {/* Route */}
                <View style={styles.routeRow}>
                  <Ionicons name="swap-horizontal" size={14} color={theme.textSecondary} />
                  <Text style={[styles.routeText, { color: theme.text }]} numberOfLines={1}>
                    {trip.routeSummary}
                  </Text>
                </View>

                {/* Bottom Row: Passengers + Driver */}
                <View style={styles.cardBottomRow}>
                  <View style={styles.metaChip}>
                    <Ionicons name="people-outline" size={13} color={theme.textSecondary} />
                    <Text style={[styles.metaChipText, { color: theme.textSecondary }]}>
                      {trip.passengerCount} pax
                    </Text>
                  </View>
                  <View style={styles.metaChip}>
                    <Ionicons name="person-outline" size={13} color={theme.textSecondary} />
                    <Text style={[styles.metaChipText, { color: theme.textSecondary }]}>
                      {trip.driverName || 'Unassigned'}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={14} color={theme.textMuted} style={{ marginLeft: 'auto' }} />
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  searchSection: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.sm,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: 10,
    ...Shadows.subtle,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.fontSizes.sm,
    paddingVertical: 0,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: 6,
  },
  dateButtonText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  dateDropdown: {
    position: 'absolute',
    top: 48,
    right: 0,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    zIndex: 100,
    ...Shadows.card,
    overflow: 'hidden',
    minWidth: 130,
  },
  dateOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  dateOptionText: {
    fontSize: Typography.fontSizes.sm,
  },
  filterSection: {
    paddingBottom: Spacing.sm,
  },
  filterScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: Spacing.base,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  filterText: {
    fontSize: Typography.fontSizes.xs + 1,
  },
  listContent: {
    padding: Spacing.base,
    paddingBottom: Spacing.xxl,
  },
  tripCard: {
    padding: 14,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderLeftWidth: 3.5,
    borderColor: '#E2E8F0',
    marginBottom: 10,
    ...Shadows.subtle,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  timeBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  tripTime: {
    fontSize: Typography.fontSizes.base,
    fontWeight: Typography.weights.bold,
    letterSpacing: -0.2,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  routeText: {
    fontSize: Typography.fontSizes.sm + 1,
    fontWeight: Typography.weights.semibold,
    flex: 1,
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaChipText: {
    fontSize: Typography.fontSizes.xs + 1,
    fontWeight: Typography.weights.medium,
  },
});
