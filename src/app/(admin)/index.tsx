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
      router.push('/(admin)/people');
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

      {/* Premium Header */}
      <View
        style={[
          styles.headerCard,
          {
            backgroundColor: theme.cardBackground,
            borderColor: theme.border,
            ...Shadows.medium,
          },
        ]}
      >
        <View style={styles.headerLeft}>
          <Text style={[styles.greeting, { color: theme.textSecondary }]}>
            Good morning
          </Text>
          <Text style={[styles.userName, { color: theme.text }]}>
            {user?.name || 'Govind'}
          </Text>
          <Text style={[styles.dateText, { color: theme.textSecondary }]}>
            Thursday, 4 September
          </Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push('/notifications')}
            style={[styles.iconButton, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}
          >
            <Ionicons name="notifications-outline" size={20} color={theme.text} />
            {unresolvedAlerts.length > 0 && (
              <View
                style={[
                  styles.notificationBadge,
                  { backgroundColor: '#EF4444' },
                ]}
              >
                <Text style={styles.notificationBadgeText}>
                  {unresolvedAlerts.length}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push('/(admin)/more')}
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
        {/* LIVE NOW Hero Section */}
        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: theme.cardBackground,
              borderColor: theme.border,
              ...Shadows.small,
            },
          ]}
        >
          <View style={styles.heroCol}>
            <Text style={[styles.heroValue, { color: '#2563EB' }]}>
              {kpis.ongoingTrips}
            </Text>
            <Text style={[styles.heroLabel, { color: theme.textSecondary }]}>
              Ongoing
            </Text>
          </View>
          <View style={[styles.heroDivider, { backgroundColor: theme.border }]} />
          <View style={styles.heroCol}>
            <Text style={[styles.heroValue, { color: '#4F46E5' }]}>
              {kpis.upcomingTrips}
            </Text>
            <Text style={[styles.heroLabel, { color: theme.textSecondary }]}>
              Upcoming
            </Text>
          </View>
          <View style={[styles.heroDivider, { backgroundColor: theme.border }]} />
          <View style={styles.heroCol}>
            <Text style={[styles.heroValue, { color: '#10B981' }]}>
              {kpis.completedTrips}
            </Text>
            <Text style={[styles.heroLabel, { color: theme.textSecondary }]}>
              Completed
            </Text>
          </View>
        </View>

        {/* TODAY Metrics */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            TODAY
          </Text>
          <View style={styles.metricsRow}>
            <StatCard
              label="Trips"
              value={kpis.totalTripsToday}
              onPress={() => router.push('/(admin)/trips')}
            />
            <StatCard
              label="Drivers"
              value={kpis.totalDrivers}
              onPress={() => router.push('/(admin)/people')}
            />
            <StatCard
              label="Vehicles"
              value={kpis.totalVehicles}
              onPress={() => router.push('/vehicles')}
            />
          </View>
        </View>

        {/* NEEDS ATTENTION */}
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
              <Ionicons name="checkmark-circle" size={22} color="#10B981" />
              <Text style={[styles.emptyAttentionText, { color: theme.textSecondary }]}>
                All operations running smoothly
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

        {/* QUICK ACTIONS */}
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
                  ...Shadows.subtle,
                },
              ]}
            >
              <View
                style={[
                  styles.quickActionIconWrap,
                  { backgroundColor: '#EFF6FF' },
                ]}
              >
                <Ionicons name="add-circle-outline" size={20} color="#2563EB" />
              </View>
              <Text style={[styles.quickActionLabel, { color: theme.text }]}>
                Create Trip
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/(admin)/people')}
              style={[
                styles.quickActionBtn,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.border,
                  ...Shadows.subtle,
                },
              ]}
            >
              <View
                style={[
                  styles.quickActionIconWrap,
                  { backgroundColor: '#F0FDF4' },
                ]}
              >
                <Ionicons name="person-add-outline" size={18} color="#10B981" />
              </View>
              <Text style={[styles.quickActionLabel, { color: theme.text }]}>
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
                  ...Shadows.subtle,
                },
              ]}
            >
              <View
                style={[
                  styles.quickActionIconWrap,
                  { backgroundColor: '#EEF2FF' },
                ]}
              >
                <Ionicons name="car-outline" size={18} color="#4F46E5" />
              </View>
              <Text style={[styles.quickActionLabel, { color: theme.text }]}>
                Add Vehicle
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* NEXT UP */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
              NEXT UP
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(admin)/trips')}
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
                    borderColor: needsDriver ? '#FEE2E2' : theme.border,
                    ...Shadows.subtle,
                  },
                ]}
              >
                <View style={styles.tripCardTop}>
                  <View style={styles.tripTimeRow}>
                    <Ionicons name="time-outline" size={14} color={theme.textSecondary} />
                    <Text style={[styles.tripTime, { color: theme.text }]}>
                      {trip.scheduledTime}
                    </Text>
                  </View>
                  <Badge
                    status={needsDriver ? 'Driver required' : trip.status}
                    size="sm"
                  />
                </View>

                <Text style={[styles.tripRoute, { color: theme.text }]}>
                  {trip.routeSummary}
                </Text>

                <View style={styles.tripMetaRow}>
                  <Ionicons name="people-outline" size={12} color={theme.textSecondary} />
                  <Text style={[styles.tripPassengerText, { color: theme.textSecondary }]}>
                    {trip.passengerCount}
                  </Text>
                  <Text style={[styles.tripMetaDot, { color: theme.textMuted }]}>
                    ·
                  </Text>
                  <Ionicons
                    name={needsDriver ? 'alert-circle-outline' : 'checkmark-circle-outline'}
                    size={12}
                    color={needsDriver ? '#EF4444' : '#10B981'}
                  />
                  <Text
                    style={[
                      styles.tripDriverText,
                      {
                        color: needsDriver ? '#EF4444' : theme.textSecondary,
                        fontWeight: needsDriver ? '600' : '400',
                      },
                    ]}
                  >
                    {needsDriver
                      ? 'Driver required'
                      : `${trip.driverName} · ${trip.vehicleModel}`}
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
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: Spacing.base,
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.medium,
    marginBottom: 2,
  },
  userName: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.weights.bold,
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  dateText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.medium,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: Typography.weights.bold,
  },
  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: Typography.weights.bold,
    fontSize: Typography.fontSizes.base,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.xxl,
  },
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.base,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  heroCol: {
    alignItems: 'center',
    flex: 1,
  },
  heroValue: {
    fontSize: 30,
    fontWeight: Typography.weights.bold,
    letterSpacing: -1.5,
  },
  heroLabel: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.medium,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroDivider: {
    width: 1,
    height: 36,
    opacity: 0.3,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm + 2,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  viewAllText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  emptyAttentionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.base + 4,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  emptyAttentionText: {
    fontSize: Typography.fontSizes.sm,
    flex: 1,
    fontWeight: Typography.weights.medium,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  quickActionBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.base + 4,
    paddingHorizontal: Spacing.xs,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  quickActionIconWrap: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.semibold,
    textAlign: 'center',
  },
  tripCard: {
    padding: Spacing.base,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  tripCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  tripTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tripTime: {
    fontSize: Typography.fontSizes.base,
    fontWeight: Typography.weights.bold,
  },
  tripRoute: {
    fontSize: Typography.fontSizes.base,
    fontWeight: Typography.weights.semibold,
    marginBottom: 8,
    lineHeight: 20,
  },
  tripMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
  },
  tripPassengerText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.medium,
  },
  tripMetaDot: {
    marginHorizontal: 2,
    fontSize: Typography.fontSizes.xs,
  },
  tripDriverText: {
    fontSize: Typography.fontSizes.xs,
    marginLeft: 2,
  },
});
