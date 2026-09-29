import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { AppSafeAreaView } from '@/components/ui/AppSafeAreaView';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Typography, BorderRadius, Shadows, Gradient } from '@/constants/theme';
import { useApp } from '../../context/AppContext';
import { SectionHeader, StatusBadge } from '../../components/ui/AppStates';

export default function DriverDashboardScreen() {
  const router = useRouter();
  const { activeRide, routes, employee, themeColors } = useApp();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const totalPassengers = routes.reduce((sum, r) => sum + r.occupiedSeats, 0);

  return (
    <AppSafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Premium Header ── */}
        <View style={styles.headerBar}>
          <View style={styles.headerLeft}>
            <View
              style={[
                styles.avatar,
                { backgroundColor: themeColors.secondary, borderColor: themeColors.primary },
              ]}
            >
              <Text style={styles.avatarText}>{employee?.name?.charAt(0) || 'D'}</Text>
            </View>
            <View style={styles.headerTextGroup}>
              <Text style={[styles.greeting, { color: themeColors.textSecondary }]}>
                {getGreeting()}, {employee?.name?.split(' ')[0] || 'Driver'}
              </Text>
              <Text style={[styles.headerTitle, { color: themeColors.text }]}>Dashboard</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.sosBtn, { backgroundColor: themeColors.dangerLight, borderColor: themeColors.danger }]}
            onPress={() => router.push('/sos')}
            activeOpacity={0.7}
          >
            <Ionicons name="alert-circle" size={16} color={themeColors.danger} />
            <Text style={[styles.sosText, { color: themeColors.danger }]}>SOS</Text>
          </TouchableOpacity>
        </View>

        {/* ── Current Trip Hero ── */}
        <View style={[styles.heroCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }, Shadows.card]}>
          <View style={styles.heroHeader}>
            <Text style={[styles.heroLabel, { color: themeColors.textMuted }]}>CURRENT TRIP</Text>
            {activeRide ? (
              <StatusBadge status={activeRide.status} size="sm" />
            ) : (
              <View style={[styles.availablePill, { backgroundColor: themeColors.availableLight, borderColor: themeColors.availableBorder }]}>
                <View style={[styles.availableDot, { backgroundColor: themeColors.available }]} />
                <Text style={[styles.availableText, { color: themeColors.available }]}>Available</Text>
              </View>
            )}
          </View>

          {activeRide ? (
            <>
              {/* Route Visualization */}
              <View style={styles.routeViz}>
                <View style={styles.routeVizLine}>
                  <View style={[styles.routeVizDot, { backgroundColor: themeColors.primary }]} />
                  <View style={[styles.routeVizBar, { backgroundColor: themeColors.border }]} />
                  <Ionicons name="navigate" size={14} color={themeColors.primary} />
                  <View style={[styles.routeVizBar, { backgroundColor: themeColors.border }]} />
                  <View style={[styles.routeVizDot, { backgroundColor: themeColors.danger }]} />
                </View>
                <View style={styles.routeVizLabels}>
                  <Text style={[styles.routeVizLabel, { color: themeColors.textSecondary }]}>START</Text>
                  <Text style={[styles.routeVizLabel, { color: themeColors.textSecondary }]}>END</Text>
                </View>
              </View>

              <Text style={[styles.heroRouteName, { color: themeColors.text }]}>
                {activeRide.route?.name || 'Route 36'}
              </Text>
              <Text style={[styles.heroRoutePoints, { color: themeColors.textSecondary }]}>
                {activeRide.pickup.name} → {activeRide.drop.name}
              </Text>

              {/* Metadata row */}
              <View style={styles.heroMetaRow}>
                <View style={[styles.heroMetaChip, { backgroundColor: themeColors.backgroundElement }]}>
                  <Ionicons name="time-outline" size={13} color={themeColors.textMuted} />
                  <Text style={[styles.heroMetaText, { color: themeColors.textSecondary }]}>{activeRide.time}</Text>
                </View>
                <View style={[styles.heroMetaChip, { backgroundColor: themeColors.backgroundElement }]}>
                  <Ionicons name="car-sport-outline" size={13} color={themeColors.textMuted} />
                  <Text style={[styles.heroMetaText, { color: themeColors.textSecondary }]}>
                    {activeRide.vehicle?.vehicleNumber}
                  </Text>
                </View>
                <View style={[styles.heroMetaChip, { backgroundColor: themeColors.primaryLight }]}>
                  <Ionicons name="navigate" size={13} color={themeColors.primary} />
                  <Text style={[styles.heroMetaText, { color: themeColors.primary, fontWeight: Typography.weights.semibold as any }]}>
                    ETA {activeRide.eta}
                  </Text>
                </View>
              </View>
            </>
          ) : (
            <View style={styles.idleState}>
              <Ionicons name="car-outline" size={40} color={themeColors.textMuted} />
              <Text style={[styles.idleTitle, { color: themeColors.text }]}>No Active Trip</Text>
              <Text style={[styles.idleDesc, { color: themeColors.textSecondary }]}>
                {"You're"} currently available. Your next assigned route will appear here.
              </Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.heroActions}>
            <TouchableOpacity
              style={[styles.ctaPrimary, { backgroundColor: themeColors.primary }]}
              onPress={() => router.push('/(driver)/active-trip')}
              activeOpacity={0.7}
            >
              <Ionicons name="navigate" size={16} color="#FFF" />
              <Text style={styles.ctaPrimaryText}>Active Trip</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.ctaSecondary, { backgroundColor: themeColors.backgroundElement, borderColor: themeColors.border }]}
              onPress={() => router.push('/(driver)/trips')}
              activeOpacity={0.7}
            >
              <Ionicons name="calendar-outline" size={16} color={themeColors.textSecondary} />
              <Text style={[styles.ctaSecondaryText, { color: themeColors.textSecondary }]}>My Trips</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Today's Overview ── */}
        <View>
          <SectionHeader title="Today's Overview" />
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }, Shadows.subtle]}>
              <View style={[styles.statIcon, { backgroundColor: themeColors.primaryLight }]}>
                <Ionicons name="map-outline" size={18} color={themeColors.primary} />
              </View>
              <Text style={[styles.statValue, { color: themeColors.primary }]}>3</Text>
              <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Trips Today</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }, Shadows.subtle]}>
              <View style={[styles.statIcon, { backgroundColor: themeColors.accentLight }]}>
                <Ionicons name="people-outline" size={18} color={themeColors.accent} />
              </View>
              <Text style={[styles.statValue, { color: themeColors.accent }]}>{totalPassengers || 42}</Text>
              <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Passengers</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }, Shadows.subtle]}>
              <View style={[styles.statIcon, { backgroundColor: themeColors.warningLight }]}>
                <Ionicons name="checkmark-circle-outline" size={18} color={themeColors.warning} />
              </View>
              <Text style={[styles.statValue, { color: themeColors.warning }]}>98%</Text>
              <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>On-Time</Text>
            </View>
          </View>
        </View>

        {/* ── Manage ── */}
        <View>
          <SectionHeader title="Manage" />
          <View style={styles.manageGrid}>
            <TouchableOpacity
              onPress={() => router.push('/(driver)/routes')}
              style={[styles.manageCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }, Shadows.subtle]}
              activeOpacity={0.7}
            >
              <View style={[styles.manageIcon, { backgroundColor: themeColors.secondaryLight }]}>
                <Ionicons name="map" size={24} color={themeColors.secondary} />
              </View>
              <Text style={[styles.manageTitle, { color: themeColors.text }]}>Routes</Text>
              <Text style={[styles.manageSub, { color: themeColors.textSecondary }]}>{routes.length} assigned</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/(driver)/passengers')}
              style={[styles.manageCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }, Shadows.subtle]}
              activeOpacity={0.7}
            >
              <View style={[styles.manageIcon, { backgroundColor: themeColors.accentLight }]}>
                <Ionicons name="people" size={24} color={themeColors.accent} />
              </View>
              <Text style={[styles.manageTitle, { color: themeColors.text }]}>Passengers</Text>
              <Text style={[styles.manageSub, { color: themeColors.textSecondary }]}>Manage boarding</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Assigned Routes ── */}
        {routes.length > 0 && (
          <View>
            <SectionHeader title="Assigned Routes" action="See all" onAction={() => router.push('/(driver)/routes')} />
            {routes.slice(0, 3).map((r) => (
              <TouchableOpacity
                key={r.id}
                onPress={() => router.push('/(driver)/routes')}
                style={[styles.routeCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }, Shadows.subtle]}
                activeOpacity={0.7}
              >
                <View style={[styles.routeCardIcon, { backgroundColor: themeColors.secondaryLight }]}>
                  <Ionicons name="map" size={18} color={themeColors.secondary} />
                </View>
                <View style={styles.routeCardInfo}>
                  <Text style={[styles.routeCardName, { color: themeColors.text }]}>{r.name}</Text>
                  <Text style={[styles.routeCardRoute, { color: themeColors.textSecondary }]}>
                    {r.startingPoint} → {r.destination} · {r.distance} km
                  </Text>
                </View>
                <View style={styles.routeCardSeats}>
                  <Ionicons name="person-outline" size={12} color={themeColors.textMuted} />
                  <Text style={[styles.routeCardSeatsText, { color: themeColors.textSecondary }]}>
                    {r.occupiedSeats}/{r.capacity}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 20, paddingBottom: 40 },

  /* ── Header ── */
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerTextGroup: { gap: 1 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.weights.bold as any,
  },
  greeting: { fontSize: Typography.fontSizes.xs },
  headerTitle: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.weights.bold as any,
  },
  sosBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    gap: 4,
  },
  sosText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.bold as any,
  },

  /* ── Hero Card ── */
  heroCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: 20,
    marginBottom: 20,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroLabel: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.bold as any,
    letterSpacing: 1.5,
  },
  availablePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    gap: 6,
  },
  availableDot: { width: 6, height: 6, borderRadius: 3 },
  availableText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.semibold as any,
  },

  /* Route Visualization */
  routeViz: { marginBottom: 16 },
  routeVizLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  routeVizDot: { width: 10, height: 10, borderRadius: 5 },
  routeVizBar: { flex: 1, height: 2, marginHorizontal: 4 },
  routeVizLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  routeVizLabel: {
    fontSize: 10,
    fontWeight: Typography.weights.semibold as any,
    letterSpacing: 1,
  },
  heroRouteName: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.weights.bold as any,
    marginBottom: 4,
  },
  heroRoutePoints: {
    fontSize: Typography.fontSizes.sm,
    marginBottom: 14,
  },
  heroMetaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  heroMetaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
    gap: 4,
  },
  heroMetaText: { fontSize: Typography.fontSizes.xs },

  /* Idle State */
  idleState: {
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 14,
  },
  idleTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.semibold as any,
    marginTop: 10,
    marginBottom: 4,
  },
  idleDesc: {
    fontSize: Typography.fontSizes.sm,
    textAlign: 'center',
    lineHeight: 18,
  },

  /* Actions */
  heroActions: { flexDirection: 'row', gap: 10 },
  ctaPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: BorderRadius.md,
    gap: 6,
  },
  ctaPrimaryText: {
    color: '#FFF',
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold as any,
  },
  ctaSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 6,
  },
  ctaSecondaryText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold as any,
  },

  /* ── Stats ── */
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 14,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  statIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: Typography.weights.bold as any,
    letterSpacing: -1,
  },
  statLabel: {
    fontSize: Typography.fontSizes.xs,
    marginTop: 2,
    textAlign: 'center',
  },

  /* ── Manage ── */
  manageGrid: { flexDirection: 'row', gap: 10, marginBottom: 4 },
  manageCard: {
    flex: 1,
    alignItems: 'flex-start',
    padding: 18,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  manageIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  manageTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.semibold as any,
    marginBottom: 2,
  },
  manageSub: { fontSize: Typography.fontSizes.xs },

  /* ── Route Cards ── */
  routeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: 10,
  },
  routeCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  routeCardInfo: { flex: 1 },
  routeCardName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.semibold as any,
    marginBottom: 2,
  },
  routeCardRoute: { fontSize: Typography.fontSizes.sm },
  routeCardSeats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  routeCardSeatsText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold as any,
  },
});
