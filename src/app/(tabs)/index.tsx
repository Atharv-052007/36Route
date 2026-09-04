import React, { useState, useEffect } from 'react';
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
import { useApp } from '../../context/AppContext';
import { Typography, BorderRadius, Shadows } from '../../constants/theme';
import { RideCard, DriverCard } from '../../components/ui/RideCards';
import { SectionHeader, EmptyState } from '../../components/ui/AppStates';
import Animated, {
  FadeInUp,
  FadeInDown,
  FadeIn,
  SlideInRight,
  Layout,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

function AnimatedGridCard({ children, delay, onPress, style }: {
  children: React.ReactNode;
  delay: number;
  onPress: () => void;
  style?: any;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeInUp.delay(delay).duration(400).springify()} style={[style, animStyle]}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        onPressIn={() => { scale.value = withSpring(0.96, { damping: 15, stiffness: 400 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 15, stiffness: 400 }); }}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { employee, activeRide, rides, refreshRides, themeColors, unreadNotificationCount, isDarkMode, toggleDarkMode } =
    useApp();
  const [refreshing, setRefreshing] = useState(false);
  const headerGlow = useSharedValue(0);

  useEffect(() => {
    headerGlow.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 2000 }),
        withTiming(0, { duration: 2000 })
      ),
      -1,
      false
    );
  }, []);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: headerGlow.value,
  }));

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

  return (
    <AppSafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Bar with Animation */}
        <Animated.View entering={FadeInDown.duration(500)} style={styles.headerBar}>
          <View style={styles.userCol}>
            <Animated.View style={styles.avatarWrap}>
              <View style={[styles.avatar, { backgroundColor: themeColors.secondary }]}>
                <Text style={styles.avatarText}>
                  {employee?.name?.charAt(0) || 'U'}
                </Text>
              </View>
              <Animated.View style={[styles.avatarGlow, { backgroundColor: themeColors.secondary }, glowStyle]} />
            </Animated.View>
            <View style={{ marginLeft: 12 }}>
              <Text style={[styles.greeting, { color: themeColors.textSecondary }]}>
                {getGreeting()} 👋
              </Text>
              <Text style={[styles.userName, { color: themeColors.text }]}>{employee?.name}</Text>
            </View>
          </View>

          <View style={styles.headerIcons}>
            <TouchableOpacity
              style={[
                styles.iconBtn,
                { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border },
              ]}
              onPress={toggleDarkMode}
              activeOpacity={0.7}
            >
              <Ionicons name={isDarkMode ? 'sunny-outline' : 'moon-outline'} size={22} color={themeColors.text} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.iconBtn,
                { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border },
              ]}
              onPress={() => router.push('/(tabs)/notifications')}
            >
              <Ionicons name="notifications-outline" size={22} color={themeColors.text} />
              {unreadNotificationCount > 0 && (
                <View style={[styles.notifBadge, { backgroundColor: themeColors.danger }]}>
                  <Text style={styles.notifBadgeText}>{unreadNotificationCount}</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.sosHeaderBtn,
                { backgroundColor: themeColors.dangerLight },
              ]}
              onPress={() => router.push('/sos')}
            >
              <Ionicons name="alert-circle" size={18} color={themeColors.danger} />
              <Text style={[styles.sosHeaderText, { color: themeColors.danger }]}>SOS</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Today's Trip Card */}
        {activeRide ? (
          <Animated.View entering={SlideInRight.delay(200).duration(500).springify()} style={[styles.todayTripCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }, Shadows.small]}>
            <View style={styles.tripCardHeader}>
              <Text style={[styles.tripCardTitle, { color: themeColors.text }]}>Today's Trip</Text>
              <View style={[styles.tripStatusPill, { backgroundColor: themeColors.onTripLight }]}>
                <View style={[styles.tripStatusDot, { backgroundColor: themeColors.onTrip }]} />
                <Text style={[styles.tripStatusText, { color: themeColors.onTrip }]}>In Transit</Text>
              </View>
            </View>

            <View style={styles.tripRouteRow}>
              <View style={[styles.tripRouteIcon, { backgroundColor: themeColors.secondaryLight }]}>
                <Ionicons name="bus" size={20} color={themeColors.secondary} />
              </View>
              <View style={styles.tripRouteInfo}>
                <Text style={[styles.tripRouteName, { color: themeColors.text }]}>
                  {activeRide.route?.name || 'Route 36'}
                </Text>
                <Text style={[styles.tripRoutePoints, { color: themeColors.textSecondary }]}>
                  {activeRide.pickup.name} → {activeRide.drop.name}
                </Text>
              </View>
            </View>

            <View style={styles.tripMetaRow}>
              <View style={styles.tripMeta}>
                <Ionicons name="time-outline" size={14} color={themeColors.textMuted} />
                <Text style={[styles.tripMetaText, { color: themeColors.textSecondary }]}>{activeRide.time}</Text>
              </View>
              <View style={styles.tripMeta}>
                <Ionicons name="car-sport-outline" size={14} color={themeColors.textMuted} />
                <Text style={[styles.tripMetaText, { color: themeColors.textSecondary }]}>
                  {activeRide.vehicle?.vehicleNumber}
                </Text>
              </View>
              <View style={styles.tripMeta}>
                <Ionicons name="time" size={14} color={themeColors.secondary} />
                <Text style={[styles.tripMetaText, { color: themeColors.secondary, fontWeight: Typography.weights.semibold as any }]}>
                  ETA: {activeRide.eta}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.trackBtn, { backgroundColor: themeColors.secondary }]}
              onPress={() => router.push('/(tabs)/track')}
              activeOpacity={0.7}
            >
              <Ionicons name="navigate" size={18} color="#FFFFFF" />
              <Text style={styles.trackBtnText}>Track Vehicle</Text>
            </TouchableOpacity>
          </Animated.View>
        ) : upcomingScheduled ? (
          <Animated.View entering={SlideInRight.delay(200).duration(500).springify()} style={[styles.todayTripCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }, Shadows.small]}>
            <View style={styles.tripCardHeader}>
              <Text style={[styles.tripCardTitle, { color: themeColors.text }]}>Upcoming Trip</Text>
              <View style={[styles.tripStatusPill, { backgroundColor: themeColors.secondaryLight }]}>
                <View style={[styles.tripStatusDot, { backgroundColor: themeColors.secondary }]} />
                <Text style={[styles.tripStatusText, { color: themeColors.secondary }]}>Scheduled</Text>
              </View>
            </View>

            <View style={styles.tripRouteRow}>
              <View style={[styles.tripRouteIcon, { backgroundColor: themeColors.secondaryLight }]}>
                <Ionicons name="bus" size={20} color={themeColors.secondary} />
              </View>
              <View style={styles.tripRouteInfo}>
                <Text style={[styles.tripRouteName, { color: themeColors.text }]}>
                  {upcomingScheduled.route?.name || 'Route 36'}
                </Text>
                <Text style={[styles.tripRoutePoints, { color: themeColors.textSecondary }]}>
                  {upcomingScheduled.pickup.name} → {upcomingScheduled.drop.name}
                </Text>
              </View>
            </View>

            <View style={styles.tripMetaRow}>
              <View style={styles.tripMeta}>
                <Ionicons name="time-outline" size={14} color={themeColors.textMuted} />
                <Text style={[styles.tripMetaText, { color: themeColors.textSecondary }]}>{upcomingScheduled.time}</Text>
              </View>
              <View style={styles.tripMeta}>
                <Ionicons name="calendar-outline" size={14} color={themeColors.textMuted} />
                <Text style={[styles.tripMetaText, { color: themeColors.textSecondary }]}>{upcomingScheduled.date}</Text>
              </View>
            </View>
          </Animated.View>
        ) : (
          <Animated.View entering={FadeInUp.delay(200).duration(500).springify()} style={[styles.noTripCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
            <View style={[styles.noTripIcon, { backgroundColor: themeColors.secondaryLight }]}>
              <Ionicons name="bus-outline" size={32} color={themeColors.secondary} />
            </View>
            <Text style={[styles.noTripTitle, { color: themeColors.text }]}>No Trip Today</Text>
            <Text style={[styles.noTripDesc, { color: themeColors.textSecondary }]}>
              Book a ride for your next shift
            </Text>
            <TouchableOpacity
              style={[styles.bookBtn, { backgroundColor: themeColors.secondary }]}
              onPress={() => router.push('/book-ride')}
              activeOpacity={0.7}
            >
              <Text style={styles.bookBtnText}>Book a Ride</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Quick Actions with Staggered Animation */}
        <View style={{ marginTop: 8 }}>
          <Animated.View entering={FadeIn.delay(400).duration(400)}>
            <SectionHeader title="Quick Actions" />
          </Animated.View>
          <View style={styles.quickGrid}>
            <AnimatedGridCard delay={500} onPress={() => router.push('/book-ride')} style={[styles.gridCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
              <View style={[styles.gridIconCircle, { backgroundColor: themeColors.secondaryLight }]}>
                <Ionicons name="add-circle-outline" size={24} color={themeColors.secondary} />
              </View>
              <Text style={[styles.gridTitle, { color: themeColors.text }]}>Book Ride</Text>
              <Text style={[styles.gridSub, { color: themeColors.textSecondary }]}>Request shift cab</Text>
            </AnimatedGridCard>

            <AnimatedGridCard delay={600} onPress={() => router.push('/(tabs)/track')} style={[styles.gridCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
              <View style={[styles.gridIconCircle, { backgroundColor: themeColors.accentLight }]}>
                <Ionicons name="map-outline" size={24} color={themeColors.accent} />
              </View>
              <Text style={[styles.gridTitle, { color: themeColors.text }]}>Track Live</Text>
              <Text style={[styles.gridSub, { color: themeColors.textSecondary }]}>Realtime GPS</Text>
            </AnimatedGridCard>

            <AnimatedGridCard delay={700} onPress={() => router.push('/(tabs)/rides')} style={[styles.gridCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
              <View style={[styles.gridIconCircle, { backgroundColor: themeColors.warningLight }]}>
                <Ionicons name="time-outline" size={24} color={themeColors.warning} />
              </View>
              <Text style={[styles.gridTitle, { color: themeColors.text }]}>My Trips</Text>
              <Text style={[styles.gridSub, { color: themeColors.textSecondary }]}>All bookings</Text>
            </AnimatedGridCard>

            <AnimatedGridCard delay={800} onPress={() => router.push('/help')} style={[styles.gridCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
              <View style={[styles.gridIconCircle, { backgroundColor: themeColors.dangerLight }]}>
                <Ionicons name="help-buoy-outline" size={24} color={themeColors.danger} />
              </View>
              <Text style={[styles.gridTitle, { color: themeColors.text }]}>Help</Text>
              <Text style={[styles.gridSub, { color: themeColors.textSecondary }]}>Support & FAQs</Text>
            </AnimatedGridCard>
          </View>
        </View>
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 18, paddingBottom: 40 },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  userCol: { flexDirection: 'row', alignItems: 'center' },
  avatarWrap: { position: 'relative' },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarGlow: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    top: 0,
    left: 0,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.weights.bold as any,
  },
  greeting: { fontSize: Typography.fontSizes.xs },
  userName: { fontSize: Typography.fontSizes.lg, fontWeight: Typography.weights.bold as any },
  headerIcons: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notifBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifBadgeText: { color: '#FFF', fontSize: 10, fontWeight: '700' },
  sosHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
  },
  sosHeaderText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.bold as any,
    marginLeft: 4,
  },
  // Today's Trip Card
  todayTripCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  tripCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  tripCardTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.weights.bold as any,
  },
  tripStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    gap: 6,
  },
  tripStatusDot: { width: 6, height: 6, borderRadius: 3 },
  tripStatusText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.semibold as any,
  },
  tripRouteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tripRouteIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tripRouteInfo: { flex: 1 },
  tripRouteName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.semibold as any,
    marginBottom: 2,
  },
  tripRoutePoints: { fontSize: Typography.fontSizes.sm },
  tripMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E8E3',
  },
  tripMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  tripMetaText: { fontSize: Typography.fontSizes.sm },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    gap: 8,
  },
  trackBtnText: {
    color: '#FFFFFF',
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.semibold as any,
  },
  // No trip card
  noTripCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  noTripIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  noTripTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.weights.semibold as any,
    marginBottom: 4,
  },
  noTripDesc: {
    fontSize: Typography.fontSizes.sm,
    marginBottom: 16,
  },
  bookBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
  },
  bookBtnText: {
    color: '#FFFFFF',
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.semibold as any,
  },
  // Quick Grid
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridCard: {
    width: '48%',
    padding: 16,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: 12,
  },
  gridIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  gridTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.semibold as any,
  },
  gridSub: {
    fontSize: Typography.fontSizes.xs,
    marginTop: 2,
  },
});
