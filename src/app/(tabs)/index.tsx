import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Animated,
  Easing,
} from 'react-native';
import { AppSafeAreaView } from '@/components/ui/AppSafeAreaView';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../../context/AppContext';
import { Typography, BorderRadius, Shadows, Gradient, Animation } from '../../constants/theme';

export default function HomeScreen() {
  const router = useRouter();
  const { employee, activeRide, rides, refreshRides, themeColors, unreadNotificationCount, isDarkMode, toggleDarkMode } =
    useApp();
  const [refreshing, setRefreshing] = useState(false);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const dotAnims = useRef([new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    pulse.start();

    const dots = dotAnims.map((anim, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 300),
          Animated.timing(anim, { toValue: 1, duration: 600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ])
      )
    );
    dots.forEach((d) => d.start());

    return () => {
      pulse.stop();
      dots.forEach((d) => d.stop());
    };
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshRides();
    setRefreshing(false);
  };

  const upcomingScheduled = rides.find((r) => r.status === 'SCHEDULED');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const activeRoutesCount = rides.filter((r) => r.status === 'IN_TRANSIT').length || 3;
  const vehiclesInTransit = rides.filter((r) => r.status === 'IN_TRANSIT').length || 5;
  const onTimeRate = 94.2;

  const stats = [
    { label: 'Active Routes', value: activeRoutesCount, trend: '+12%', up: true },
    { label: 'Vehicles in Transit', value: vehiclesInTransit, trend: '+8%', up: true },
    { label: 'On-Time Rate', value: `${onTimeRate}%`, trend: '+2.1%', up: true },
  ];

  const getStatusConfig = () => {
    if (activeRide) return { label: 'In Transit', bg: themeColors.onTripLight, dot: themeColors.onTrip, border: themeColors.onTripBorder };
    if (upcomingScheduled) return { label: 'Scheduled', bg: themeColors.assignedLight, dot: themeColors.assigned, border: themeColors.assignedBorder };
    return { label: 'Available', bg: themeColors.availableLight, dot: themeColors.available, border: themeColors.availableBorder };
  };
  const statusConfig = getStatusConfig();

  const getTripData = () => {
    if (activeRide) return activeRide;
    if (upcomingScheduled) return upcomingScheduled;
    return null;
  };
  const tripData = getTripData();

  return (
    <AppSafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Command Center Header ─── */}
        <View style={styles.headerBar}>
          <View style={styles.userCol}>
            <View style={styles.avatarWrap}>
              <View style={[styles.avatar, { backgroundColor: themeColors.primary, borderColor: themeColors.primary }]}>
                <Text style={[styles.avatarText, { color: themeColors.textInverse }]}>
                  {employee?.name?.charAt(0) || 'U'}
                </Text>
              </View>
              <View style={[styles.avatarGlow, { borderColor: themeColors.secondary }]} />
            </View>
            <View style={{ marginLeft: 12 }}>
              <Text style={[styles.greeting, { color: themeColors.textSecondary }]}>{getGreeting()}</Text>
              <Text style={[styles.userName, { color: themeColors.text }]}>{employee?.name || 'Operator'}</Text>
            </View>
          </View>

          <View style={styles.headerIcons}>
            <View style={[styles.liveIndicator, { backgroundColor: themeColors.onTripLight, borderColor: themeColors.onTripBorder }]}>
              <Animated.View style={[styles.liveDot, { backgroundColor: themeColors.onTrip, transform: [{ scale: pulseAnim }] }]} />
              <Text style={[styles.liveText, { color: themeColors.onTrip }]}>LIVE</Text>
            </View>

            <TouchableOpacity
              style={[styles.iconBtn, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}
              onPress={() => router.push('/(tabs)/notifications')}
              activeOpacity={0.7}
            >
              <Ionicons name="notifications-outline" size={20} color={themeColors.text} />
              {unreadNotificationCount > 0 && (
                <View style={[styles.notifBadge, { backgroundColor: themeColors.danger }]}>
                  <Text style={[styles.notifBadgeText, { color: themeColors.textInverse }]}>{unreadNotificationCount}</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sosHeaderBtn, { backgroundColor: themeColors.dangerLight, borderColor: themeColors.dangerBorder }]}
              onPress={() => router.push('/sos')}
              activeOpacity={0.7}
            >
              <Ionicons name="alert-circle" size={16} color={themeColors.danger} />
              <Text style={[styles.sosHeaderText, { color: themeColors.danger }]}>SOS</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── Hero Section: "Your network is moving." ─── */}
        <View style={[styles.heroSection, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }, Shadows.card]}>
          <Text style={[styles.heroTagline, { color: themeColors.textSecondary }]}>Your network is moving.</Text>
          <View style={styles.statsRow}>
            {stats.map((stat, i) => (
              <View key={i} style={[styles.statBlock, i < 2 && { borderRightWidth: 1, borderRightColor: themeColors.border }]}>
                <Text style={[styles.statValue, { color: themeColors.text }]}>{stat.value}</Text>
                <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>{stat.label}</Text>
                <View style={styles.trendRow}>
                  <Ionicons
                    name={stat.up ? 'arrow-up' : 'arrow-down'}
                    size={12}
                    color={stat.up ? themeColors.accent : themeColors.danger}
                  />
                  <Text style={[styles.trendText, { color: stat.up ? themeColors.accent : themeColors.danger }]}>{stat.trend}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ─── Today's Trip Card ─── */}
        {tripData ? (
          <View style={[styles.tripCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }, Shadows.card]}>
            <View style={styles.tripCardHeader}>
              <Text style={[styles.tripCardTitle, { color: themeColors.text }]}>
                {activeRide ? "Today's Trip" : 'Upcoming Trip'}
              </Text>
              <View style={[styles.statusPill, { backgroundColor: statusConfig.bg, borderColor: statusConfig.border, borderWidth: 1 }]}>
                <View style={[styles.statusDot, { backgroundColor: statusConfig.dot }]} />
                <Text style={[styles.statusText, { color: statusConfig.dot }]}>{statusConfig.label}</Text>
              </View>
            </View>

            {/* Route Visualization */}
            <View style={styles.routeVis}>
              <View style={styles.routeNode}>
                <View style={[styles.routeDot, { backgroundColor: themeColors.primary }]} />
                <Text style={[styles.routeDotLabel, { color: themeColors.textSecondary }]}>START</Text>
              </View>
              <View style={[styles.routeLineOuter, { backgroundColor: themeColors.border }]}>
                <View style={[styles.routeLineInner, { backgroundColor: themeColors.primary, width: activeRide ? '60%' : '0%' }]} />
                {activeRide && (
                  <Animated.View style={[styles.vehicleMarker, { transform: [{ scale: pulseAnim }] }]}>
                    <Ionicons name="bus" size={14} color={themeColors.textInverse} />
                  </Animated.View>
                )}
              </View>
              <View style={styles.routeNode}>
                <View style={[styles.routeDot, { backgroundColor: themeColors.primary }]} />
                <Text style={[styles.routeDotLabel, { color: themeColors.textSecondary }]}>END</Text>
              </View>
            </View>

            {/* Vehicle Info */}
            <View style={[styles.vehicleRow, { borderTopColor: themeColors.border }]}>
              <View style={[styles.vehicleIconWrap, { backgroundColor: themeColors.primaryLight }]}>
                <Ionicons name="car-sport" size={20} color={themeColors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.vehicleName, { color: themeColors.text }]}>
                  {tripData.route?.name || 'Route 36'}
                </Text>
                <Text style={[styles.vehiclePoints, { color: themeColors.textSecondary }]}>
                  {tripData.pickup.name} → {tripData.drop.name}
                </Text>
              </View>
            </View>

            {/* ETA */}
            <View style={[styles.etaBlock, { backgroundColor: themeColors.primaryLight, borderColor: themeColors.primary, borderWidth: 1 }]}>
              <Ionicons name="time" size={18} color={themeColors.primary} />
              <View>
                <Text style={[styles.etaLabel, { color: themeColors.textSecondary }]}>Estimated Arrival</Text>
                <Text style={[styles.etaValue, { color: themeColors.primary }]}>{tripData.eta || tripData.time}</Text>
              </View>
            </View>

            {/* CTA */}
            {activeRide && (
              <TouchableOpacity
                style={[styles.trackBtn, { backgroundColor: themeColors.primary }]}
                onPress={() => router.push('/(tabs)/track')}
                activeOpacity={0.8}
              >
                <Ionicons name="navigate" size={18} color={themeColors.textInverse} />
                <Text style={[styles.trackBtnText, { color: themeColors.textInverse }]}>Track Vehicle</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={[styles.noTripCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }, Shadows.card]}>
            <View style={[styles.noTripIconWrap, { backgroundColor: themeColors.primaryLight }]}>
              <Ionicons name="bus-outline" size={36} color={themeColors.primary} />
            </View>
            <Text style={[styles.noTripTitle, { color: themeColors.text }]}>No Trip Today</Text>
            <Text style={[styles.noTripDesc, { color: themeColors.textSecondary }]}>Book a ride for your next shift</Text>
            <TouchableOpacity
              style={[styles.bookBtn, { backgroundColor: themeColors.primary }]}
              onPress={() => router.push('/book-ride')}
              activeOpacity={0.8}
            >
              <Text style={[styles.bookBtnText, { color: themeColors.textInverse }]}>Book a Ride</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ─── Quick Actions ─── */}
        <View style={styles.quickSection}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Quick Actions</Text>
          <View style={styles.quickGrid}>
            <TouchableOpacity
              style={[styles.gridCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }, Shadows.subtle]}
              onPress={() => router.push('/book-ride')}
              activeOpacity={0.7}
            >
              <View style={[styles.gridIconBg, { backgroundColor: themeColors.primaryLight }]}>
                <Ionicons name="add-circle-outline" size={22} color={themeColors.primary} />
              </View>
              <Text style={[styles.gridTitle, { color: themeColors.text }]}>Book Ride</Text>
              <Text style={[styles.gridSub, { color: themeColors.textSecondary }]}>Request shift cab</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.gridCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }, Shadows.subtle]}
              onPress={() => router.push('/(tabs)/track')}
              activeOpacity={0.7}
            >
              <View style={[styles.gridIconBg, { backgroundColor: themeColors.secondaryLight }]}>
                <Ionicons name="map-outline" size={22} color={themeColors.secondary} />
              </View>
              <Text style={[styles.gridTitle, { color: themeColors.text }]}>Track Live</Text>
              <Text style={[styles.gridSub, { color: themeColors.textSecondary }]}>Realtime GPS</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.gridCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }, Shadows.subtle]}
              onPress={() => router.push('/(tabs)/rides')}
              activeOpacity={0.7}
            >
              <View style={[styles.gridIconBg, { backgroundColor: themeColors.accentLight }]}>
                <Ionicons name="time-outline" size={22} color={themeColors.accent} />
              </View>
              <Text style={[styles.gridTitle, { color: themeColors.text }]}>My Trips</Text>
              <Text style={[styles.gridSub, { color: themeColors.textSecondary }]}>All bookings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.gridCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }, Shadows.subtle]}
              onPress={() => router.push('/help')}
              activeOpacity={0.7}
            >
              <View style={[styles.gridIconBg, { backgroundColor: themeColors.warningLight }]}>
                <Ionicons name="help-buoy-outline" size={22} color={themeColors.warning} />
              </View>
              <Text style={[styles.gridTitle, { color: themeColors.text }]}>Help</Text>
              <Text style={[styles.gridSub, { color: themeColors.textSecondary }]}>Support & FAQs</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 20, paddingBottom: 48 },

  /* ─── Header ─── */
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  userCol: { flexDirection: 'row', alignItems: 'center' },
  avatarWrap: { position: 'relative' },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  avatarGlow: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    top: 0,
    left: 0,
    opacity: 0.25,
  },
  avatarText: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.weights.bold as any,
  },
  greeting: { fontSize: Typography.fontSizes.xs, letterSpacing: 0.3 },
  userName: { fontSize: Typography.fontSizes.lg, fontWeight: Typography.weights.bold as any, letterSpacing: -0.3 },
  headerIcons: { flexDirection: 'row', alignItems: 'center', gap: 8 },

  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    gap: 6,
    borderWidth: 1,
  },
  liveDot: { width: 7, height: 7, borderRadius: 4 },
  liveText: { fontSize: 10, fontWeight: Typography.weights.bold as any, letterSpacing: 1 },

  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notifBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifBadgeText: { fontSize: 10, fontWeight: '700' },

  sosHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    gap: 4,
  },
  sosHeaderText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.bold as any,
  },

  /* ─── Hero Stats ─── */
  heroSection: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
  },
  heroTagline: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.medium as any,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
  },
  statBlock: {
    flex: 1,
    alignItems: 'center',
    paddingRight: 12,
  },
  statValue: {
    fontSize: Typography.fontSizes.hero,
    fontWeight: Typography.weights.bold as any,
    letterSpacing: -0.8,
    lineHeight: 42,
  },
  statLabel: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.medium as any,
    marginTop: 2,
    textAlign: 'center',
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 6,
  },
  trendText: {
    fontSize: 11,
    fontWeight: Typography.weights.semibold as any,
  },

  /* ─── Trip Card ─── */
  tripCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
  },
  tripCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tripCardTitle: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.weights.bold as any,
    letterSpacing: -0.3,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    gap: 6,
  },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.semibold as any,
  },

  /* ─── Route Visualization ─── */
  routeVis: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  routeNode: {
    alignItems: 'center',
    width: 40,
  },
  routeDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  routeDotLabel: {
    fontSize: 9,
    fontWeight: Typography.weights.semibold as any,
    letterSpacing: 0.8,
    marginTop: 6,
  },
  routeLineOuter: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 6,
    position: 'relative',
    overflow: 'visible',
  },
  routeLineInner: {
    height: '100%',
    borderRadius: 2,
  },
  vehicleMarker: {
    position: 'absolute',
    top: -10,
    left: '50%',
    marginLeft: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },

  /* ─── Vehicle Row ─── */
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    marginBottom: 14,
  },
  vehicleIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  vehicleName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.semibold as any,
    marginBottom: 2,
  },
  vehiclePoints: { fontSize: Typography.fontSizes.sm },

  /* ─── ETA Block ─── */
  etaBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: BorderRadius.md,
    gap: 12,
    marginBottom: 16,
  },
  etaLabel: { fontSize: Typography.fontSizes.xs },
  etaValue: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.weights.bold as any,
    letterSpacing: -0.3,
  },

  /* ─── Track Button ─── */
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: BorderRadius.lg,
    gap: 8,
  },
  trackBtnText: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.semibold as any,
  },

  /* ─── No Trip Card ─── */
  noTripCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: 28,
    alignItems: 'center',
    marginBottom: 16,
  },
  noTripIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  noTripTitle: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.weights.semibold as any,
    marginBottom: 4,
  },
  noTripDesc: {
    fontSize: Typography.fontSizes.sm,
    marginBottom: 20,
  },
  bookBtn: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: BorderRadius.lg,
  },
  bookBtnText: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.semibold as any,
  },

  /* ─── Quick Actions ─── */
  quickSection: {
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.weights.bold as any,
    marginBottom: 14,
    letterSpacing: -0.2,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridCard: {
    width: '48%',
    padding: 18,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: 12,
  },
  gridIconBg: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  gridTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.semibold as any,
    letterSpacing: -0.2,
  },
  gridSub: {
    fontSize: Typography.fontSizes.xs,
    marginTop: 3,
  },
});
