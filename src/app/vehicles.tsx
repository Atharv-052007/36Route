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
import { SupervisorVehicle } from '@/types';

type VehicleFilter = 'All' | 'Active' | 'Maintenance' | 'Offline';

const STATUS_BORDER_COLORS: Record<string, string> = {
  Available: '#10B981',
  'On Trip': '#2563EB',
  Maintenance: '#F59E0B',
};

const STATUS_ICON: Record<string, string> = {
  Available: 'car-sport',
  'On Trip': 'car-sport',
  Maintenance: 'construct',
};

export default function VehiclesScreen() {
  const router = useRouter();
  const { vehicles, kpis, setSelectedVehicleId, isDarkMode } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const [filter, setFilter] = useState<VehicleFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filterTabs: VehicleFilter[] = ['All', 'Active', 'Maintenance', 'Offline'];

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.currentDriverName && v.currentDriverName.toLowerCase().includes(searchQuery.toLowerCase()));

      let matchesFilter = true;
      if (filter === 'Active') matchesFilter = v.status === 'Available' || v.status === 'On Trip';
      else if (filter === 'Maintenance') matchesFilter = v.status === 'Maintenance';
      else if (filter === 'Offline') matchesFilter = false;

      return matchesSearch && matchesFilter;
    });
  }, [vehicles, searchQuery, filter]);

  const handleVehiclePress = (v: SupervisorVehicle) => {
    setSelectedVehicleId(v.id);
    router.push('/vehicle-details');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />

      <Header title="Vehicles" showBack />

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
            placeholder="Search model, plate number, driver..."
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

      {/* Fleet Summary */}
      <View style={styles.summarySection}>
        <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>
          FLEET OVERVIEW
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
            <Text style={[styles.summaryCount, { color: theme.text }]}>{kpis.totalVehicles}</Text>
            <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>Total</Text>
          </View>
          <View style={[styles.summaryItem, { borderRightColor: theme.border }]}>
            <Text style={[styles.summaryCount, { color: theme.available }]}>{kpis.vehiclesAvailable}</Text>
            <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>Available</Text>
          </View>
          <View style={[styles.summaryItem, { borderRightColor: theme.border }]}>
            <Text style={[styles.summaryCount, { color: theme.onTrip }]}>{kpis.vehiclesOnTrip}</Text>
            <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>On Trip</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryCount, { color: theme.maintenance }]}>{kpis.vehiclesMaintenance}</Text>
            <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>Maint.</Text>
          </View>
        </View>
      </View>

      {/* Vehicle List */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredVehicles.length === 0 ? (
          <EmptyState
            title="No vehicles found"
            description="Try adjusting your search or filter"
            icon="car-outline"
          />
        ) : (
          filteredVehicles.map((vehicle) => {
            const borderColor = STATUS_BORDER_COLORS[vehicle.status] || theme.border;
            const iconName = STATUS_ICON[vehicle.status] || 'car-sport';

            return (
              <TouchableOpacity
                key={vehicle.id}
                activeOpacity={0.7}
                onPress={() => handleVehiclePress(vehicle)}
                style={[
                  styles.vehicleCard,
                  {
                    backgroundColor: theme.cardBackground,
                    borderLeftColor: borderColor,
                  },
                ]}
              >
                {/* Top Row: Icon + Info + Badge */}
                <View style={styles.cardTopRow}>
                  <View style={[styles.vehicleIconWrap, { backgroundColor: `${borderColor}18` }]}>
                    <Ionicons name={iconName as any} size={22} color={borderColor} />
                  </View>
                  <View style={styles.vehicleInfo}>
                    <Text style={[styles.vehicleModel, { color: theme.text }]} numberOfLines={1}>
                      {vehicle.model}
                    </Text>
                    <Text style={[styles.vehiclePlate, { color: theme.textMuted }]}>
                      {vehicle.plateNumber}
                    </Text>
                  </View>
                  <Badge status={vehicle.status} size="sm" />
                </View>

                {/* Bottom Row: Driver + Capacity */}
                <View style={styles.cardBottomRow}>
                  <View style={styles.metaChip}>
                    <Ionicons name="person-outline" size={13} color={theme.textSecondary} />
                    <Text style={[styles.metaChipText, { color: theme.textSecondary }]}>
                      {vehicle.currentDriverName || 'Unassigned'}
                    </Text>
                  </View>
                  <View style={styles.metaChip}>
                    <Ionicons name="people-outline" size={13} color={theme.textSecondary} />
                    <Text style={[styles.metaChipText, { color: theme.textSecondary }]}>
                      {vehicle.capacity} seats
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
  vehicleCard: {
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
  vehicleIconWrap: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleModel: {
    fontSize: Typography.fontSizes.base,
    fontWeight: Typography.weights.bold,
    letterSpacing: -0.2,
  },
  vehiclePlate: {
    fontSize: Typography.fontSizes.xs + 1,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  cardBottomRow: {
    flexDirection: 'row',
    gap: 12,
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
