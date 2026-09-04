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
import { useApp } from '../../context/AppContext';
import { Typography, BorderRadius, Shadows } from '../../constants/theme';
import { SectionHeader, StatusBadge } from '../../components/ui/AppStates';
import Animated, {
  FadeInUp,
  FadeInDown,
  SlideInRight,
} from 'react-native-reanimated';

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
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.headerBar}>
          <View style={styles.headerLeft}>
            <View style={[styles.avatar, { backgroundColor: themeColors.secondary }]}>
              <Text style={styles.avatarText}>{employee?.name?.charAt(0) || 'D'}</Text>
            </View>
            <View>
              <Text style={[styles.greeting, { color: themeColors.textSecondary }]}>
                {getGreeting()}, {employee?.name?.split(' ')[0] || 'Driver'}
              </Text>
              <Text style={[styles.headerTitle, { color: themeColors.text }]}>Dashboard</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.sosBtn, { backgroundColor: themeColors.dangerLight }]}
            onPress={() => router.push('/sos')}
          >
            <Ionicons name="alert-circle" size={18} color={themeColors.danger} />
            <Text style={[styles.sosText, { color: themeColors.danger }]}>SOS</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Active Trip Card */}
        <Animated.View entering={SlideInRight.delay(150).duration(500).springify()} style={[styles.statusCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }, Shadows.small]}>
          <View style={styles.statusCardHeader}>
            <Text style={[styles.statusCardTitle, { color: themeColors.text }]}>Current Trip</Text>
            {activeRide ? (
              <StatusBadge status={activeRide.status} size="sm" />
            ) : (
              <View style={[styles.idlePill, { backgroundColor: themeColors.accentLight }]}>
                <View style={styles.idleDot} />
                <Text style={[styles.idlePillText, { color: themeColors.accent }]}>Available</Text>
              </View>
            )}
          </View>

          {activeRide ? (
            <>
              <View style={styles.routeRow}>
                <View style={[styles.routeIcon, { backgroundColor: themeColors.secondaryLight }]}>
                  <Ionicons name="bus" size={20} color={themeColors.secondary} />
                </View>
                <View style={styles.routeInfo}>
                  <Text style={[styles.routeName, { color: themeColors.text }]}>
                    {activeRide.route?.name || 'Route 36'}
                  </Text>
                  <Text style={[styles.routePoints, { color: themeColors.textSecondary }]}>
                    {activeRide.pickup.name} → {activeRide.drop.name}
                  </Text>
                </View>
              </View>
              <View style={styles.metaRow}>
                <View style={styles.meta}>
                  <Ionicons name="time-outline" size={14} color={themeColors.textMuted} />
                  <Text style={[styles.metaText, { color: themeColors.textSecondary }]}>{activeRide.time}</Text>
                </View>
                <View style={styles.meta}>
                  <Ionicons name="car-sport-outline" size={14} color={themeColors.textMuted} />
                  <Text style={[styles.metaText, { color: themeColors.textSecondary }]}>
                    {activeRide.vehicle?.vehicleNumber}
                  </Text>
                </View>
                <View style={styles.meta}>
                  <Ionicons name="navigate" size={14} color={themeColors.secondary} />
                  <Text style={[styles.metaText, { color: themeColors.secondary, fontWeight: Typography.weights.semibold as any }]}>
                    {activeRide.eta}
                  </Text>
                </View>
              </View>
            </>
          ) : (
            <Text style={[styles.idleDesc, { color: themeColors.textSecondary }]}>
              {"You're"} available. Your next assigned route will appear here when it begins.
            </Text>
          )}

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionBtnPrimary, { backgroundColor: themeColors.secondary }]}
              onPress={() => router.push('/(driver)/active-trip')}
              activeOpacity={0.7}
            >
              <Ionicons name="navigate" size={16} color="#FFF" />
              <Text style={styles.actionBtnText}>Active Trip</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtnSecondary, { backgroundColor: themeColors.backgroundElement }]}
              onPress={() => router.push('/(driver)/trips')}
              activeOpacity={0.7}
            >
              <Ionicons name="calendar-outline" size={16} color={themeColors.textSecondary} />
              <Text style={[styles.actionBtnTextAlt, { color: themeColors.textSecondary }]}>My Trips</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Stats */}
        <Animated.View entering={FadeInUp.delay(300).duration(400)}>
          <SectionHeader title="Today's Overview" />
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
              <View style={[styles.statIcon, { backgroundColor: themeColors.secondaryLight }]}>
                <Ionicons name="calendar-outline" size={18} color={themeColors.secondary} />
              </View>
              <Text style={[styles.statValue, { color: themeColors.text }]}>3</Text>
              <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Trips Today</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
              <View style={[styles.statIcon, { backgroundColor: themeColors.accentLight }]}>
                <Ionicons name="people-outline" size={18} color={themeColors.accent} />
              </View>
              <Text style={[styles.statValue, { color: themeColors.text }]}>{totalPassengers || 42}</Text>
              <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Passengers</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
              <View style={[styles.statIcon, { backgroundColor: themeColors.warningLight }]}>
                <Ionicons name="time-outline" size={18} color={themeColors.warning} />
              </View>
              <Text style={[styles.statValue, { color: themeColors.text }]}>98%</Text>
              <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>On-Time</Text>
            </View>
          </View>
        </Animated.View>

        {/* Assigned Routes + Passengers */}
        <Animated.View entering={FadeInUp.delay(450).duration(400)}>
          <SectionHeader title="Manage" />
          <View style={styles.manageGrid}>
            <TouchableOpacity
              onPress={() => router.push('/(driver)/routes')}
              style={[styles.manageCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}
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
              style={[styles.manageCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}
              activeOpacity={0.7}
            >
              <View style={[styles.manageIcon, { backgroundColor: themeColors.accentLight }]}>
                <Ionicons name="people" size={24} color={themeColors.accent} />
              </View>
              <Text style={[styles.manageTitle, { color: themeColors.text }]}>Passengers</Text>
              <Text style={[styles.manageSub, { color: themeColors.textSecondary }]}>Manage boarding</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Assigned Routes List */}
        {routes.length > 0 && (
          <Animated.View entering={FadeInUp.delay(600).duration(400)}>
            <SectionHeader title="Assigned Routes" action="See all" onAction={() => router.push('/(driver)/routes')} />
            {routes.slice(0, 2).map((r, i) => (
              <Animated.View key={r.id} entering={FadeInUp.delay(650 + i * 80).duration(400)}>
                <TouchableOpacity
                  onPress={() => router.push('/(driver)/routes')}
                  style={[styles.routeCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}
                  activeOpacity={0.7}
                >
                  <View style={[styles.routeIcon, { backgroundColor: themeColors.secondaryLight }]}>
                    <Ionicons name="map" size={18} color={themeColors.secondary} />
                  </View>
                  <View style={styles.routeInfo}>
                    <Text style={[styles.routeName, { color: themeColors.text }]}>{r.name}</Text>
                    <Text style={[styles.routeDesc, { color: themeColors.textSecondary }]}>
                      {r.startingPoint} → {r.destination} • {r.distance} km
                    </Text>
                  </View>
                  <Text style={[styles.seatsText, { color: themeColors.textSecondary }]}>
                    {r.occupiedSeats}/{r.capacity}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </Animated.View>
        )}
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
    marginBottom: 18,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#FFF', fontSize: Typography.fontSizes.lg, fontWeight: Typography.weights.bold as any },
  greeting: { fontSize: Typography.fontSizes.xs },
  headerTitle: { fontSize: Typography.fontSizes.xl, fontWeight: Typography.weights.bold as any },
  sosBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  sosText: { fontSize: Typography.fontSizes.xs, fontWeight: Typography.weights.bold as any },
  statusCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  statusCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusCardTitle: { fontSize: Typography.fontSizes.md, fontWeight: Typography.weights.semibold as any },
  idlePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    gap: 6,
  },
  idleDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#5F9F63' },
  idlePillText: { fontSize: Typography.fontSizes.xs, fontWeight: Typography.weights.semibold as any },
  idleDesc: { fontSize: Typography.fontSizes.sm, marginBottom: 14 },
  routeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  routeInfo: { flex: 1 },
  routeIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  routeName: { fontSize: Typography.fontSizes.md, fontWeight: Typography.weights.semibold as any, marginBottom: 2 },
  routePoints: { fontSize: Typography.fontSizes.sm },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 14 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: Typography.fontSizes.sm },
  actionRow: { flexDirection: 'row', gap: 10 },
  actionBtnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: BorderRadius.md,
    gap: 6,
  },
  actionBtnSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: BorderRadius.md,
    gap: 6,
  },
  actionBtnText: { color: '#FFF', fontSize: Typography.fontSizes.sm, fontWeight: Typography.weights.semibold as any },
  actionBtnTextAlt: { fontSize: Typography.fontSizes.sm, fontWeight: Typography.weights.semibold as any },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 14,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: { fontSize: Typography.fontSizes.xl, fontWeight: Typography.weights.bold as any },
  statLabel: { fontSize: Typography.fontSizes.xs, marginTop: 2, textAlign: 'center' },
  manageGrid: { flexDirection: 'row', gap: 10, marginBottom: 4 },
  manageCard: {
    flex: 1,
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  manageIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  manageTitle: { fontSize: Typography.fontSizes.md, fontWeight: Typography.weights.semibold as any },
  manageSub: { fontSize: Typography.fontSizes.xs, marginTop: 2 },
  routeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: 10,
  },
  routeDesc: { fontSize: Typography.fontSizes.sm },
  seatsText: { fontSize: Typography.fontSizes.sm, fontWeight: Typography.weights.semibold as any },
});
