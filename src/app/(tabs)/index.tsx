import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { StatCard } from '@/components/ui/StatCard';
import { AlertCard } from '@/components/ui/AlertCard';
import { Badge } from '@/components/ui/Badge';

export default function OverviewScreen() {
  const router = useRouter();
  const {
    user,
    kpis,
    alerts,
    trips,
    setSelectedTripId,
    isDarkMode,
  } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const unresolvedAlerts = alerts.filter((a) => !a.resolved);

  const nextUpTrips = trips
    .filter((t) => t.status === 'Needs Attention' || t.status === 'Upcoming')
    .slice(0, 3);

  const handleAlertPress = (alert: any) => {
    if (alert.tripId) {
      setSelectedTripId(alert.tripId);
      if (alert.type === 'driver_required') {
        router.push('/dispatch');
      } else {
        router.push('/trip-details');
      }
    } else {
      router.push('/(tabs)/people');
    }
  };

  const handleTripCardPress = (trip: any) => {
    setSelectedTripId(trip.id);
    if (trip.status === 'Needs Attention' && !trip.driverId) {
      router.push('/dispatch');
    } else {
      router.push('/trip-details');
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: theme.background },
      ]}
    >
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.cardBackground}
      />

      {/* Screen Header */}
      <View
        style={[
          styles.headerBar,
          {
            backgroundColor: theme.cardBackground,
            borderBottomColor: theme.border,
          },
        ]}
      >
        <View style={styles.headerLeft}>
          <Text style={[styles.greeting, { color: theme.text }]}>
            Good morning, {user?.name || 'Govind'}
          </Text>
          <Text style={[styles.dateText, { color: theme.textSecondary }]}>
            Thursday, 4 September
          </Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push('/notifications')}
            style={[styles.iconButton, { backgroundColor: theme.backgroundElement }]}
          >
            <Ionicons name="notifications-outline" size={20} color={theme.text} />
            {unresolvedAlerts.length > 0 && (
              <View
                style={[
                  styles.notificationBadge,
                  { backgroundColor: theme.warning },
                ]}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push('/(tabs)/more')}
            style={[styles.avatarButton, { backgroundColor: theme.accent }]}
          >
            <Text style={styles.avatarText}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'G'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* TODAY Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            TODAY
          </Text>
          <View style={styles.metricsRow}>
            <StatCard
              label="Trips"
              value={kpis.totalTripsToday}
              onPress={() => router.push('/(tabs)/trips')}
            />
            <StatCard
              label="Drivers"
              value={kpis.totalDrivers}
              onPress={() => router.push('/(tabs)/people')}
            />
            <StatCard
              label="Vehicles"
              value={kpis.totalVehicles}
              onPress={() => router.push('/vehicles')}
            />
          </View>
        </View>

        {/* LIVE NOW Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            LIVE NOW
          </Text>
          <View
            style={[
              styles.liveStatusContainer,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.border,
              },
            ]}
          >
            <View style={styles.liveCol}>
              <Text style={[styles.liveValue, { color: theme.accent }]}>
                {kpis.ongoingTrips}
              </Text>
              <Text style={[styles.liveLabel, { color: theme.textSecondary }]}>
                Ongoing
              </Text>
            </View>
            <View style={[styles.liveDivider, { backgroundColor: theme.border }]} />
            <View style={styles.liveCol}>
              <Text style={[styles.liveValue, { color: theme.upcoming }]}>
                {kpis.upcomingTrips}
              </Text>
              <Text style={[styles.liveLabel, { color: theme.textSecondary }]}>
                Upcoming
              </Text>
            </View>
            <View style={[styles.liveDivider, { backgroundColor: theme.border }]} />
            <View style={styles.liveCol}>
              <Text style={[styles.liveValue, { color: theme.available }]}>
                {kpis.completedTrips}
              </Text>
              <Text style={[styles.liveLabel, { color: theme.textSecondary }]}>
                Completed
              </Text>
            </View>
          </View>
        </View>

        {/* NEEDS ATTENTION Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
              NEEDS ATTENTION
            </Text>
            {unresolvedAlerts.length > 0 && (
              <Badge
                status="Needs Attention"
                label={`${unresolvedAlerts.length} Actionable`}
                size="sm"
              />
            )}
          </View>

          {unresolvedAlerts.length === 0 ? (
            <View
              style={[
                styles.emptyAttentionBox,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.border,
                },
              ]}
            >
              <Ionicons name="checkmark-circle-outline" size={20} color={theme.available} />
              <Text style={[styles.emptyAttentionText, { color: theme.textSecondary }]}>
                All operations running smoothly. No urgent items.
              </Text>
            </View>
          ) : (
            unresolvedAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                title={alert.title}
                subtitle={alert.subtitle}
                severity={alert.type === 'vehicle_unavailable' ? 'danger' : 'warning'}
                onPress={() => handleAlertPress(alert)}
              />
            ))
          )}
        </View>

        {/* QUICK ACTIONS Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            QUICK ACTIONS
          </Text>
          <View style={styles.quickActionsRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/create-trip')}
              style={[
                styles.quickActionBtn,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.border,
                },
              ]}
            >
              <View
                style={[
                  styles.quickActionIconWrap,
                  { backgroundColor: theme.accentLight },
                ]}
              >
                <Ionicons name="add" size={18} color={theme.accent} />
              </View>
              <Text style={[styles.quickActionText, { color: theme.text }]}>
                Create Trip
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/(tabs)/people')}
              style={[
                styles.quickActionBtn,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.border,
                },
              ]}
            >
              <View
                style={[
                  styles.quickActionIconWrap,
                  { backgroundColor: theme.availableLight },
                ]}
              >
                <Ionicons name="person-add-outline" size={16} color={theme.available} />
              </View>
              <Text style={[styles.quickActionText, { color: theme.text }]}>
                Add Driver
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/vehicles')}
              style={[
                styles.quickActionBtn,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.border,
                },
              ]}
            >
              <View
                style={[
                  styles.quickActionIconWrap,
                  { backgroundColor: theme.upcomingLight },
                ]}
              >
                <Ionicons name="car-outline" size={16} color={theme.upcoming} />
              </View>
              <Text style={[styles.quickActionText, { color: theme.text }]}>
                Add Vehicle
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* NEXT UP Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
              NEXT UP
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/trips')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={[styles.viewAllText, { color: theme.accent }]}>
                View all
              </Text>
            </TouchableOpacity>
          </View>

          {nextUpTrips.map((trip) => {
            const needsDriver = trip.status === 'Needs Attention' && !trip.driverId;

            return (
              <TouchableOpacity
                key={trip.id}
                activeOpacity={0.7}
                onPress={() => handleTripCardPress(trip)}
                style={[
                  styles.tripCard,
                  {
                    backgroundColor: theme.cardBackground,
                    borderColor: needsDriver ? theme.warningBorder : theme.border,
                  },
                ]}
              >
                <View style={styles.tripCardTop}>
                  <Text style={[styles.tripTime, { color: theme.text }]}>
                    {trip.scheduledTime}
                  </Text>
                  <Badge
                    status={needsDriver ? 'Driver required' : trip.status}
                    size="sm"
                  />
                </View>

                <Text style={[styles.tripRoute, { color: theme.text }]}>
                  {trip.routeSummary}
                </Text>

                <View style={styles.tripMetaRow}>
                  <Text style={[styles.tripPassengerText, { color: theme.textSecondary }]}>
                    {trip.passengerCount} passengers
                  </Text>
                  <Text style={[styles.tripMetaDot, { color: theme.textMuted }]}>
                    •
                  </Text>
                  <Text
                    style={[
                      styles.tripDriverText,
                      {
                        color: needsDriver ? theme.warning : theme.textSecondary,
                        fontWeight: needsDriver ? '600' : '400',
                      },
                    ]}
                  >
                    {needsDriver
                      ? 'Driver required'
                      : `${trip.driverName} • ${trip.vehicleModel}`}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
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
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.weights.bold,
    letterSpacing: -0.3,
  },
  dateText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.medium,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
  },
  avatarButton: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: Typography.weights.bold,
    fontSize: Typography.fontSizes.sm,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.xxl,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.8,
    marginBottom: Spacing.xs + 2,
  },
  viewAllText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  liveStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    ...Shadows.subtle,
  },
  liveCol: {
    alignItems: 'center',
    flex: 1,
  },
  liveValue: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: Typography.weights.bold,
    letterSpacing: -0.5,
  },
  liveLabel: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.medium,
    marginTop: 2,
  },
  liveDivider: {
    width: 1,
    height: 28,
  },
  emptyAttentionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  emptyAttentionText: {
    fontSize: Typography.fontSizes.sm,
    flex: 1,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  quickActionBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xs,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    ...Shadows.subtle,
  },
  quickActionIconWrap: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  quickActionText: {
    fontSize: Typography.fontSizes.xs + 1,
    fontWeight: Typography.weights.semibold,
    textAlign: 'center',
  },
  tripCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
    ...Shadows.subtle,
  },
  tripCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  tripTime: {
    fontSize: Typography.fontSizes.base,
    fontWeight: Typography.weights.bold,
  },
  tripRoute: {
    fontSize: Typography.fontSizes.base,
    fontWeight: Typography.weights.semibold,
    marginBottom: 6,
  },
  tripMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  tripPassengerText: {
    fontSize: Typography.fontSizes.xs + 1,
  },
  tripMetaDot: {
    marginHorizontal: 6,
    fontSize: Typography.fontSizes.xs,
  },
  tripDriverText: {
    fontSize: Typography.fontSizes.xs + 1,
  },
});
