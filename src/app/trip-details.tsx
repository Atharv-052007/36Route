import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  Linking,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { Header } from '@/components/ui/Header';
import { Badge } from '@/components/ui/Badge';
import { RouteTimeline, EventTimeline } from '@/components/ui/Timeline';

export default function TripDetailsScreen() {
  const router = useRouter();
  const { trips, selectedTripId, setSelectedDriverId, isDarkMode } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const [passengersExpanded, setPassengersExpanded] = useState(false);

  // Find the selected trip or fallback to the first trip
  const trip = trips.find((t) => t.id === selectedTripId) || trips[0];

  const needsDriver = trip.status === 'Needs Attention' && !trip.driverId;

  const handleCallDriver = () => {
    if (trip.driverPhone) {
      Linking.openURL(`tel:${trip.driverPhone}`);
    } else {
      Alert.alert('No Driver Assigned', 'Please assign a driver before calling.');
    }
  };

  const handleChangeDriver = () => {
    router.push('/dispatch');
  };

  const handleChangeVehicle = () => {
    router.push('/vehicles');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.cardBackground}
      />

      <Header
        title={trip.tripNumber}
        subtitle={`${trip.scheduledTime} • ${trip.routeSummary}`}
        showBack
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Status Banner */}
        <View
          style={[
            styles.statusCard,
            {
              backgroundColor: theme.cardBackground,
              borderColor: needsDriver ? theme.warningBorder : theme.border,
            },
          ]}
        >
          <View style={styles.statusTop}>
            <View>
              <Text style={[styles.scheduledTime, { color: theme.text }]}>
                {trip.scheduledTime}
              </Text>
              <Text style={[styles.routeHeading, { color: theme.text }]}>
                {trip.routeSummary}
              </Text>
            </View>
            <Badge
              status={needsDriver ? 'Driver required' : trip.status}
              size="md"
            />
          </View>

          {needsDriver && (
            <View
              style={[
                styles.dispatchActionCallout,
                { backgroundColor: theme.warningLight, borderColor: theme.warningBorder },
              ]}
            >
              <View style={styles.calloutTextWrap}>
                <Ionicons name="alert-circle" size={18} color={theme.warning} />
                <Text style={[styles.calloutText, { color: theme.text }]}>
                  This trip has no assigned driver
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push('/dispatch')}
                style={[styles.calloutBtn, { backgroundColor: theme.warning }]}
              >
                <Text style={styles.calloutBtnText}>Dispatch Driver</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* PASSENGERS Section */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.cardBackground,
              borderColor: theme.border,
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setPassengersExpanded((prev) => !prev)}
            style={styles.cardHeaderRow}
          >
            <View style={styles.sectionTitleRow}>
              <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                PASSENGERS
              </Text>
              <Text style={[styles.passengerCountBadge, { color: theme.text }]}>
                {trip.passengerCount} / {trip.maxCapacity}
              </Text>
            </View>
            <View style={styles.expandRow}>
              <Text style={[styles.expandText, { color: theme.accent }]}>
                {passengersExpanded ? 'Hide' : 'View list'}
              </Text>
              <Ionicons
                name={passengersExpanded ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={theme.accent}
              />
            </View>
          </TouchableOpacity>

          {passengersExpanded && (
            <View style={styles.passengersList}>
              {trip.passengers.length === 0 ? (
                <Text style={[styles.emptyListText, { color: theme.textSecondary }]}>
                  No passenger roster attached yet.
                </Text>
              ) : (
                trip.passengers.map((p) => (
                  <View
                    key={p.id}
                    style={[
                      styles.passengerRow,
                      { borderBottomColor: theme.borderLight },
                    ]}
                  >
                    <View style={styles.pInfo}>
                      <Text style={[styles.pName, { color: theme.text }]}>
                        {p.name}
                      </Text>
                      <Text style={[styles.pSub, { color: theme.textSecondary }]}>
                        {p.pickupPoint} → {p.dropPoint}
                      </Text>
                    </View>
                    <Badge status={p.status} size="sm" />
                  </View>
                ))
              )}
            </View>
          )}
        </View>

        {/* DRIVER Section */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.cardBackground,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            DRIVER
          </Text>

          {trip.driverName ? (
            <>
              <View style={styles.driverInfoRow}>
                <View>
                  <Text style={[styles.driverName, { color: theme.text }]}>
                    {trip.driverName}
                  </Text>
                  <Text style={[styles.driverStatusText, { color: theme.textSecondary }]}>
                    {trip.driverStatus || 'Available'}
                  </Text>
                </View>
                <Badge
                  status={trip.driverStatus || 'Available'}
                  size="sm"
                />
              </View>

              <View style={styles.buttonsRow}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleChangeDriver}
                  style={[
                    styles.secondaryBtn,
                    {
                      backgroundColor: theme.backgroundElement,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Ionicons name="swap-horizontal" size={16} color={theme.text} />
                  <Text style={[styles.btnText, { color: theme.text }]}>
                    Change Driver
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleCallDriver}
                  style={[
                    styles.primaryBtn,
                    {
                      backgroundColor: theme.primary,
                    },
                  ]}
                >
                  <Ionicons name="call" size={16} color="#FFFFFF" />
                  <Text style={styles.primaryBtnText}>Call Driver</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.unassignedDriverBox}>
              <Text style={[styles.unassignedText, { color: theme.textSecondary }]}>
                No driver currently assigned to this trip.
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push('/dispatch')}
                style={[
                  styles.primaryBtn,
                  { backgroundColor: theme.accent, marginTop: Spacing.sm },
                ]}
              >
                <Ionicons name="person-add" size={16} color="#FFFFFF" />
                <Text style={styles.primaryBtnText}>Assign Driver</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* VEHICLE Section */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.cardBackground,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            VEHICLE
          </Text>
          <View style={styles.vehicleInfoRow}>
            <View>
              <Text style={[styles.vehicleModel, { color: theme.text }]}>
                {trip.vehicleModel || 'Toyota Innova'}
              </Text>
              <Text style={[styles.vehiclePlate, { color: theme.textSecondary }]}>
                {trip.vehiclePlate || 'MH-12-AB-1234'} • Capacity: {trip.maxCapacity}
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleChangeVehicle}
              style={[
                styles.changeVehicleBtn,
                {
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text style={[styles.btnTextSmall, { color: theme.text }]}>
                Change Vehicle
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ROUTE Section */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.cardBackground,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            ROUTE
          </Text>
          <RouteTimeline stops={trip.stops} style={{ marginTop: Spacing.xs }} />
        </View>

        {/* TRIP EVENTS Section */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.cardBackground,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            TRIP EVENTS
          </Text>
          <EventTimeline events={trip.events} style={{ marginTop: Spacing.xs }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    padding: Spacing.base,
    paddingBottom: Spacing.xxl,
  },
  statusCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  statusTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  scheduledTime: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: Typography.weights.bold,
  },
  routeHeading: {
    fontSize: Typography.fontSizes.base,
    fontWeight: Typography.weights.semibold,
    marginTop: 2,
  },
  dispatchActionCallout: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  calloutTextWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  calloutText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.medium,
  },
  calloutBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
  },
  calloutBtnText: {
    color: '#FFFFFF',
    fontSize: Typography.fontSizes.xs + 1,
    fontWeight: Typography.weights.bold,
  },
  card: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  passengerCountBadge: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.bold,
  },
  expandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  expandText: {
    fontSize: Typography.fontSizes.xs + 1,
    fontWeight: Typography.weights.semibold,
  },
  passengersList: {
    marginTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.15)',
    paddingTop: Spacing.xs,
  },
  emptyListText: {
    fontSize: Typography.fontSizes.sm,
    paddingVertical: Spacing.sm,
  },
  passengerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  pInfo: {
    flex: 1,
  },
  pName: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  pSub: {
    fontSize: Typography.fontSizes.xs,
    marginTop: 2,
  },
  driverInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: Spacing.xs,
  },
  driverName: {
    fontSize: Typography.fontSizes.base,
    fontWeight: Typography.weights.bold,
  },
  driverStatusText: {
    fontSize: Typography.fontSizes.xs + 1,
    marginTop: 2,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  primaryBtn: {
    flex: 1,
    height: 42,
    borderRadius: BorderRadius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  secondaryBtn: {
    flex: 1,
    height: 42,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  btnText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.medium,
  },
  unassignedDriverBox: {
    paddingVertical: Spacing.sm,
  },
  unassignedText: {
    fontSize: Typography.fontSizes.sm,
  },
  vehicleInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  vehicleModel: {
    fontSize: Typography.fontSizes.base,
    fontWeight: Typography.weights.bold,
  },
  vehiclePlate: {
    fontSize: Typography.fontSizes.xs + 1,
    marginTop: 2,
  },
  changeVehicleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  btnTextSmall: {
    fontSize: Typography.fontSizes.xs + 1,
    fontWeight: Typography.weights.medium,
  },
});
