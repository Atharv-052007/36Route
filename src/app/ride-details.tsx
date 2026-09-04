import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { AppSafeAreaView } from '@/components/ui/AppSafeAreaView';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { Typography, BorderRadius, Shadows } from '@/constants/theme';
import { RideCard, DriverCard, LocationCard } from '@/components/ui/RideCards';
import { StatusBadge } from '@/components/ui/AppStates';
import { AnimatedAppButton } from '@/components/ui/AnimatedAppButton';
import Animated, {
  FadeInUp,
  FadeInDown,
  FadeIn,
  SlideInRight,
  Layout,
} from 'react-native-reanimated';

export default function RideDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { rides, activeRide, cancelRide, themeColors } = useApp();

  const ride = rides.find((r) => r.id === id) || activeRide || rides[0];

  if (!ride) {
    return (
      <AppSafeAreaView style={[styles.safe, { backgroundColor: themeColors.background }]}>
        <Text style={{ textAlign: 'center', marginTop: 40, color: themeColors.textSecondary }}>
          Ride not found
        </Text>
      </AppSafeAreaView>
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
    <AppSafeAreaView style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <TouchableOpacity
            onPress={() => router.dismissTo('/(tabs)')}
            style={[styles.backBtn, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}
          >
            <Ionicons name="arrow-back" size={20} color={themeColors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: themeColors.text }]}>Ride Details</Text>
          <View style={{ width: 40 }} />
        </Animated.View>

        {/* Status & Info */}
        <Animated.View entering={SlideInRight.delay(150).duration(400).springify()} style={[styles.infoCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }, Shadows.small]}>
          <View style={styles.infoHeader}>
            <Text style={[styles.bookingId, { color: themeColors.text }]}>{ride.bookingId}</Text>
            <StatusBadge status={ride.status} />
          </View>
          <Text style={[styles.dateTime, { color: themeColors.textSecondary }]}>
            {ride.date} • {ride.time} • {ride.shiftType === 'PICKUP' ? 'Morning Pickup' : 'Evening Drop'}
          </Text>

          {ride.otp && (
            <Animated.View entering={FadeIn.delay(250).duration(400)} style={[styles.otpBox, { backgroundColor: themeColors.backgroundElement }]}>
              <Ionicons name="key" size={16} color={themeColors.secondary} />
              <Text style={[styles.otpLabel, { color: themeColors.textSecondary }]}>OTP</Text>
              <Text style={[styles.otpValue, { color: themeColors.text }]}>{ride.otp}</Text>
            </Animated.View>
          )}

          <LocationCard pickup={ride.pickup} drop={ride.drop} />

          <Animated.View entering={FadeInUp.delay(300).duration(400)} style={styles.metrics}>
            <View style={[styles.metric, { backgroundColor: themeColors.backgroundElement }]}>
              <Text style={[styles.metricValue, { color: themeColors.text }]}>{ride.estimatedDistanceKm}</Text>
              <Text style={[styles.metricLabel, { color: themeColors.textSecondary }]}>km</Text>
            </View>
            <View style={[styles.metric, { backgroundColor: themeColors.backgroundElement }]}>
              <Text style={[styles.metricValue, { color: themeColors.text }]}>{ride.estimatedDurationMins}</Text>
              <Text style={[styles.metricLabel, { color: themeColors.textSecondary }]}>min</Text>
            </View>
            {ride.coPassengersCount !== undefined && (
              <View style={[styles.metric, { backgroundColor: themeColors.backgroundElement }]}>
                <Text style={[styles.metricValue, { color: themeColors.text }]}>{ride.coPassengersCount}</Text>
                <Text style={[styles.metricLabel, { color: themeColors.textSecondary }]}>co-pass</Text>
              </View>
            )}
          </Animated.View>
        </Animated.View>

        {ride.driver && (
          <Animated.View entering={FadeInUp.delay(350).duration(400)}>
            <DriverCard driver={ride.driver} vehicle={ride.vehicle} />
          </Animated.View>
        )}

        {/* Actions */}
        <Animated.View entering={FadeInUp.delay(450).duration(400)} style={styles.actions}>
          {ride.status === 'IN_TRANSIT' && (
            <AnimatedAppButton
              title="Track Live Vehicle"
              onPress={() => router.push('/(tabs)/track')}
              icon={<Ionicons name="navigate" size={18} color="#FFF" />}
            />
          )}
          {(ride.status === 'SCHEDULED' || ride.status === 'BOARDING') && (
            <AnimatedAppButton
              title="Cancel Ride"
              onPress={handleCancel}
              variant="danger"
              icon={<Ionicons name="close-circle" size={18} color="#FFF" />}
            />
          )}
        </Animated.View>
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 18, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20, borderWidth: 1,
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.weights.bold as any,
  },
  infoCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  bookingId: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.bold as any,
  },
  dateTime: {
    fontSize: Typography.fontSizes.sm,
    marginBottom: 12,
  },
  otpBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: BorderRadius.sm,
    gap: 8,
    marginBottom: 12,
  },
  otpLabel: { fontSize: Typography.fontSizes.sm },
  otpValue: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.weights.bold as any,
    letterSpacing: 4,
    marginLeft: 'auto',
  },
  metrics: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  metric: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: BorderRadius.sm,
  },
  metricValue: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.weights.bold as any,
  },
  metricLabel: { fontSize: Typography.fontSizes.xs },
  actions: { marginTop: 16, gap: 12 },
});
