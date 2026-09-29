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
import { SupervisorDriver } from '@/types';

type PeopleFilter = 'All' | 'Drivers' | 'Passengers';

const AVATAR_COLORS = ['#2563EB', '#06B6D4', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899'];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function PeopleScreen() {
  const router = useRouter();
  const { drivers, kpis, setSelectedDriverId, isDarkMode } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const [filter, setFilter] = useState<PeopleFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filterTabs: PeopleFilter[] = ['All', 'Drivers', 'Passengers'];

  const filteredDrivers = useMemo(() => {
    return drivers.filter((driver) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.assignedVehicleModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.assignedVehiclePlate.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [drivers, searchQuery]);

  const handleDriverPress = (driver: SupervisorDriver) => {
    setSelectedDriverId(driver.id);
    router.push('/driver-profile');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />

      <Header title="People" showBack />

      {/* Search Bar */}
      <View style={styles.searchSection}>
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
            placeholder="Search by name, vehicle, plate..."
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
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {filterTabs.map((tab) => {
            const isSelected = filter === tab;
            return (
              <TouchableOpacity
                key={tab}
                activeOpacity={0.7}
                onPress={() => setFilter(tab)}
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

      {/* People Summary */}
      <View style={styles.summarySection}>
        <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>
          PERSONNEL
        </Text>
        <View
          style={[
            styles.summaryBar,
            {
              backgroundColor: theme.cardBackground,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={[styles.summaryItem, { borderRightColor: theme.border }]}>
            <Text style={[styles.summaryCount, { color: theme.text }]}>{kpis.totalDrivers}</Text>
            <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>Total</Text>
          </View>
          <View style={[styles.summaryItem, { borderRightColor: theme.border }]}>
            <Text style={[styles.summaryCount, { color: theme.available }]}>{kpis.driversAvailable}</Text>
            <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>Available</Text>
          </View>
          <View style={[styles.summaryItem, { borderRightColor: theme.border }]}>
            <Text style={[styles.summaryCount, { color: theme.onTrip }]}>{kpis.driversOnTrip}</Text>
            <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>On Trip</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryCount, { color: theme.unavailable }]}>{kpis.driversUnavailable}</Text>
            <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>Unavail.</Text>
          </View>
        </View>
      </View>

      {/* People List */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filter === 'Passengers' ? (
          <View>
            {[
              { id: '1', name: 'Deepa Dixit', role: 'Passenger', trip: 'Trip #3819', stop: 'Manjari Road', status: 'No-show' },
              { id: '2', name: 'Kiran More', role: 'Passenger', trip: 'Trip #3821', stop: 'Shivajinagar Station', status: 'Waiting' },
              { id: '3', name: 'Neha Sharma', role: 'Passenger', trip: 'Trip #3820', stop: 'Magarpatta City', status: 'Boarded' },
              { id: '4', name: 'Aarav Patel', role: 'Passenger', trip: 'Trip #3821', stop: 'Kothrud Stand', status: 'Waiting' },
            ]
              .filter((p) => searchQuery.trim() === '' || p.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((p) => {
                const color = getAvatarColor(p.name);
                return (
                  <View
                    key={p.id}
                    style={[
                      styles.personCard,
                      {
                        backgroundColor: theme.cardBackground,
                        borderLeftColor: color,
                      },
                    ]}
                  >
                    <View style={styles.cardTopRow}>
                      <View style={[styles.avatar, { backgroundColor: `${color}20` }]}>
                        <Text style={[styles.avatarText, { color }]}>{getInitials(p.name)}</Text>
                      </View>
                      <View style={styles.personInfo}>
                        <Text style={[styles.personName, { color: theme.text }]}>{p.name}</Text>
                        <Text style={[styles.personRole, { color: theme.textMuted }]}>{p.role}</Text>
                      </View>
                      <Badge status={p.status} size="sm" />
                    </View>
                    <View style={styles.cardBottomRow}>
                      <View style={styles.metaChip}>
                        <Ionicons name="bus-outline" size={13} color={theme.textSecondary} />
                        <Text style={[styles.metaChipText, { color: theme.textSecondary }]}>{p.trip}</Text>
                      </View>
                      <View style={styles.metaChip}>
                        <Ionicons name="location-outline" size={13} color={theme.textSecondary} />
                        <Text style={[styles.metaChipText, { color: theme.textSecondary }]}>{p.stop}</Text>
                      </View>
                    </View>
                  </View>
                );
              })}
          </View>
        ) : filteredDrivers.length === 0 ? (
          <EmptyState
            title="No drivers found"
            description="Try adjusting your search or filter"
            icon="people-outline"
          />
        ) : (
          filteredDrivers.map((driver) => {
            const color = getAvatarColor(driver.name);

            return (
              <TouchableOpacity
                key={driver.id}
                activeOpacity={0.7}
                onPress={() => handleDriverPress(driver)}
                style={[
                  styles.personCard,
                  {
                    backgroundColor: theme.cardBackground,
                    borderLeftColor: color,
                  },
                ]}
              >
                {/* Top Row: Avatar + Info + Badge */}
                <View style={styles.cardTopRow}>
                  <View style={[styles.avatar, { backgroundColor: `${color}20` }]}>
                    <Text style={[styles.avatarText, { color }]}>{getInitials(driver.name)}</Text>
                  </View>
                  <View style={styles.personInfo}>
                    <Text style={[styles.personName, { color: theme.text }]} numberOfLines={1}>
                      {driver.name}
                    </Text>
                    <Text style={[styles.personRole, { color: theme.textMuted }]}>
                      {driver.assignedVehicleModel} • {driver.assignedVehiclePlate}
                    </Text>
                  </View>
                  <Badge status={driver.status} size="sm" />
                </View>

                {/* Bottom Row: Trip count + Status info */}
                <View style={styles.cardBottomRow}>
                  <View style={styles.metaChip}>
                    <Ionicons name="bus-outline" size={13} color={theme.textSecondary} />
                    <Text style={[styles.metaChipText, { color: theme.textSecondary }]}>
                      {driver.todayTrips} trips today
                    </Text>
                  </View>
                  <View style={styles.metaChip}>
                    <Ionicons name="checkmark-circle-outline" size={13} color={theme.textSecondary} />
                    <Text style={[styles.metaChipText, { color: theme.textSecondary }]}>
                      {driver.completedTrips} completed
                    </Text>
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
  searchSection: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.sm,
  },
  searchBar: {
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
  summarySection: {
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
  },
  sectionLabel: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  summaryBar: {
    flexDirection: 'row',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    paddingVertical: 12,
    ...Shadows.subtle,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    borderRightWidth: 1,
  },
  summaryCount: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.weights.bold,
  },
  summaryLabel: {
    fontSize: Typography.fontSizes.xs,
    marginTop: 2,
  },
  listContent: {
    padding: Spacing.base,
    paddingBottom: Spacing.xxl,
  },
  personCard: {
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
    marginBottom: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.5,
  },
  personInfo: {
    flex: 1,
  },
  personName: {
    fontSize: Typography.fontSizes.base,
    fontWeight: Typography.weights.bold,
    letterSpacing: -0.2,
  },
  personRole: {
    fontSize: Typography.fontSizes.xs + 1,
    marginTop: 2,
  },
  cardBottomRow: {
    flexDirection: 'row',
    gap: 16,
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
