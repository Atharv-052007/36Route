import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { AppSafeAreaView } from '@/components/ui/AppSafeAreaView';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../../context/AppContext';
import { Typography, BorderRadius, Shadows } from '../../constants/theme';
import { MapViewAbstraction } from '../../components/ui/MapViewAbstraction';
import { DriverCard } from '../../components/ui/RideCards';
import { StatusBadge, EmptyState } from '../../components/ui/AppStates';

export default function TrackScreen() {
  const router = useRouter();
  const { activeRide, themeColors } = useApp();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  };

  if (!activeRide) {
    return (
      <AppSafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: themeColors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: themeColors.text }]}>Live Tracking</Text>
        </View>
        <EmptyState
          title="No Active Trip"
          description="You don't have any active trip to track right now."
          actionTitle="Book a Ride"
          onAction={() => router.push('/book-ride')}
          icon="navigate-outline"
        />
      </AppSafeAreaView>
    );
  }

  return (
    <AppSafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: themeColors.text }]}>Live Tracking</Text>
          <StatusBadge status={activeRide.status} size="sm" />
        </View>

        {/* Map */}
        <MapViewAbstraction eta={activeRide.eta} onRefresh={onRefresh} />

        {/* Trip Summary Sheet */}
        <View style={[styles.sheet, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }, Shadows.medium]}>
          {/* ETA Bar */}
          <View style={[styles.etaBar, { backgroundColor: themeColors.secondaryLight }]}>
            <Ionicons name="time" size={18} color={themeColors.secondary} />
            <Text style={[styles.etaText, { color: themeColors.secondary }]}>
              ETA: {activeRide.eta}
            </Text>
            <Text style={[styles.distanceText, { color: themeColors.textSecondary }]}>
              {activeRide.estimatedDistanceKm} km remaining
            </Text>
          </View>

          {/* OTP Verification */}
          {activeRide.otp && (
            <View style={[styles.otpCard, { backgroundColor: themeColors.backgroundElement }]}>
              <Ionicons name="key" size={16} color={themeColors.secondary} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.otpLabel, { color: themeColors.textSecondary }]}>
                  Boarding Verification
                </Text>
                <Text style={[styles.otpValue, { color: themeColors.text }]}>
                  {activeRide.otp}
                </Text>
              </View>
            </View>
          )}

          {/* Route Info */}
          <View style={styles.routeInfo}>
            <View style={styles.routePoint}>
              <View style={[styles.routeDot, { backgroundColor: themeColors.accent }]} />
              <View>
                <Text style={[styles.routeLabel, { color: themeColors.textMuted }]}>Pickup</Text>
                <Text style={[styles.routeName, { color: themeColors.text }]}>{activeRide.pickup.name}</Text>
              </View>
            </View>
            <View style={[styles.routeLine, { backgroundColor: themeColors.border }]} />
            <View style={styles.routePoint}>
              <View style={[styles.routeDot, { backgroundColor: themeColors.secondary }]} />
              <View>
                <Text style={[styles.routeLabel, { color: themeColors.textMuted }]}>Drop</Text>
                <Text style={[styles.routeName, { color: themeColors.text }]}>{activeRide.drop.name}</Text>
              </View>
            </View>
          </View>

          {/* Driver Card */}
          {activeRide.driver && (
            <DriverCard
              driver={activeRide.driver}
              vehicle={activeRide.vehicle}
              onCall={() => {
                Alert.alert(
                  'Call Driver',
                  `Call ${activeRide.driver?.name}?`,
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Call', onPress: () => Linking.openURL(`tel:${activeRide.driver?.phone}`) },
                  ]
                );
              }}
            />
          )}

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: themeColors.secondary }]}
              onPress={() => {
                Alert.alert(
                  'Call Driver',
                  `Call ${activeRide.driver?.name}?`,
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Call', onPress: () => Linking.openURL(`tel:${activeRide.driver?.phone}`) },
                  ]
                );
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="call" size={18} color="#FFFFFF" />
              <Text style={styles.actionBtnText}>Call Driver</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: themeColors.accentLight }]}
              onPress={() => Alert.alert('Share Trip', 'Trip link shared with emergency contacts')}
              activeOpacity={0.7}
            >
              <Ionicons name="share-social" size={18} color={themeColors.accent} />
              <Text style={[styles.actionBtnText, { color: themeColors.accent }]}>Share Trip</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: themeColors.dangerLight }]}
              onPress={() => router.push('/sos')}
              activeOpacity={0.7}
            >
              <Ionicons name="alert-circle" size={18} color={themeColors.danger} />
              <Text style={[styles.actionBtnText, { color: themeColors.danger }]}>SOS</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 18, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.weights.bold as any,
  },
  sheet: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: 16,
    marginTop: -20,
  },
  etaBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: BorderRadius.sm,
    gap: 8,
    marginBottom: 16,
  },
  etaText: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.bold as any,
  },
  distanceText: {
    fontSize: Typography.fontSizes.sm,
    marginLeft: 'auto',
  },
  otpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: BorderRadius.sm,
    gap: 12,
    marginBottom: 16,
  },
  otpLabel: { fontSize: Typography.fontSizes.xs },
  otpValue: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.weights.bold as any,
    letterSpacing: 6,
  },
  routeInfo: {
    marginBottom: 16,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  routeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  routeLine: {
    width: 2,
    height: 20,
    marginLeft: 4,
    marginVertical: 4,
    borderRadius: 1,
  },
  routeLabel: {
    fontSize: Typography.fontSizes.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  routeName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.semibold as any,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    gap: 6,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold as any,
  },
});
