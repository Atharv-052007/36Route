import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../../context/AppContext';
import { Typography, Shadows } from '../../constants/theme';
import { RideCard, DriverCard } from '../../components/ui/RideCards';
import { SectionHeader, EmptyState } from '../../components/ui/AppStates';
import { AppButton } from '../../components/ui/AppButton';

export default function HomeScreen() {
  const router = useRouter();
  const { employee, activeRide, rides, refreshRides, themeColors, unreadNotificationCount } =
    useApp();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshRides();
    setRefreshing(false);
  };

  const upcomingScheduled = rides.find((r) => r.status === 'SCHEDULED');

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <View style={styles.userCol}>
            <Image
              source={{ uri: employee?.avatarUrl || 'https://via.placeholder.com/150' }}
              style={styles.avatar}
            />
            <View style={{ marginLeft: 12 }}>
              <Text style={[styles.greeting, { color: themeColors.textSecondary }]}>
                Good day 👋
              </Text>
              <Text style={[styles.userName, { color: themeColors.text }]}>{employee?.name}</Text>
            </View>
          </View>

          <View style={styles.headerIcons}>
            <TouchableOpacity
              style={[
                styles.iconBtn,
                { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border },
                Shadows.small,
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
              <Ionicons name="alert-circle" size={20} color={themeColors.danger} />
              <Text style={[styles.sosHeaderText, { color: themeColors.danger }]}>SOS</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Date & Location Pill */}
        <View style={[styles.infoPill, { backgroundColor: themeColors.primaryLight }]}>
          <Ionicons name="calendar-outline" size={16} color={themeColors.primary} />
          <Text style={[styles.infoPillText, { color: themeColors.primary }]}>
            Today, 1 Sep 2026 • Shift: Product & Tech
          </Text>
        </View>

        {/* Active Ride Card Section */}
        {activeRide ? (
          <View style={{ marginTop: 12 }}>
            <SectionHeader
              title="Active Trip"
              subtitle="Vehicle is currently on route to your location"
            />
            <RideCard
              ride={activeRide}
              onTrack={() => router.push('/(tabs)/track')}
              onViewDetails={() => router.push({ pathname: '/ride-details', params: { id: activeRide.id } })}
            />

            {/* Driver preview inside active ride */}
            {activeRide.driver && (
              <DriverCard
                driver={activeRide.driver}
                vehicle={activeRide.vehicle}
                onCall={() => console.log('Calling driver')}
              />
            )}
          </View>
        ) : (
          <View style={{ marginTop: 12 }}>
            <SectionHeader title="Next Scheduled Trip" />
            {upcomingScheduled ? (
              <RideCard
                ride={upcomingScheduled}
                onViewDetails={() =>
                  router.push({ pathname: '/ride-details', params: { id: upcomingScheduled.id } })
                }
              />
            ) : (
              <EmptyState
                title="No Active or Scheduled Rides"
                description="You don't have any transportation scheduled for today."
                actionTitle="Book a Ride Now"
                onAction={() => router.push('/book-ride')}
              />
            )}
          </View>
        )}

        {/* Quick Actions Grid */}
        <View style={{ marginTop: 16 }}>
          <SectionHeader title="Quick Services" />
          <View style={styles.quickGrid}>
            <TouchableOpacity
              style={[
                styles.gridCard,
                { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border },
                Shadows.small,
              ]}
              onPress={() => router.push('/book-ride')}
            >
              <View style={[styles.gridIconCircle, { backgroundColor: themeColors.primaryLight }]}>
                <Ionicons name="add-circle-outline" size={24} color={themeColors.primary} />
              </View>
              <Text style={[styles.gridTitle, { color: themeColors.text }]}>Book Ride</Text>
              <Text style={[styles.gridSub, { color: themeColors.textSecondary }]}>Request shift cab</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.gridCard,
                { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border },
                Shadows.small,
              ]}
              onPress={() => router.push('/(tabs)/track')}
            >
              <View style={[styles.gridIconCircle, { backgroundColor: themeColors.secondaryLight }]}>
                <Ionicons name="map-outline" size={24} color={themeColors.secondary} />
              </View>
              <Text style={[styles.gridTitle, { color: themeColors.text }]}>Track Live</Text>
              <Text style={[styles.gridSub, { color: themeColors.textSecondary }]}>Realtime GPS</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.gridCard,
                { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border },
                Shadows.small,
              ]}
              onPress={() => router.push('/(tabs)/rides')}
            >
              <View style={[styles.gridIconCircle, { backgroundColor: themeColors.accentLight }]}>
                <Ionicons name="time-outline" size={24} color={themeColors.accent} />
              </View>
              <Text style={[styles.gridTitle, { color: themeColors.text }]}>My Schedule</Text>
              <Text style={[styles.gridSub, { color: themeColors.textSecondary }]}>All bookings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.gridCard,
                { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border },
                Shadows.small,
              ]}
              onPress={() => router.push('/help')}
            >
              <View style={[styles.gridIconCircle, { backgroundColor: themeColors.warningLight }]}>
                <Ionicons name="help-buoy-outline" size={24} color={themeColors.warning} />
              </View>
              <Text style={[styles.gridTitle, { color: themeColors.text }]}>Help Center</Text>
              <Text style={[styles.gridSub, { color: themeColors.textSecondary }]}>FAQs & Support</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    padding: 18,
    paddingBottom: 40,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  userCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  greeting: {
    fontSize: Typography.fontSizes.xs,
  },
  userName: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.weights.bold as any,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
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
  notifBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  sosHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 10,
  },
  sosHeaderText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.bold as any,
    marginLeft: 4,
  },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    marginBottom: 12,
  },
  infoPillText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.semibold as any,
    marginLeft: 8,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridCard: {
    width: '48%',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 14,
  },
  gridIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  gridTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.bold as any,
  },
  gridSub: {
    fontSize: Typography.fontSizes.xs,
    marginTop: 2,
  },
});
