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
import { SupervisorVehicle } from '@/types';

type VehicleFilter = 'All' | 'Available' | 'On Trip' | 'Maintenance';

export default function VehiclesScreen() {
  const router = useRouter();
  const { vehicles, kpis, setSelectedVehicleId, isDarkMode } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const [filter, setFilter] = useState<VehicleFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filterTabs: VehicleFilter[] = ['All', 'Available', 'On Trip', 'Maintenance'];

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.currentDriverName && v.currentDriverName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesFilter = filter === 'All' || v.status === filter;

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
        backgroundColor={theme.cardBackground}
      />

      <Header title="Vehicles" showBack />

      <View
        style={[
          styles.filterContainer,
          {
            backgroundColor: theme.cardBackground,
            borderBottomColor: theme.border,
          },
        ]}
      >
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
            placeholder="Search vehicle model, plate number..."
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

        {/* Filter Pills */}
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

        {/* Fleet Operational Summary */}
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
            {kpis.totalVehicles} Vehicles
          </Text>
          <View style={styles.summaryMetaRow}>
            <Text style={[styles.summaryItem, { color: theme.available }]}>
              {kpis.vehiclesAvailable} Available
            </Text>
            <Text style={[styles.summaryDot, { color: theme.textMuted }]}>•</Text>
            <Text style={[styles.summaryItem, { color: theme.onTrip }]}>
              {kpis.vehiclesOnTrip} On Trip
            </Text>
            <Text style={[styles.summaryDot, { color: theme.textMuted }]}>•</Text>
            <Text style={[styles.summaryItem, { color: theme.maintenance }]}>
              {kpis.vehiclesMaintenance} Maintenance
            </Text>
          </View>
        </View>
      </View>

      {/* Vehicle Cards List */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredVehicles.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="car-outline" size={40} color={theme.textMuted} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              No vehicles found
            </Text>
          </View>
        ) : (
          filteredVehicles.map((vehicle) => (
            <TouchableOpacity
              key={vehicle.id}
              activeOpacity={0.75}
              onPress={() => handleVehiclePress(vehicle)}
              style={[
                styles.vehicleCard,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor:
                    vehicle.status === 'Maintenance'
                      ? theme.warningBorder
                      : theme.border,
                },
              ]}
            >
              <View style={styles.cardTop}>
                <View>
                  <Text style={[styles.modelText, { color: theme.text }]}>
                    {vehicle.model}
                  </Text>
                  <Text style={[styles.plateText, { color: theme.textSecondary }]}>
                    {vehicle.plateNumber}
                  </Text>
                </View>
                <Badge status={vehicle.status} size="sm" />
              </View>

              <View style={styles.cardFooter}>
                <View style={styles.metaItem}>
                  <Text style={[styles.metaLabel, { color: theme.textMuted }]}>
                    Capacity:
                  </Text>
                  <Text style={[styles.metaValue, { color: theme.text }]}>
                    {vehicle.capacity}
                  </Text>
                </View>

                <View style={styles.metaItem}>
                  <Text style={[styles.metaLabel, { color: theme.textMuted }]}>
                    Driver:
                  </Text>
                  <Text style={[styles.metaValue, { color: theme.text }]}>
                    {vehicle.currentDriverName || 'Unassigned'}
                  </Text>
                </View>

                <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
              </View>
            </TouchableOpacity>
          ))
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
  filterContainer: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
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
    marginTop: 2,
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
  vehicleCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
    ...Shadows.subtle,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  modelText: {
    fontSize: Typography.fontSizes.base,
    fontWeight: Typography.weights.bold,
  },
  plateText: {
    fontSize: Typography.fontSizes.sm,
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.1)',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaLabel: {
    fontSize: Typography.fontSizes.xs + 1,
  },
  metaValue: {
    fontSize: Typography.fontSizes.xs + 1,
    fontWeight: Typography.weights.semibold,
  },
});
