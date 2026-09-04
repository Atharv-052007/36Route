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
import { Badge } from '@/components/ui/Badge';
import { SupervisorTrip } from '@/types';

type FilterTab = 'All' | 'Upcoming' | 'Ongoing' | 'Completed' | 'Attention';

export default function TripsScreen() {
  const router = useRouter();
  const { trips, setSelectedTripId, isDarkMode } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [selectedDate, setSelectedDate] = useState('Today');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');

  const filterTabs: FilterTab[] = ['All', 'Upcoming', 'Ongoing', 'Completed', 'Attention'];
  const dateOptions = ['Today', 'Tomorrow', 'Yesterday'];

  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      // Search filter
      const matchesSearch =
        searchQuery.trim() === '' ||
        trip.routeSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.tripNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (trip.driverName && trip.driverName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (trip.vehicleModel && trip.vehicleModel.toLowerCase().includes(searchQuery.toLowerCase()));

      // Status filter
      let matchesFilter = true;
      if (activeFilter === 'Upcoming') {
        matchesFilter = trip.status === 'Upcoming' || trip.status === 'Assigned';
      } else if (activeFilter === 'Ongoing') {
        matchesFilter = trip.status === 'Ongoing';
      } else if (activeFilter === 'Completed') {
        matchesFilter = trip.status === 'Completed';
      } else if (activeFilter === 'Attention') {
        matchesFilter = trip.status === 'Needs Attention';
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
        backgroundColor={theme.cardBackground}
      />

      {/* Screen Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.cardBackground,
            borderBottomColor: theme.border,
          },
        ]}
      >
        <View style={styles.headerTitleRow}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Trips</Text>

          <View style={styles.headerActions}>
            {/* Date Selector */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowDatePicker((prev) => !prev)}
              style={[
                styles.dateSelector,
                {
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text style={[styles.dateText, { color: theme.text }]}>
                {selectedDate}
              </Text>
              <Ionicons name="chevron-down" size={14} color={theme.textSecondary} />
            </TouchableOpacity>

            {/* Search Icon */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowSearch((prev) => !prev)}
              style={[styles.searchIconButton, { backgroundColor: theme.backgroundElement }]}
            >
              <Ionicons
                name={showSearch ? 'close' : 'search'}
                size={18}
                color={theme.text}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Date dropdown menu */}
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
            {dateOptions.map((opt) => (
              <TouchableOpacity
                key={opt}
                onPress={() => {
                  setSelectedDate(opt);
                  setShowDatePicker(false);
                }}
                style={[
                  styles.dateOption,
                  selectedDate === opt && { backgroundColor: theme.accentLight },
                ]}
              >
                <Text
                  style={[
                    styles.dateOptionText,
                    {
                      color: selectedDate === opt ? theme.accent : theme.text,
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

        {/* Expandable Search Input */}
        {showSearch && (
          <View
            style={[
              styles.searchBar,
              {
                backgroundColor: theme.backgroundElement,
                borderColor: theme.border,
              },
            ]}
          >
            <Ionicons name="search" size={16} color={theme.textMuted} />
            <TextInput
              style={[styles.searchInput, { color: theme.text }]}
              placeholder="Search route, driver, trip #..."
              placeholderTextColor={theme.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={16} color={theme.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Status Filter Chips */}
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
                    backgroundColor: isSelected ? theme.primary : theme.backgroundElement,
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
          <View style={styles.emptyState}>
            <Ionicons name="bus-outline" size={40} color={theme.textMuted} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              No trips found
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
              No trips matching "{activeFilter}" filter
            </Text>
          </View>
        ) : (
          filteredTrips.map((trip) => {
            const needsDriver = trip.status === 'Needs Attention' && !trip.driverId;

            return (
              <TouchableOpacity
                key={trip.id}
                activeOpacity={0.7}
                onPress={() => handleTripPress(trip)}
                style={[
                  styles.tripCard,
                  {
                    backgroundColor: theme.cardBackground,
                    borderColor: needsDriver ? theme.warningBorder : theme.border,
                  },
                ]}
              >
                {/* Time & Status Row */}
                <View style={styles.cardHeader}>
                  <Text style={[styles.timeText, { color: theme.text }]}>
                    {trip.scheduledTime}
                  </Text>
                  <Badge
                    status={needsDriver ? 'Driver required' : trip.status}
                    size="sm"
                  />
                </View>

                {/* Route */}
                <Text style={[styles.routeText, { color: theme.text }]}>
                  {trip.routeSummary}
                </Text>

                {/* Passengers & Operational Assignment */}
                <View style={styles.cardFooter}>
                  <View style={styles.metaRow}>
                    <Ionicons name="people-outline" size={14} color={theme.textSecondary} />
                    <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                      {trip.passengerCount} passengers
                    </Text>
                  </View>

                  <View style={styles.metaDivider} />

                  <View style={styles.assignmentRow}>
                    {needsDriver ? (
                      <View style={styles.warningAlertRow}>
                        <Ionicons name="warning" size={14} color={theme.warning} />
                        <Text style={[styles.warningText, { color: theme.warning }]}>
                          Driver required
                        </Text>
                      </View>
                    ) : (
                      <Text style={[styles.driverVehicleText, { color: theme.textSecondary }]}>
                        {trip.driverName || 'Unassigned'} • {trip.vehicleModel || 'Vehicle pending'}
                      </Text>
                    )}
                  </View>
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
  header: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  headerTitle: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.weights.bold,
    letterSpacing: -0.3,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    gap: 4,
  },
  dateText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  searchIconButton: {
    width: 34,
    height: 34,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateDropdown: {
    position: 'absolute',
    top: 52,
    right: 56,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    zIndex: 100,
    ...Shadows.card,
    overflow: 'hidden',
  },
  dateOption: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  dateOptionText: {
    fontSize: Typography.fontSizes.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    marginBottom: Spacing.sm,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.fontSizes.sm,
    paddingVertical: 0,
  },
  filterScroll: {
    flexDirection: 'row',
    gap: Spacing.xs + 2,
    paddingVertical: 4,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.weights.bold,
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: Typography.fontSizes.sm,
    marginTop: 4,
  },
  tripCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  timeText: {
    fontSize: Typography.fontSizes.base,
    fontWeight: Typography.weights.bold,
  },
  routeText: {
    fontSize: Typography.fontSizes.base,
    fontWeight: Typography.weights.semibold,
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.1)',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: Typography.fontSizes.xs + 1,
  },
  metaDivider: {
    width: 1,
    height: 12,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 8,
  },
  assignmentRow: {
    flex: 1,
  },
  warningAlertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  warningText: {
    fontSize: Typography.fontSizes.xs + 1,
    fontWeight: Typography.weights.semibold,
  },
  driverVehicleText: {
    fontSize: Typography.fontSizes.xs + 1,
  },
});
