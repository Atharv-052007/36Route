import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useApp } from '../context/AppContext';
import { Typography, Shadows } from '../constants/theme';
import { DriverCard, LocationCard, StatusBadge } from '../components/ui/RideCards';
import { AppButton } from '../components/ui/AppButton';

export default function RideDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { rides, themeColors, cancelRide } = useApp();

  const ride = rides.find((r) => r.id === id) || rides[0];

  const handleCancel = () => {
    Alert.alert('Cancel Ride', 'Are you sure you want to cancel this scheduled commute?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, Cancel',
        style: 'destructive',
        onPress: async () => {
          if (ride) {
            await cancelRide(ride.id);
            router.back();
          }
        },
      },
    ]);
  };

  if (!ride) return null;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={themeColors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: themeColors.text }]}>Ride Details</Text>
        </View>

        {/* Main Details Card */}
        <View
          style={[
            styles.card,
            { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border },
            Shadows.medium,
          ]}
        >
          <View style={styles.idRow}>
            <View>
              <Text style={[styles.bookingLabel, { color: themeColors.textMuted }]}>
                BOOKING ID
              </Text>
              <Text style={[styles.bookingId, { color: themeColors.text }]}>
                {ride.bookingId}
              </Text>
            </View>
            <StatusBadge status={ride.status} />
          </View>

          <View style={[styles.divider, { borderTopColor: themeColors.border }]} />

          <View style={styles.infoRow}>
            <View style={styles.infoCol}>
              <Text style={[styles.infoLabel, { color: themeColors.textMuted }]}>DATE & TIME</Text>
              <Text style={[styles.infoVal, { color: themeColors.text }]}>
                {ride.date} • {ride.time}
              </Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={[styles.infoLabel, { color: themeColors.textMuted }]}>SHIFT TYPE</Text>
              <Text style={[styles.infoVal, { color: themeColors.primary }]}>
                {ride.shiftType === 'PICKUP' ? 'Morning Pickup' : 'Evening Drop'}
              </Text>
            </View>
          </View>

          {/* OTP Box */}
          {ride.otp && (
            <View style={[styles.otpBox, { backgroundColor: themeColors.primaryLight }]}>
              <Text style={[styles.otpText, { color: themeColors.primary }]}>
                Boarding OTP Code: <Text style={{ fontWeight: '700' }}>{ride.otp}</Text>
              </Text>
            </View>
          )}

          {/* Route Section */}
          <LocationCard pickup={ride.pickup.address} drop={ride.drop.address} />

          <View style={[styles.metricsRow, { backgroundColor: themeColors.borderLight }]}>
            <View style={styles.metricCol}>
              <Text style={[styles.metricVal, { color: themeColors.text }]}>
                {ride.estimatedDistanceKm} km
              </Text>
              <Text style={[styles.metricLabel, { color: themeColors.textSecondary }]}>
                Est. Distance
              </Text>
            </View>
            <View style={[styles.vertDivider, { backgroundColor: themeColors.border }]} />
            <View style={styles.metricCol}>
              <Text style={[styles.metricVal, { color: themeColors.text }]}>
                {ride.estimatedDurationMins} mins
              </Text>
              <Text style={[styles.metricLabel, { color: themeColors.textSecondary }]}>
                Est. Duration
              </Text>
            </View>
          </View>
        </View>

        {/* Driver Card if Assigned */}
        {ride.driver && (
          <DriverCard
            driver={ride.driver}
            vehicle={ride.vehicle}
            onCall={() => Alert.alert('Call', `Dialing ${ride.driver?.phone}`)}
          />
        )}

        {/* Actions */}
        <View style={{ marginTop: 16 }}>
          {ride.status === 'IN_TRANSIT' && (
            <AppButton
              title="Track Live Vehicle"
              onPress={() => router.push('/(tabs)/track')}
              size="lg"
              icon={<Ionicons name="navigate" size={18} color="#FFF" />}
            />
          )}

          {(ride.status === 'SCHEDULED' || ride.status === 'BOARDING') && (
            <AppButton
              title="Cancel Commute Request"
              onPress={handleCancel}
              variant="outline"
              size="lg"
              textStyle={{ color: themeColors.danger }}
              style={{ borderColor: themeColors.dangerLight, marginTop: 10 }}
            />
          )}
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backBtn: {
    marginRight: 12,
  },
  title: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.weights.bold as any,
  },
  card: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    marginBottom: 16,
  },
  idRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingLabel: {
    fontSize: 10,
    fontWeight: Typography.weights.bold as any,
  },
  bookingId: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.bold as any,
    marginTop: 2,
  },
  divider: {
    borderTopWidth: 1,
    marginVertical: 14,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: Typography.weights.bold as any,
  },
  infoVal: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.semibold as any,
    marginTop: 2,
  },
  otpBox: {
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 6,
  },
  otpText: {
    fontSize: Typography.fontSizes.xs,
  },
  metricsRow: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    marginTop: 14,
  },
  metricCol: {
    flex: 1,
    alignItems: 'center',
  },
  metricVal: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.bold as any,
  },
  metricLabel: {
    fontSize: Typography.fontSizes.xs,
    marginTop: 2,
  },
  vertDivider: {
    width: 1,
    height: '100%',
  },
});
