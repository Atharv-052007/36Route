import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Typography, BorderRadius, Spacing, Shadows } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { Header } from '@/components/ui/Header';
import { Badge } from '@/components/ui/Badge';
import { AppButton } from '@/components/ui/AppButton';

export default function RideDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { rides, activeRide, cancelRide, isDarkMode } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const ride = rides.find((r) => r.id === id) || activeRide || rides[0];

  if (!ride) {
    return (
      <View style={[styles.safe, { backgroundColor: theme.background }]}>
        <Header title="Ride Details" showBack />
        <View style={styles.emptyState}>
          <Ionicons name="car-outline" size={48} color={theme.textMuted} />
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            Ride not found
          </Text>
        </View>
      </View>
    );
  }

  const handleCancel = () => {
    Alert.alert('Cancel Ride', 'Are you sure you want to cancel?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, Cancel',
        style: 'destructive',
        onPress: async () => {
          await cancelRide(ride.id);
          router.dismissTo('/(tabs)');
        },
      },
    ]);
  };

  return (
    <View style={[styles.safe, { backgroundColor: theme.background }]}>
      <Header
        title="Ride Details"
        showBack
        rightAction={<Badge status={ride.status} size="md" />}
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Status Section */}
        <View style={[styles.heroCard, { backgroundColor: theme.cardBackground }, Shadows.medium]}>
          <View style={styles.heroTop}>
            <View style={styles.bookingRow}>
              <Ionicons name="receipt-outline" size={16} color={theme.primary} />
              <Text style={[styles.bookingId, { color: theme.text }]}>{ride.bookingId}</Text>
            </View>
            <Badge status={ride.status} size="md" />
          </View>

          <Text style={[styles.dateTime, { color: theme.textSecondary }]}>
            {ride.date} · {ride.time} · {ride.shiftType === 'PICKUP' ? 'Morning Pickup' : 'Evening Drop'}
          </Text>

          {ride.otp && (
            <View style={[styles.otpRow, { backgroundColor: theme.primaryLight }]}>
              <Ionicons name="key" size={16} color={theme.primary} />
              <Text style={[styles.otpLabel, { color: theme.primary }]}>OTP</Text>
              <Text style={[styles.otpValue, { color: theme.primary }]}>{ride.otp}</Text>
            </View>
          )}
        </View>

        {/* Route Visualization */}
        <View style={[styles.routeCard, { backgroundColor: theme.cardBackground }, Shadows.small]}>
          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>ROUTE</Text>

          <View style={styles.routeVisual}>
            <View style={styles.routeTimeline}>
              <View style={[styles.routeDot, { backgroundColor: theme.accent }]} />
              <View style={[styles.routeLine, { backgroundColor: theme.border }]} />
              <View style={[styles.routeDot, { backgroundColor: theme.danger }]} />
            </View>

            <View style={styles.routeDetails}>
              <View style={styles.routeStop}>
                <Text style={[styles.routeStopLabel, { color: theme.textSecondary }]}>Pickup</Text>
                <Text style={[styles.routeStopName, { color: theme.text }]}>{ride.pickup.name || 'Pickup'}</Text>
              </View>
              <View style={styles.routeStop}>
                <Text style={[styles.routeStopLabel, { color: theme.textSecondary }]}>Drop</Text>
                <Text style={[styles.routeStopName, { color: theme.text }]}>{ride.drop.name || 'Drop'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Driver Card */}
        {ride.driver && (
          <View style={[styles.driverCard, { backgroundColor: theme.cardBackground }, Shadows.small]}>
            <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>DRIVER</Text>

            <View style={styles.driverRow}>
              <View style={[styles.driverAvatar, { backgroundColor: theme.primaryLight }]}>
                <Text style={[styles.driverInitial, { color: theme.primary }]}>
                  {ride.driver.name?.charAt(0) || 'D'}
                </Text>
              </View>
              <View style={styles.driverInfo}>
                <Text style={[styles.driverName, { color: theme.text }]}>{ride.driver.name}</Text>
                <View style={styles.driverMeta}>
                  <Ionicons name="star" size={12} color={theme.warning} />
                  <Text style={[styles.driverRating, { color: theme.textSecondary }]}>
                    {ride.driver.rating}
                  </Text>
                   {ride.driver.assignedVehicle && (
                    <>
                      <View style={[styles.metaDot, { backgroundColor: theme.textMuted }]} />
                      <Text style={[styles.driverVehicle, { color: theme.textSecondary }]}>
                        {ride.driver.assignedVehicle}
                      </Text>
                    </>
                  )}
                </View>
              </View>
              <TouchableOpacity
                style={[styles.callBtn, { backgroundColor: theme.accentLight }]}
                onPress={() => {
                  if (ride.driver?.phone) {
                    const { Linking } = require('react-native');
                    Linking.openURL(`tel:${ride.driver.phone}`);
                  }
                }}
              >
                <Ionicons name="call" size={16} color={theme.accent} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Trip Metrics */}
        <View style={[styles.metricsCard, { backgroundColor: theme.cardBackground }, Shadows.small]}>
          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>TRIP METRICS</Text>

          <View style={styles.metricsGrid}>
            <View style={[styles.metricItem, { backgroundColor: theme.backgroundElement }]}>
              <Ionicons name="navigate-outline" size={20} color={theme.primary} />
              <Text style={[styles.metricValue, { color: theme.text }]}>
                {ride.estimatedDistanceKm}
              </Text>
              <Text style={[styles.metricUnit, { color: theme.textSecondary }]}>km</Text>
            </View>

            <View style={[styles.metricItem, { backgroundColor: theme.backgroundElement }]}>
              <Ionicons name="time-outline" size={20} color={theme.accent} />
              <Text style={[styles.metricValue, { color: theme.text }]}>
                {ride.estimatedDurationMins}
              </Text>
              <Text style={[styles.metricUnit, { color: theme.textSecondary }]}>min</Text>
            </View>

            {ride.coPassengersCount !== undefined && (
              <View style={[styles.metricItem, { backgroundColor: theme.backgroundElement }]}>
                <Ionicons name="people-outline" size={20} color={theme.secondary} />
                <Text style={[styles.metricValue, { color: theme.text }]}>
                  {ride.coPassengersCount}
                </Text>
                <Text style={[styles.metricUnit, { color: theme.textSecondary }]}>co-pass</Text>
              </View>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          {ride.status === 'IN_TRANSIT' && (
            <AppButton
              title="Track Live Vehicle"
              onPress={() => router.push('/(tabs)/track')}
              icon={<Ionicons name="navigate" size={18} color="#FFF" />}
            />
          )}
          {(ride.status === 'SCHEDULED' || ride.status === 'BOARDING') && (
            <AppButton
              title="Cancel Ride"
              onPress={handleCancel}
              variant="danger"
              icon={<Ionicons name="close-circle" size={18} color="#FFF" />}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: Spacing.base, paddingBottom: 40, gap: Spacing.md },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  emptyText: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.medium,
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
    marginBottom: Spacing.xs,
  },
  bookingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  bookingId: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.weights.bold,
    letterSpacing: -0.3,
  },
  dateTime: {
    fontSize: Typography.fontSizes.sm,
    marginBottom: Spacing.md,
  },
  otpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm + 4,
    borderRadius: BorderRadius.sm,
    gap: Spacing.sm,
  },
  otpLabel: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.medium,
  },
  otpValue: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.weights.bold,
    letterSpacing: 4,
    marginLeft: 'auto',
  },
  routeCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.06)',
  },
  sectionLabel: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.bold,
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  routeVisual: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  routeTimeline: {
    alignItems: 'center',
    paddingTop: 4,
  },
  routeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  routeLine: {
    width: 2,
    height: 32,
    marginVertical: 4,
    borderRadius: 1,
  },
  routeDetails: {
    flex: 1,
    gap: Spacing.md,
  },
  routeStop: {},
  routeStopLabel: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.medium,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  routeStopName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.semibold,
  },
  driverCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.06)',
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
  },
  driverAvatar: {
    width: 48,
    height: 48,
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
  driverMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  driverRating: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.medium,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
  driverVehicle: {
    fontSize: Typography.fontSizes.sm,
  },
  callBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricsCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.06)',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.sm + 4,
    borderRadius: BorderRadius.md,
    gap: 4,
  },
  metricValue: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.weights.bold,
  },
  metricUnit: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.medium,
  },
  actions: {
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
});
