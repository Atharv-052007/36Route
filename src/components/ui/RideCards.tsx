import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { Typography, BorderRadius, Shadows } from '../../constants/theme';
import { Ride, Driver, Vehicle, LocationCoordinate } from '../../types';
import { StatusBadge } from './AppStates';

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
        Shadows.small,
      ]}
    >
      <View style={styles.driverRow}>
        <Image
          source={{ uri: driver.photoUrl || 'https://via.placeholder.com/150' }}
          style={styles.driverAvatar}
        />
        <View style={styles.driverInfo}>
          <View style={styles.driverNameRow}>
            <Text style={[styles.driverName, { color: themeColors.text }]}>{driver.name}</Text>
            {driver.verificationStatus === 'VERIFIED' && (
              <Ionicons name="checkmark-circle" size={14} color={themeColors.accent} />
            )}
          </View>
          <View style={styles.driverMeta}>
            {driver.rating && (
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={12} color="#D99A2B" />
                <Text style={[styles.ratingText, { color: themeColors.text }]}>{driver.rating}</Text>
              </View>
            )}
            {driver.totalTrips && (
              <Text style={[styles.tripCount, { color: themeColors.textMuted }]}>
                {driver.totalTrips} trips
              </Text>
            )}
          </View>
        </View>
        {onCall && (
          <TouchableOpacity
            onPress={onCall}
            style={[styles.callBtn, { backgroundColor: themeColors.accentLight }]}
            activeOpacity={0.7}
          >
            <Ionicons name="call" size={18} color={themeColors.accent} />
          </TouchableOpacity>
        )}
      </View>
      {vehicle && (
        <View style={[styles.vehicleRow, { borderTopColor: themeColors.borderLight }]}>
          <Ionicons name="car-sport" size={16} color={themeColors.textMuted} />
          <Text style={[styles.vehicleText, { color: themeColors.textSecondary }]}>
            {vehicle.model} • {vehicle.vehicleNumber}
          </Text>
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
        <View style={styles.timelineLeft}>
          <View style={[styles.timelineDot, { backgroundColor: themeColors.accent }]} />
          <View style={[styles.timelineLine, { backgroundColor: themeColors.border }]} />
          <View style={[styles.timelineDot, { backgroundColor: themeColors.secondary }]} />
        </View>
        <View style={styles.timelineContent}>
          <View style={styles.timelineItem}>
            <Text style={[styles.locationLabel, { color: themeColors.textMuted }]}>Pickup</Text>
            <Text style={[styles.locationName, { color: themeColors.text }]}>{pickup.name}</Text>
            <Text style={[styles.locationAddress, { color: themeColors.textSecondary }]} numberOfLines={1}>
              {pickup.address}
            </Text>
            {pickupTime && (
              <Text style={[styles.locationTime, { color: themeColors.accent }]}>{pickupTime}</Text>
            )}
          </View>
          <View style={[styles.timelineDivider, { borderColor: themeColors.borderLight }]} />
          <View style={styles.timelineItem}>
            <Text style={[styles.locationLabel, { color: themeColors.textMuted }]}>Drop</Text>
            <Text style={[styles.locationName, { color: themeColors.text }]}>{drop.name}</Text>
            <Text style={[styles.locationAddress, { color: themeColors.textSecondary }]} numberOfLines={1}>
              {drop.address}
            </Text>
            {dropTime && (
              <Text style={[styles.locationTime, { color: themeColors.secondary }]}>{dropTime}</Text>
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
        Shadows.small,
      ]}
    >
      <View style={styles.rideHeader}>
        <View style={styles.rideHeaderLeft}>
          <StatusBadge status={ride.status} size="sm" />
          <Text style={[styles.rideDate, { color: themeColors.textSecondary }]}>
            {ride.date} • {ride.time}
          </Text>
        </View>
        <View style={[styles.shiftBadge, { backgroundColor: themeColors.secondaryLight }]}>
          <Ionicons
            name={ride.shiftType === 'PICKUP' ? 'arrow-up' : 'arrow-down'}
            size={12}
            color={themeColors.secondary}
          />
          <Text style={[styles.shiftText, { color: themeColors.secondary }]}>
            {ride.shiftType === 'PICKUP' ? 'Pickup' : 'Drop'}
          </Text>
        </View>
      </View>

      <LocationCard
        pickup={ride.pickup}
        drop={ride.drop}
      />

      {ride.otp && ride.status === 'IN_TRANSIT' && (
        <View style={[styles.otpRow, { backgroundColor: themeColors.backgroundElement }]}>
          <Ionicons name="key" size={16} color={themeColors.secondary} />
          <Text style={[styles.otpLabel, { color: themeColors.textSecondary }]}>OTP</Text>
          <Text style={[styles.otpValue, { color: themeColors.text }]}>{ride.otp}</Text>
        </View>
      )}

      <View style={styles.rideMetrics}>
        <View style={styles.metric}>
          <Ionicons name="map-outline" size={14} color={themeColors.textMuted} />
          <Text style={[styles.metricText, { color: themeColors.textSecondary }]}>
            {ride.estimatedDistanceKm} km
          </Text>
        </View>
        <View style={styles.metric}>
          <Ionicons name="time-outline" size={14} color={themeColors.textMuted} />
          <Text style={[styles.metricText, { color: themeColors.textSecondary }]}>
            {ride.estimatedDurationMins} min
          </Text>
        </View>
        {ride.coPassengersCount !== undefined && (
          <View style={styles.metric}>
            <Ionicons name="people-outline" size={14} color={themeColors.textMuted} />
            <Text style={[styles.metricText, { color: themeColors.textSecondary }]}>
              {ride.coPassengersCount} co-passengers
            </Text>
          </View>
        )}
      </View>

      <View style={styles.rideActions}>
        {onTrack && ride.status === 'IN_TRANSIT' && (
          <TouchableOpacity
            onPress={onTrack}
            style={[styles.rideActionBtn, { backgroundColor: themeColors.secondaryLight }]}
            activeOpacity={0.7}
          >
            <Ionicons name="navigate" size={16} color={themeColors.secondary} />
            <Text style={[styles.rideActionText, { color: themeColors.secondary }]}>Track</Text>
          </TouchableOpacity>
        )}
        {onViewDetails && (
          <TouchableOpacity
            onPress={onViewDetails}
            style={[styles.rideActionBtn, { backgroundColor: themeColors.backgroundElement }]}
            activeOpacity={0.7}
          >
            <Ionicons name="eye-outline" size={16} color={themeColors.textSecondary} />
            <Text style={[styles.rideActionText, { color: themeColors.textSecondary }]}>Details</Text>
          </TouchableOpacity>
        )}
        {onCancel && (ride.status === 'SCHEDULED' || ride.status === 'BOARDING') && (
          <TouchableOpacity
            onPress={onCancel}
            style={[styles.rideActionBtn, { backgroundColor: themeColors.dangerLight }]}
            activeOpacity={0.7}
          >
            <Ionicons name="close-circle-outline" size={16} color={themeColors.danger} />
            <Text style={[styles.rideActionText, { color: themeColors.danger }]}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Driver Card
  driverCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: 16,
    marginTop: 10,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  driverInfo: {
    flex: 1,
    marginLeft: 12,
  },
  driverNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  driverName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.semibold as any,
  },
  driverMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 10,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold as any,
  },
  tripCount: {
    fontSize: Typography.fontSizes.xs,
  },
  callBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    gap: 8,
  },
  vehicleText: {
    fontSize: Typography.fontSizes.sm,
  },

  // Location Card
  locationCard: {
    paddingVertical: 8,
  },
  timelineRow: {
    flexDirection: 'row',
  },
  timelineLeft: {
    width: 24,
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
    marginLeft: 12,
  },
  timelineItem: {
    paddingBottom: 8,
  },
  timelineDivider: {
    borderTopWidth: 1,
    borderStyle: 'dashed',
    marginVertical: 8,
  },
  locationLabel: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.medium as any,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  locationName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.semibold as any,
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: Typography.fontSizes.sm,
    lineHeight: 18,
  },
  locationTime: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold as any,
    marginTop: 4,
  },

  // Ride Card
  rideCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: 16,
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
  },
  rideDate: {
    fontSize: Typography.fontSizes.sm,
    marginTop: 6,
  },
  shiftBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  shiftText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.semibold as any,
  },
  otpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: BorderRadius.sm,
    marginTop: 8,
    gap: 8,
  },
  otpLabel: {
    fontSize: Typography.fontSizes.sm,
  },
  otpValue: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.weights.bold as any,
    letterSpacing: 4,
    marginLeft: 'auto',
  },
  rideMetrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E8E3',
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricText: {
    fontSize: Typography.fontSizes.sm,
  },
  rideActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  rideActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.sm,
    gap: 6,
  },
  rideActionText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold as any,
  },
});
