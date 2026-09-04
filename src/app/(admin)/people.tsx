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
import { SupervisorDriver } from '@/types';

type TabSection = 'Drivers' | 'Passengers';
type DriverFilter = 'All' | 'Available' | 'On Trip' | 'Unavailable';

export default function PeopleScreen() {
  const router = useRouter();
  const { drivers, kpis, setSelectedDriverId, isDarkMode } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const [activeSection, setActiveSection] = useState<TabSection>('Drivers');
  const [driverFilter, setDriverFilter] = useState<DriverFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filterTabs: DriverFilter[] = ['All', 'Available', 'On Trip', 'Unavailable'];

  const filteredDrivers = useMemo(() => {
    return drivers.filter((driver) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.assignedVehicleModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.assignedVehiclePlate.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        driverFilter === 'All' || driver.status === driverFilter;

      return matchesSearch && matchesFilter;
    });
  }, [drivers, searchQuery, driverFilter]);

  const handleDriverPress = (driver: SupervisorDriver) => {
    setSelectedDriverId(driver.id);
    router.push('/driver-profile');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.cardBackground}
      />

      {/* Screen Header with Section Switcher */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.cardBackground,
            borderBottomColor: theme.border,
          },
        ]}
      >
        <View style={styles.topRow}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>People</Text>

          {/* Segmented control: Drivers | Passengers */}
          <View
            style={[
              styles.segmentedWrap,
              { backgroundColor: theme.backgroundElement, borderColor: theme.border },
            ]}
          >
            <TouchableOpacity
              onPress={() => setActiveSection('Drivers')}
              style={[
                styles.segmentBtn,
                activeSection === 'Drivers' && {
                  backgroundColor: theme.cardBackground,
                  ...Shadows.subtle,
                },
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  {
                    color: activeSection === 'Drivers' ? theme.text : theme.textSecondary,
                    fontWeight: activeSection === 'Drivers' ? '600' : '400',
                  },
                ]}
              >
                Drivers
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveSection('Passengers')}
              style={[
                styles.segmentBtn,
                activeSection === 'Passengers' && {
                  backgroundColor: theme.cardBackground,
                  ...Shadows.subtle,
                },
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  {
                    color: activeSection === 'Passengers' ? theme.text : theme.textSecondary,
                    fontWeight: activeSection === 'Passengers' ? '600' : '400',
                  },
                ]}
              >
                Passengers
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
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
            placeholder={
              activeSection === 'Drivers'
                ? 'Search driver name, vehicle...'
                : 'Search passenger name, stop...'
            }
            placeholderTextColor={theme.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={16} color={theme.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {activeSection === 'Drivers' && (
          <>
            {/* Filter Pills */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterScroll}
            >
              {filterTabs.map((tab) => {
                const isSelected = driverFilter === tab;
                return (
                  <TouchableOpacity
                    key={tab}
                    activeOpacity={0.7}
                    onPress={() => setDriverFilter(tab)}
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

            {/* Drivers Operational Summary Bar */}
            <View
              style={[
                styles.summaryBar,
                {
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text style={[styles.summaryTotal, { color: theme.text }]}>
                {kpis.totalDrivers} Drivers
              </Text>
              <View style={styles.summaryMetaRow}>
                <Text style={[styles.summaryItem, { color: theme.available }]}>
                  {kpis.driversAvailable} Available
                </Text>
                <Text style={[styles.summaryDot, { color: theme.textMuted }]}>•</Text>
                <Text style={[styles.summaryItem, { color: theme.onTrip }]}>
                  {kpis.driversOnTrip} On Trip
                </Text>
                <Text style={[styles.summaryDot, { color: theme.textMuted }]}>•</Text>
                <Text style={[styles.summaryItem, { color: theme.unavailable }]}>
                  {kpis.driversUnavailable} Unavailable
                </Text>
              </View>
            </View>
          </>
        )}
      </View>

      {/* List Content */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {activeSection === 'Drivers' ? (
          filteredDrivers.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={40} color={theme.textMuted} />
              <Text style={[styles.emptyTitle, { color: theme.text }]}>
                No drivers found
              </Text>
            </View>
          ) : (
            filteredDrivers.map((driver) => (
              <TouchableOpacity
                key={driver.id}
                activeOpacity={0.75}
                onPress={() => handleDriverPress(driver)}
                style={[
                  styles.driverCard,
                  {
                    backgroundColor: theme.cardBackground,
                    borderColor: theme.border,
                  },
                ]}
              >
                <View style={styles.driverCardTop}>
                  <View style={styles.driverNameRow}>
                    <Text style={[styles.driverName, { color: theme.text }]}>
                      {driver.name}
                    </Text>
                  </View>
                  <Badge status={driver.status} size="sm" />
                </View>

                <Text style={[styles.vehicleInfo, { color: theme.textSecondary }]}>
                  {driver.assignedVehicleModel} • {driver.assignedVehiclePlate}
                </Text>

                <View style={styles.driverCardFooter}>
                  {driver.status === 'Available' && (
                    <Text style={[styles.operationalStateText, { color: theme.available }]}>
                      Next trip: {driver.nextTripTime || 'On standby'}
                    </Text>
                  )}
                  {driver.status === 'On Trip' && (
                    <Text style={[styles.operationalStateText, { color: theme.onTrip }]}>
                      {driver.currentTripId ? `Trip #${driver.currentTripId.replace('trip-', '')}` : 'In Transit'} • {driver.currentTripRoute || 'Active route'}
                    </Text>
                  )}
                  {driver.status === 'Unavailable' && (
                    <Text style={[styles.operationalStateText, { color: theme.unavailable }]}>
                      Vehicle in maintenance
                    </Text>
                  )}

                  <View style={styles.actionArrow}>
                    <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )
        ) : (
          /* Passengers View */
          <View>
            <View
              style={[
                styles.summaryBar,
                {
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.border,
                  marginBottom: Spacing.md,
                },
              ]}
            >
              <Text style={[styles.summaryTotal, { color: theme.text }]}>
                Today's Roster: 248 Passengers
              </Text>
              <Text style={[styles.summaryItem, { color: theme.danger }]}>
                2 No-shows reported
              </Text>
            </View>

            {/* Sample passenger roster items */}
            {[
              { id: '1', name: 'Deepa Dixit', trip: 'Trip #3819', stop: 'Manjari Road', status: 'No-show' },
              { id: '2', name: 'Kiran More', trip: 'Trip #3821', stop: 'Shivajinagar Station', status: 'Waiting' },
              { id: '3', name: 'Neha Sharma', trip: 'Trip #3820', stop: 'Magarpatta City', status: 'Boarded' },
              { id: '4', name: 'Aarav Patel', trip: 'Trip #3821', stop: 'Kothrud Stand', status: 'Waiting' },
            ].map((p) => (
              <View
                key={p.id}
                style={[
                  styles.passengerCard,
                  {
                    backgroundColor: theme.cardBackground,
                    borderColor: p.status === 'No-show' ? theme.dangerBorder : theme.border,
                  },
                ]}
              >
                <View style={styles.passengerTop}>
                  <Text style={[styles.passengerName, { color: theme.text }]}>
                    {p.name}
                  </Text>
                  <Badge status={p.status} size="sm" />
                </View>
                <Text style={[styles.passengerMeta, { color: theme.textSecondary }]}>
                  {p.trip} • Pickup: {p.stop}
                </Text>
              </View>
            ))}
          </View>
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
  topRow: {
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
  segmentedWrap: {
    flexDirection: 'row',
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    padding: 2,
  },
  segmentBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.xs,
  },
  segmentText: {
    fontSize: Typography.fontSizes.xs + 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    marginBottom: Spacing.xs + 2,
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
    marginBottom: Spacing.xs,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  filterText: {
    fontSize: Typography.fontSizes.xs + 1,
  },
  summaryBar: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    marginTop: 4,
  },
  summaryTotal: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.bold,
  },
  summaryMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    flexWrap: 'wrap',
  },
  summaryItem: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.medium,
  },
  summaryDot: {
    marginHorizontal: 6,
    fontSize: Typography.fontSizes.xs,
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
  driverCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
    ...Shadows.subtle,
  },
  driverCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  driverNameRow: {
    flex: 1,
  },
  driverName: {
    fontSize: Typography.fontSizes.base,
    fontWeight: Typography.weights.bold,
  },
  vehicleInfo: {
    fontSize: Typography.fontSizes.sm,
    marginBottom: 8,
  },
  driverCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.1)',
  },
  operationalStateText: {
    fontSize: Typography.fontSizes.xs + 1,
    fontWeight: Typography.weights.medium,
  },
  actionArrow: {
    marginLeft: 8,
  },
  passengerCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  passengerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  passengerName: {
    fontSize: Typography.fontSizes.sm + 1,
    fontWeight: Typography.weights.semibold,
  },
  passengerMeta: {
    fontSize: Typography.fontSizes.xs,
  },
});
