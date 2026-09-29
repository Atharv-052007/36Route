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
import { Colors, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { useApp } from '../../context/AppContext';
import { MapViewAbstraction } from '../../components/ui/MapViewAbstraction';
import { Header } from '../../components/ui/Header';
import { StatusBadge, EmptyState } from '../../components/ui/AppStates';

const JOURNEY_STEPS = [
  { key: 'SCHEDULED', label: 'Scheduled', icon: 'calendar-outline' as const },
  { key: 'BOARDING', label: 'Boarding', icon: 'walk-outline' as const },
  { key: 'IN_TRANSIT', label: 'On Trip', icon: 'car-sport' as const },
  { key: 'ARRIVED', label: 'Arrived', icon: 'location-outline' as const },
  { key: 'COMPLETED', label: 'Completed', icon: 'checkmark-circle-outline' as const },
];

const STATUS_ORDER = ['SCHEDULED', 'BOARDING', 'IN_TRANSIT', 'ARRIVED', 'COMPLETED'];

function getStepIndex(status: string): number {
  const idx = STATUS_ORDER.indexOf(status);
  return idx >= 0 ? idx : -1;
}

export default function TrackScreen() {
  const router = useRouter();
  const { activeRide, themeColors: t } = useApp();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  };

  if (!activeRide) {
    return (
      <AppSafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: t.background }]}>
        <Header title="Live Tracking" />
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

  const currentStepIdx = getStepIndex(activeRide.status);

  return (
    <AppSafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: t.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Map — visually dominant */}
        <View style={styles.mapSection}>
          <MapViewAbstraction eta={activeRide.eta} onRefresh={onRefresh} />
        </View>

        {/* Floating info card */}
        <View style={[styles.card, { backgroundColor: t.cardBackground }, Shadows.large]}>
          {/* Top row: route name + status */}
          <View style={styles.cardTopRow}>
            <View style={styles.cardTopLeft}>
              <Text style={[styles.routeName, { color: t.text }]} numberOfLines={1}>
                {activeRide.route?.name || 'Your Route'}
              </Text>
              <Text style={[styles.routeType, { color: t.textMuted }]}>
                {activeRide.shiftType === 'PICKUP' ? 'To Office' : 'To Home'}
              </Text>
            </View>
            <StatusBadge status={activeRide.status} />
          </View>

          {/* Pickup → Drop visualization */}
          <View style={[styles.routeVisual, { backgroundColor: t.backgroundElement }]}>
            <View style={styles.routeVisualRow}>
              <View style={[styles.routeDot, { backgroundColor: t.secondary }]}>
                <Ionicons name="radio-button-on" size={12} color={t.secondary} />
              </View>
              <View style={styles.routeEndpoints}>
                <Text style={[styles.routeEndpointName, { color: t.text }]} numberOfLines={1}>
                  {activeRide.pickup.name}
                </Text>
                <View style={styles.routeLineOuter}>
                  <View style={[styles.routeLine, { backgroundColor: t.secondary }]} />
                  <View style={[styles.routeLineInner, { backgroundColor: t.secondary, opacity: 0.3 }]} />
                </View>
                <Text style={[styles.routeEndpointName, { color: t.text }]} numberOfLines={1}>
                  {activeRide.drop.name}
                </Text>
              </View>
              <View style={[styles.routeDot, { backgroundColor: t.accent }]}>
                <Ionicons name="radio-button-on" size={12} color={t.accent} />
              </View>
            </View>
          </View>

          {/* ETA + distance */}
          <View style={styles.etaRow}>
            <View style={[styles.etaPill, { backgroundColor: t.secondaryLight }]}>
              <Ionicons name="time" size={16} color={t.secondary} />
              <Text style={[styles.etaValue, { color: t.secondary }]}>{activeRide.eta}</Text>
            </View>
            <Text style={[styles.distanceText, { color: t.textSecondary }]}>
              {activeRide.estimatedDistanceKm} km · {activeRide.estimatedDurationMins} min
            </Text>
          </View>

          {/* OTP (if available) */}
          {activeRide.otp && (
            <View style={[styles.otpRow, { backgroundColor: t.primaryLight }]}>
              <Ionicons name="key" size={15} color={t.primary} />
              <Text style={[styles.otpLabel, { color: t.textSecondary }]}>OTP</Text>
              <Text style={[styles.otpValue, { color: t.primary }]}>{activeRide.otp}</Text>
            </View>
          )}

          {/* Driver + Vehicle info */}
          {activeRide.driver && (
            <View style={[styles.driverSection, { borderTopColor: t.borderLight }]}>
              <View style={styles.driverRow}>
                <View style={[styles.driverAvatar, { backgroundColor: t.secondaryLight }]}>
                  <Ionicons name="person" size={20} color={t.secondary} />
                </View>
                <View style={styles.driverInfo}>
                  <Text style={[styles.driverName, { color: t.text }]}>{activeRide.driver.name}</Text>
                  <Text style={[styles.driverMeta, { color: t.textSecondary }]}>
                    {activeRide.driver.experience ? `${activeRide.driver.experience} yrs exp` : 'Driver'}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.callBtn, { backgroundColor: t.accentLight }]}
                  activeOpacity={0.7}
                  onPress={() =>
                    Alert.alert('Call Driver', `Call ${activeRide.driver?.name}?`, [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Call', onPress: () => Linking.openURL(`tel:${activeRide.driver?.phone}`) },
                    ])
                  }
                >
                  <Ionicons name="call" size={16} color={t.accent} />
                </TouchableOpacity>
              </View>

              {activeRide.vehicle && (
                <View style={[styles.vehicleRow, { backgroundColor: t.backgroundElement }]}>
                  <Ionicons name="car-sport" size={15} color={t.textSecondary} />
                  <Text style={[styles.vehicleText, { color: t.textSecondary }]}>
                    {activeRide.vehicle.vehicleNumber}
                  </Text>
                  <View style={[styles.vehicleTypeDot, { backgroundColor: t.textMuted }]} />
                  <Text style={[styles.vehicleText, { color: t.textMuted }]}>
                    {activeRide.vehicle.vehicleType} · {activeRide.vehicle.model}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Journey Timeline */}
          <View style={[styles.timelineSection, { borderTopColor: t.borderLight }]}>
            <Text style={[styles.timelineTitle, { color: t.textMuted }]}>JOURNEY PROGRESS</Text>
            <View style={styles.timeline}>
              {JOURNEY_STEPS.map((step, i) => {
                const isCompleted = i < currentStepIdx;
                const isCurrent = i === currentStepIdx;
                const dotColor = isCompleted ? t.accent : isCurrent ? t.secondary : t.backgroundElement;
                const textColor = isCompleted || isCurrent ? t.text : t.textMuted;
                const iconColor = isCompleted || isCurrent ? t.textInverse : t.textMuted;

                return (
                  <React.Fragment key={step.key}>
                    {i > 0 && (
                      <View
                        style={[
                          styles.timelineConnector,
                          {
                            backgroundColor: isCompleted || isCurrent ? t.secondary : t.border,
                          },
                        ]}
                      />
                    )}
                    <View style={styles.timelineStep}>
                      <View
                        style={[
                          styles.timelineDot,
                          {
                            backgroundColor: dotColor,
                            borderColor: isCurrent ? t.secondary : dotColor,
                            borderWidth: isCurrent ? 2 : 0,
                          },
                        ]}
                      >
                        {isCompleted && <Ionicons name="checkmark" size={10} color={iconColor} />}
                        {isCurrent && <Ionicons name={step.icon} size={10} color={iconColor} />}
                      </View>
                      <Text
                        style={[
                          styles.timelineLabel,
                          {
                            color: textColor,
                            fontWeight: (isCurrent ? Typography.weights.semibold : Typography.weights.regular) as any,
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {step.label}
                      </Text>
                    </View>
                  </React.Fragment>
                );
              })}
            </View>
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.shareBtn, { backgroundColor: t.secondary }]}
            activeOpacity={0.7}
            onPress={() => Alert.alert('Share Live Location', 'Trip link shared with emergency contacts')}
          >
            <Ionicons name="share-social" size={18} color={t.textInverse} />
            <Text style={[styles.shareBtnText, { color: t.textInverse }]}>Share Live Location</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sosBtn, { backgroundColor: t.dangerLight, borderColor: t.danger }]}
            activeOpacity={0.7}
            onPress={() => router.push('/sos')}
          >
            <Ionicons name="alert-circle" size={18} color={t.danger} />
            <Text style={[styles.sosBtnText, { color: t.danger }]}>SOS</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  mapSection: {
    width: '100%',
  },

  /* Floating card */
  card: {
    marginHorizontal: 16,
    marginTop: -24,
    borderRadius: BorderRadius.lg,
    padding: 18,
    zIndex: 10,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  cardTopLeft: { flex: 1, marginRight: 10 },
  routeName: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.weights.bold as any,
    marginBottom: 2,
  },
  routeType: {
    fontSize: Typography.fontSizes.xs,
    letterSpacing: 0.3,
  },

  /* Route visualization (pickup -> drop) */
  routeVisual: {
    borderRadius: BorderRadius.sm,
    padding: 14,
    marginBottom: 14,
  },
  routeVisualRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  routeEndpoints: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  routeEndpointName: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold as any,
    maxWidth: 120,
    textAlign: 'center',
  },
  routeLineOuter: {
    width: '100%',
    height: 3,
    borderRadius: 2,
    overflow: 'hidden',
    marginVertical: 6,
    position: 'relative',
  },
  routeLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    borderRadius: 2,
  },
  routeLineInner: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '60%',
    height: 3,
    borderRadius: 2,
  },

  /* ETA row */
  etaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  etaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    gap: 6,
  },
  etaValue: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.weights.bold as any,
  },
  distanceText: {
    fontSize: Typography.fontSizes.sm,
  },

  /* OTP */
  otpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: BorderRadius.sm,
    gap: 10,
    marginBottom: 14,
  },
  otpLabel: {
    fontSize: Typography.fontSizes.xs,
    letterSpacing: 0.5,
  },
  otpValue: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.weights.bold as any,
    letterSpacing: 6,
    marginLeft: 'auto',
  },

  /* Driver + Vehicle */
  driverSection: {
    borderTopWidth: 1,
    paddingTop: 14,
    marginTop: 2,
    marginBottom: 14,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  driverInfo: { flex: 1 },
  driverName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.semibold as any,
  },
  driverMeta: {
    fontSize: Typography.fontSizes.xs,
    marginTop: 1,
  },
  callBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 10,
    borderRadius: BorderRadius.sm,
    gap: 8,
  },
  vehicleText: {
    fontSize: Typography.fontSizes.sm,
  },
  vehicleTypeDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },

  /* Journey Timeline */
  timelineSection: {
    borderTopWidth: 1,
    paddingTop: 14,
  },
  timelineTitle: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.semibold as any,
    letterSpacing: 1,
    marginBottom: 14,
  },
  timeline: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineStep: {
    alignItems: 'center',
    flex: 1,
  },
  timelineDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  timelineConnector: {
    flex: 1,
    height: 2,
    borderRadius: 1,
    marginTop: 10,
    marginBottom: 6,
  },
  timelineLabel: {
    fontSize: 10,
    textAlign: 'center',
    letterSpacing: 0.2,
  },

  /* Action Buttons */
  actions: {
    paddingHorizontal: 16,
    marginTop: 20,
    gap: 12,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: BorderRadius.md,
    gap: 8,
  },
  shareBtnText: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.semibold as any,
  },
  sosBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 8,
  },
  sosBtnText: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.semibold as any,
  },
});