import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../../context/AppContext';
import { Typography, Shadows } from '../../constants/theme';
import { MapViewAbstraction } from '../../components/ui/MapViewAbstraction';
import { DriverCard, LocationCard, StatusBadge } from '../../components/ui/RideCards';
import { AppButton } from '../../components/ui/AppButton';
import { EmptyState } from '../../components/ui/AppStates';

export default function TrackScreen() {
  const router = useRouter();
  const { activeRide, themeColors } = useApp();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefreshLocation = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  const handleCallDriver = () => {
    if (activeRide?.driver) {
      Alert.alert(
        'Call Driver',
        `Dialing ${activeRide.driver.name} at ${activeRide.driver.phone}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Call Now',
            onPress: () => Linking.openURL(`tel:${activeRide.driver?.phone}`),
          },
        ]
      );
    }
  };

  if (!activeRide) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: themeColors.background }]}>
        <EmptyState
          title="No Active Trip to Track"
          description="Live tracking is automatically enabled when your corporate cab is dispatched and in transit."
          actionTitle="Book a Shift Cab"
          onAction={() => router.push('/book-ride')}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.topHeader}>
          <View>
            <Text style={[styles.pageTitle, { color: themeColors.text }]}>Live Tracking</Text>
            <Text style={[styles.pageSub, { color: themeColors.textSecondary }]}>
              Booking ID: {activeRide.bookingId}
            </Text>
          </View>
          <StatusBadge status={activeRide.status} />
        </View>

        {/* Interactive Map Visual Abstraction */}
        <MapViewAbstraction ride={activeRide} onRefresh={handleRefreshLocation} />

        {/* Trip Summary Card */}
        <View
          style={[
            styles.sheetCard,
            { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border },
            Shadows.large,
          ]}
        >
          <View style={styles.etaRow}>
            <View>
              <Text style={[styles.etaHeader, { color: themeColors.textSecondary }]}>
                ESTIMATED ARRIVAL
              </Text>
              <Text style={[styles.etaValue, { color: themeColors.primary }]}>
                {activeRide.eta}
              </Text>
            </View>

            <View style={[styles.distancePill, { backgroundColor: themeColors.primaryLight }]}>
              <Ionicons name="speedometer-outline" size={16} color={themeColors.primary} />
              <Text style={[styles.distanceText, { color: themeColors.primary }]}>
                {activeRide.estimatedDistanceKm} km remaining
              </Text>
            </View>
          </View>

          {/* OTP Banner */}
          {activeRide.otp && (
            <View style={[styles.otpCard, { backgroundColor: themeColors.primaryLight }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.otpTitle, { color: themeColors.primary }]}>
                  Boarding Verification Pass
                </Text>
                <Text style={[styles.otpSub, { color: themeColors.textSecondary }]}>
                  Share this OTP with your driver before boarding
                </Text>
              </View>
              <View style={[styles.otpBadge, { backgroundColor: themeColors.primary }]}>
                <Text style={styles.otpValue}>{activeRide.otp}</Text>
              </View>
            </View>
          )}

          {/* Route Info */}
          <LocationCard pickup={activeRide.pickup.address} drop={activeRide.drop.address} />

          {/* Driver & Vehicle Card */}
          {activeRide.driver && (
            <DriverCard
              driver={activeRide.driver}
              vehicle={activeRide.vehicle}
              onCall={handleCallDriver}
            />
          )}

          {/* Actions: Call & Emergency */}
          <View style={styles.actionRow}>
            <AppButton
              title="Call Driver"
              onPress={handleCallDriver}
              variant="outline"
              icon={<Ionicons name="call" size={16} color={themeColors.primary} />}
              style={{ flex: 1, marginRight: 10 }}
            />
            <AppButton
              title="Emergency SOS"
              onPress={() => router.push('/sos')}
              variant="danger"
              icon={<Ionicons name="warning" size={16} color="#FFF" />}
              style={{ flex: 1 }}
            />
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
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.weights.bold as any,
  },
  pageSub: {
    fontSize: Typography.fontSizes.xs,
    marginTop: 2,
  },
  sheetCard: {
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    marginTop: 16,
  },
  etaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  etaHeader: {
    fontSize: 10,
    fontWeight: Typography.weights.bold as any,
    letterSpacing: 0.5,
  },
  etaValue: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.weights.bold as any,
    marginTop: 2,
  },
  distancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  distanceText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.semibold as any,
    marginLeft: 6,
  },
  otpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    marginBottom: 14,
  },
  otpTitle: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.bold as any,
  },
  otpSub: {
    fontSize: 11,
    marginTop: 2,
  },
  otpBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  otpValue: {
    color: '#FFF',
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.bold as any,
    letterSpacing: 2,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 14,
  },
});
