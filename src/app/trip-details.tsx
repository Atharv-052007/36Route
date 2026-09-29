import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { Header } from '@/components/ui/Header';
import { Badge } from '@/components/ui/Badge';
import { AppButton } from '@/components/ui/AppButton';
import { RouteTimeline, EventTimeline } from '@/components/ui/Timeline';

export default function TripDetailsScreen() {
  const router = useRouter();
  const { trips, selectedTripId, isDarkMode } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const [passengersExpanded, setPassengersExpanded] = useState(false);

  const trip = trips.find((t) => t.id === selectedTripId) || trips[0];
  const needsDriver = trip.status === 'Needs Attention' && !trip.driverId;

  const handleCallDriver = () => {
    if (trip.driverPhone) {
      Linking.openURL(`tel:${trip.driverPhone}`);
    } else {
      Alert.alert('No Driver Assigned', 'Please assign a driver before calling.');
    }
  };

  return (
    <View style={[styles.safe, { backgroundColor: theme.background }]}>
      <Header
        title={trip.tripNumber}
        subtitle={`${trip.scheduledTime} · ${trip.routeSummary}`}
        showBack
        rightAction={<Badge status={needsDriver ? 'Driver required' : trip.status} size="md" />}
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Status Card */}
        <View style={[styles.heroCard, { backgroundColor: theme.cardBackground }, Shadows.medium]}>
          <View style={styles.heroTop}>
            <View style={styles.heroLeft}>
              <Text style={[styles.scheduledTime, { color: theme.text }]}>{trip.scheduledTime}</Text>
              <Text style={[styles.routeHeading, { color: theme.textSecondary }]}>{trip.routeSummary}</Text>
            </View>
          </View>

          {needsDriver && (
            <View style={[styles.alertBanner, { backgroundColor: theme.warningLight, borderColor: theme.warningBorder }]}>
              <Ionicons name="alert-circle" size={18} color={theme.warning} />
              <Text style={[styles.alertText, { color: theme.text }]}>No driver assigned</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push('/dispatch')}
                style={[styles.alertBtn, { backgroundColor: theme.warning }]}
              >
                <Text style={styles.alertBtnText}>Dispatch</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Passengers Section */}
        <View style={[styles.card, { backgroundColor: theme.cardBackground }, Shadows.small]}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setPassengersExpanded((prev) => !prev)}
            style={styles.cardHeader}
          >
            <View style={styles.cardTitleRow}>
              <Ionicons name="people-outline" size={16} color={theme.primary} />
              <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>PASSENGERS</Text>
              <View style={[styles.countBadge, { backgroundColor: theme.primaryLight }]}>
                <Text style={[styles.countText, { color: theme.primary }]}>
                  {trip.passengerCount}/{trip.maxCapacity}
                </Text>
              </View>
            </View>
            <Ionicons
              name={passengersExpanded ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={theme.primary}
            />
          </TouchableOpacity>

          {passengersExpanded && (
            <View style={styles.passengerList}>
              {trip.passengers.length === 0 ? (
                <Text style={[styles.emptyList, { color: theme.textSecondary }]}>
                  No passenger roster attached yet.
                </Text>
              ) : (
                trip.passengers.map((p) => (
                  <View key={p.id} style={[styles.passengerRow, { borderBottomColor: theme.borderLight }]}>
                    <View style={styles.passengerAvatar}>
                      <Text style={[styles.passengerInitial, { color: theme.primary }]}>
                        {p.name.charAt(0)}
                      </Text>
                    </View>
                    <View style={styles.passengerInfo}>
                      <Text style={[styles.passengerName, { color: theme.text }]}>{p.name}</Text>
                      <Text style={[styles.passengerRoute, { color: theme.textSecondary }]}>
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

        {/* Driver Section */}
        <View style={[styles.card, { backgroundColor: theme.cardBackground }, Shadows.small]}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="person-outline" size={16} color={theme.accent} />
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>DRIVER</Text>
          </View>

          {trip.driverName ? (
            <View style={styles.driverSection}>
              <View style={styles.driverRow}>
                <View style={[styles.driverAvatar, { backgroundColor: theme.accentLight }]}>
                  <Text style={[styles.driverInitial, { color: theme.accent }]}>
                    {trip.driverName.charAt(0)}
                  </Text>
                </View>
                <View style={styles.driverInfo}>
                  <Text style={[styles.driverName, { color: theme.text }]}>{trip.driverName}</Text>
                  <Text style={[styles.driverStatus, { color: theme.textSecondary }]}>
                    {trip.driverStatus || 'Available'}
                  </Text>
                </View>
                <Badge status={trip.driverStatus || 'Available'} size="sm" />
              </View>

              <View style={styles.driverActions}>
                <AppButton
                  title="Call Driver"
                  onPress={handleCallDriver}
                  variant="primary"
                  size="sm"
                  icon={<Ionicons name="call" size={16} color="#FFF" />}
                />
                <AppButton
                  title="Change"
                  onPress={() => router.push('/dispatch')}
                  variant="outline"
                  size="sm"
                  icon={<Ionicons name="swap-horizontal" size={16} color={theme.primary} />}
                />
              </View>
            </View>
          ) : (
            <View style={styles.unassignedBox}>
              <Text style={[styles.unassignedText, { color: theme.textSecondary }]}>
                No driver currently assigned.
              </Text>
              <AppButton
                title="Assign Driver"
                onPress={() => router.push('/dispatch')}
                variant="primary"
                size="sm"
                icon={<Ionicons name="person-add" size={16} color="#FFF" />}
              />
            </View>
          )}
        </View>

        {/* Vehicle Section */}
        <View style={[styles.card, { backgroundColor: theme.cardBackground }, Shadows.small]}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="car-sport-outline" size={16} color={theme.secondary} />
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>VEHICLE</Text>
          </View>

          <View style={styles.vehicleRow}>
            <View style={[styles.vehicleIcon, { backgroundColor: theme.secondaryLight }]}>
              <Ionicons name="car-sport" size={20} color={theme.secondary} />
            </View>
            <View style={styles.vehicleInfo}>
              <Text style={[styles.vehicleModel, { color: theme.text }]}>
                {trip.vehicleModel || 'Toyota Innova'}
              </Text>
              <Text style={[styles.vehiclePlate, { color: theme.textSecondary }]}>
                {trip.vehiclePlate || 'MH-12-AB-1234'} · {trip.maxCapacity} seats
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/vehicles')}
              style={[styles.changeBtn, { backgroundColor: theme.backgroundElement }]}
            >
              <Text style={[styles.changeBtnText, { color: theme.text }]}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Route Section */}
        <View style={[styles.card, { backgroundColor: theme.cardBackground }, Shadows.small]}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="map-outline" size={16} color={theme.primary} />
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>ROUTE</Text>
          </View>
          <RouteTimeline stops={trip.stops} style={{ marginTop: Spacing.xs }} />
        </View>

        {/* Events Timeline */}
        <View style={[styles.card, { backgroundColor: theme.cardBackground }, Shadows.small]}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="time-outline" size={16} color={theme.warning} />
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>TRIP EVENTS</Text>
          </View>
          <EventTimeline events={trip.events} style={{ marginTop: Spacing.xs }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    padding: Spacing.base,
    paddingBottom: Spacing.xxl,
    gap: Spacing.md,
  },
  heroCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.1)',
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroLeft: {
    flex: 1,
  },
  scheduledTime: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: Typography.weights.bold,
    letterSpacing: -0.5,
  },
  routeHeading: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.medium,
    marginTop: 2,
  },
  alertBanner: {
    marginTop: Spacing.md,
    padding: Spacing.sm + 4,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  alertText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.medium,
    flex: 1,
  },
  alertBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.xs,
  },
  alertBtnText: {
    color: '#FFFFFF',
    fontSize: Typography.fontSizes.xs + 1,
    fontWeight: Typography.weights.bold,
  },
  card: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.06)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.8,
    flex: 1,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  countText: {
    fontSize: Typography.fontSizes.xs + 1,
    fontWeight: Typography.weights.bold,
  },
  passengerList: {
    gap: Spacing.sm,
  },
  emptyList: {
    fontSize: Typography.fontSizes.sm,
    paddingVertical: Spacing.sm,
  },
  passengerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    gap: Spacing.sm + 4,
  },
  passengerAvatar: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  passengerInitial: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.bold,
  },
  passengerInfo: {
    flex: 1,
  },
  passengerName: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  passengerRoute: {
    fontSize: Typography.fontSizes.xs,
    marginTop: 1,
  },
  driverSection: {
    gap: Spacing.md,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
  },
  driverAvatar: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverInitial: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.weights.bold,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.bold,
  },
  driverStatus: {
    fontSize: Typography.fontSizes.xs + 1,
    marginTop: 1,
  },
  driverActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  unassignedBox: {
    gap: Spacing.sm,
  },
  unassignedText: {
    fontSize: Typography.fontSizes.sm,
    marginBottom: Spacing.xs,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
  },
  vehicleIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleModel: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.bold,
  },
  vehiclePlate: {
    fontSize: Typography.fontSizes.sm,
    marginTop: 1,
  },
  changeBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.sm,
  },
  changeBtnText: {
    fontSize: Typography.fontSizes.xs + 1,
    fontWeight: Typography.weights.semibold,
  },
});
