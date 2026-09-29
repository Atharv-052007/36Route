import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';
import { Colors, Typography, BorderRadius, Spacing, Shadows } from '@/constants/theme';
import { Ride, Driver, Vehicle, LocationCoordinate } from '@/types';
import { Badge } from './Badge';

// ─── Driver Card ─────────────────────────────────────────────────

interface DriverCardProps {
  driver: Driver;
  vehicle?: Vehicle;
  onCall?: () => void;
}

export const DriverCard: React.FC<DriverCardProps> = ({ driver, vehicle, onCall }) => {
  const { themeColors } = useApp();

  return (
    <View
      style={[
        styles.driverCard,
        {
          backgroundColor: themeColors.cardBackground,
          borderColor: themeColors.border,
        },
        Shadows.card,
      ]}
    >
      <View style={styles.driverRow}>
        <View style={[styles.avatarRing, { borderColor: themeColors.accent }]}>
          <Image
            source={{ uri: driver.photoUrl || 'https://via.placeholder.com/150' }}
            style={styles.driverAvatar}
          />
        </View>

        <View style={styles.driverInfo}>
          <View style={styles.driverNameRow}>
            <Text style={[styles.driverName, { color: themeColors.text }]} numberOfLines={1}>
              {driver.name}
            </Text>
            {driver.verificationStatus === 'VERIFIED' && (
              <View style={[styles.verifiedBadge, { backgroundColor: themeColors.accentLight }]}>
                <Ionicons name="checkmark-circle" size={13} color={themeColors.accent} />
              </View>
            )}
          </View>

          <View style={styles.driverMeta}>
            {driver.rating && (
              <View style={styles.ratingPill}>
                <Ionicons name="star" size={11} color="#F59E0B" />
                <Text style={[styles.ratingValue, { color: themeColors.text }]}>
                  {driver.rating}
                </Text>
              </View>
            )}
            {driver.totalTrips && (
              <View style={styles.tripPill}>
                <Ionicons name="car" size={11} color={themeColors.textMuted} />
                <Text style={[styles.tripValue, { color: themeColors.textMuted }]}>
                  {driver.totalTrips}
                </Text>
              </View>
            )}
          </View>
        </View>

        {onCall && (
          <TouchableOpacity
            onPress={onCall}
            style={[styles.callBtn, { backgroundColor: themeColors.accent }]}
            activeOpacity={0.75}
          >
            <Ionicons name="call" size={17} color={themeColors.textInverse || '#FFFFFF'} />
          </TouchableOpacity>
        )}
      </View>

      {vehicle && (
        <View style={[styles.vehicleRow, { borderTopColor: themeColors.borderLight }]}>
          <View style={[styles.vehicleIconWrap, { backgroundColor: themeColors.backgroundElement }]}>
            <Ionicons name="car-sport" size={14} color={themeColors.textSecondary} />
          </View>
          <View style={styles.vehicleDetails}>
            <Text style={[styles.vehicleModel, { color: themeColors.text }]}>
              {vehicle.model}
            </Text>
            <Text style={[styles.vehicleNumber, { color: themeColors.textMuted }]}>
              {vehicle.vehicleNumber}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

// ─── Location Card ───────────────────────────────────────────────

interface LocationCardProps {
  pickup: LocationCoordinate;
  drop: LocationCoordinate;
  pickupTime?: string;
  dropTime?: string;
}

export const LocationCard: React.FC<LocationCardProps> = ({
  pickup,
  drop,
  pickupTime,
  dropTime,
}) => {
  const { themeColors } = useApp();

  return (
    <View style={styles.locationCard}>
      <View style={styles.timelineRow}>
        <View style={styles.timelineTrack}>
          <View style={[styles.timelineDot, { backgroundColor: '#10B981' }]} />
          <View style={[styles.timelineLine, { backgroundColor: themeColors.border }]} />
          <View style={[styles.timelineDot, { backgroundColor: '#EF4444' }]} />
        </View>

        <View style={styles.timelineContent}>
          <View style={styles.timelineStop}>
            <Text style={[styles.stopLabel, { color: themeColors.textMuted }]}>PICKUP</Text>
            <Text style={[styles.stopName, { color: themeColors.text }]} numberOfLines={1}>
              {pickup.name}
            </Text>
            <Text style={[styles.stopAddress, { color: themeColors.textSecondary }]} numberOfLines={1}>
              {pickup.address}
            </Text>
            {pickupTime && (
              <Text style={[styles.stopTime, { color: '#10B981' }]}>{pickupTime}</Text>
            )}
          </View>

          <View style={[styles.routeDash, { borderLeftColor: themeColors.border }]} />

          <View style={styles.timelineStop}>
            <Text style={[styles.stopLabel, { color: themeColors.textMuted }]}>DROP</Text>
            <Text style={[styles.stopName, { color: themeColors.text }]} numberOfLines={1}>
              {drop.name}
            </Text>
            <Text style={[styles.stopAddress, { color: themeColors.textSecondary }]} numberOfLines={1}>
              {drop.address}
            </Text>
            {dropTime && (
              <Text style={[styles.stopTime, { color: '#EF4444' }]}>{dropTime}</Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

// ─── Ride Card ───────────────────────────────────────────────────

interface RideCardProps {
  ride: Ride;
  onTrack?: () => void;
  onViewDetails?: () => void;
  onCancel?: () => void;
}

export const RideCard: React.FC<RideCardProps> = ({
  ride,
  onTrack,
  onViewDetails,
  onCancel,
}) => {
  const { themeColors } = useApp();

  return (
    <View
      style={[
        styles.rideCard,
        {
          backgroundColor: themeColors.cardBackground,
          borderColor: themeColors.border,
        },
        Shadows.card,
      ]}
    >
      {/* ── Header ── */}
      <View style={styles.rideHeader}>
        <View style={styles.rideHeaderLeft}>
          <Badge status={ride.status} size="sm" />
          <View style={styles.rideDateTime}>
            <Ionicons name="calendar-outline" size={12} color={themeColors.textMuted} />
            <Text style={[styles.rideDateText, { color: themeColors.textSecondary }]}>
              {ride.date} · {ride.time}
            </Text>
          </View>
        </View>
        <View style={[styles.shiftChip, { backgroundColor: themeColors.secondaryLight }]}>
          <Ionicons
            name={ride.shiftType === 'PICKUP' ? 'arrow-up' : 'arrow-down'}
            size={11}
            color={themeColors.secondary}
          />
          <Text style={[styles.shiftLabel, { color: themeColors.secondary }]}>
            {ride.shiftType === 'PICKUP' ? 'Pickup' : 'Drop'}
          </Text>
        </View>
      </View>

      {/* ── Route ── */}
      <LocationCard pickup={ride.pickup} drop={ride.drop} />

      {/* ── OTP ── */}
      {ride.otp && ride.status === 'IN_TRANSIT' && (
        <View style={[styles.otpBanner, { backgroundColor: themeColors.secondaryLight }]}>
          <View style={styles.otpLeft}>
            <Ionicons name="key" size={14} color={themeColors.secondary} />
            <Text style={[styles.otpLabel, { color: themeColors.secondary }]}>OTP</Text>
          </View>
          <Text style={[styles.otpCode, { color: themeColors.text }]}>{ride.otp}</Text>
        </View>
      )}

      {/* ── Metrics ── */}
      <View style={[styles.metricsRow, { borderTopColor: themeColors.borderLight }]}>
        <View style={styles.metricItem}>
          <Ionicons name="navigate-outline" size={13} color={themeColors.textMuted} />
          <Text style={[styles.metricValue, { color: themeColors.textSecondary }]}>
            {ride.estimatedDistanceKm} km
          </Text>
        </View>
        <View style={[styles.metricDivider, { backgroundColor: themeColors.border }]} />
        <View style={styles.metricItem}>
          <Ionicons name="time-outline" size={13} color={themeColors.textMuted} />
          <Text style={[styles.metricValue, { color: themeColors.textSecondary }]}>
            {ride.estimatedDurationMins} min
          </Text>
        </View>
        {ride.coPassengersCount !== undefined && (
          <>
            <View style={[styles.metricDivider, { backgroundColor: themeColors.border }]} />
            <View style={styles.metricItem}>
              <Ionicons name="people-outline" size={13} color={themeColors.textMuted} />
              <Text style={[styles.metricValue, { color: themeColors.textSecondary }]}>
                {ride.coPassengersCount} pax
              </Text>
            </View>
          </>
        )}
      </View>

      {/* ── Actions ── */}
      <View style={styles.actionsRow}>
        {onTrack && ride.status === 'IN_TRANSIT' && (
          <TouchableOpacity
            onPress={onTrack}
            style={[styles.actionBtn, styles.actionPrimary, { backgroundColor: themeColors.secondary }]}
            activeOpacity={0.75}
          >
            <Ionicons name="navigate" size={15} color={themeColors.textInverse || '#FFFFFF'} />
            <Text style={[styles.actionText, { color: themeColors.textInverse || '#FFFFFF' }]}>
              Track
            </Text>
          </TouchableOpacity>
        )}
        {onViewDetails && (
          <TouchableOpacity
            onPress={onViewDetails}
            style={[styles.actionBtn, { backgroundColor: themeColors.backgroundElement }]}
            activeOpacity={0.75}
          >
            <Ionicons name="eye-outline" size={15} color={themeColors.textSecondary} />
            <Text style={[styles.actionText, { color: themeColors.textSecondary }]}>Details</Text>
          </TouchableOpacity>
        )}
        {onCancel && (ride.status === 'SCHEDULED' || ride.status === 'BOARDING') && (
          <TouchableOpacity
            onPress={onCancel}
            style={[styles.actionBtn, { backgroundColor: themeColors.dangerLight }]}
            activeOpacity={0.75}
          >
            <Ionicons name="close-circle-outline" size={15} color={themeColors.danger} />
            <Text style={[styles.actionText, { color: themeColors.danger }]}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// ─── Styles ──────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Driver Card
  driverCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.base,
    marginTop: Spacing.sm,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarRing: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  driverInfo: {
    flex: 1,
    marginLeft: 14,
  },
  driverNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  driverName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.semibold,
    flexShrink: 1,
  },
  verifiedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 10,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  ratingValue: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.bold,
  },
  tripPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  tripValue: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.medium,
  },
  callBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.one,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.base,
    paddingTop: Spacing.base,
    borderTopWidth: 1,
    gap: 10,
  },
  vehicleIconWrap: {
    width: 30,
    height: 30,
    borderRadius: BorderRadius.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleDetails: {
    flex: 1,
  },
  vehicleModel: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.medium,
  },
  vehicleNumber: {
    fontSize: Typography.fontSizes.xs,
    marginTop: 1,
  },

  // Location Card
  locationCard: {
    paddingVertical: Spacing.xs,
  },
  timelineRow: {
    flexDirection: 'row',
  },
  timelineTrack: {
    width: 22,
    alignItems: 'center',
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginVertical: 4,
    borderRadius: 1,
  },
  timelineContent: {
    flex: 1,
    marginLeft: Spacing.one + 2,
  },
  timelineStop: {
    paddingBottom: 2,
  },
  routeDash: {
    width: 0,
    height: 16,
    borderLeftWidth: 1.5,
    borderStyle: 'dashed',
    marginVertical: 6,
    marginLeft: -13,
  },
  stopLabel: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  stopName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.semibold,
    marginBottom: 2,
  },
  stopAddress: {
    fontSize: Typography.fontSizes.sm,
    lineHeight: 18,
  },
  stopTime: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold,
    marginTop: 4,
  },

  // Ride Card
  rideCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.base,
    marginBottom: 12,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  rideHeaderLeft: {
    flex: 1,
    marginRight: Spacing.one,
  },
  rideDateTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
  },
  rideDateText: {
    fontSize: Typography.fontSizes.sm,
  },
  shiftChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  shiftLabel: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.semibold,
  },
  otpBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
  },
  otpLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  otpLabel: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  otpCode: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.weights.bold,
    letterSpacing: 5,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
    marginTop: Spacing.base,
    paddingTop: Spacing.base,
    borderTopWidth: 1,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: Spacing.one,
  },
  metricDivider: {
    width: 1,
    height: 14,
    marginHorizontal: 2,
  },
  metricValue: {
    fontSize: Typography.fontSizes.sm,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: Spacing.base,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base - 2,
    paddingVertical: 9,
    borderRadius: BorderRadius.sm,
    gap: 6,
  },
  actionPrimary: {},
  actionText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold,
  },
});
