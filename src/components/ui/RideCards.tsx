import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { Ride, RideStatus, Driver, Vehicle } from '../../types';
import { Typography, Shadows } from '../../constants/theme';
import { AppButton } from './AppButton';

// 1. StatusBadge Component
export const StatusBadge: React.FC<{ status: RideStatus }> = ({ status }) => {
  const { themeColors } = useApp();

  const getStatusColor = () => {
    switch (status) {
      case 'IN_TRANSIT':
      case 'BOARDING':
        return { bg: themeColors.primaryLight, text: themeColors.primary };
      case 'SCHEDULED':
        return { bg: themeColors.secondaryLight, text: themeColors.secondary };
      case 'COMPLETED':
      case 'ARRIVED':
        return { bg: themeColors.accentLight, text: themeColors.accent };
      case 'CANCELLED':
        return { bg: themeColors.dangerLight, text: themeColors.danger };
      default:
        return { bg: themeColors.borderLight, text: themeColors.textSecondary };
    }
  };

  const { bg, text } = getStatusColor();

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <View style={[styles.badgeDot, { backgroundColor: text }]} />
      <Text style={[styles.badgeText, { color: text }]}>{status.replace('_', ' ')}</Text>
    </View>
  );
};

// 2. DriverCard Component
export const DriverCard: React.FC<{ driver: Driver; vehicle?: Vehicle; onCall?: () => void }> = ({
  driver,
  vehicle,
  onCall,
}) => {
  const { themeColors } = useApp();

  return (
    <View
      style={[
        styles.driverCardContainer,
        { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border },
        Shadows.small,
      ]}
    >
      <View style={styles.driverInfoRow}>
        <Image
          source={{ uri: driver.photoUrl }}
          style={styles.avatar}
          defaultSource={{ uri: 'https://via.placeholder.com/150' }}
        />
        <View style={styles.driverDetails}>
          <Text style={[styles.driverName, { color: themeColors.text }]}>{driver.name}</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color="#F59E0B" />
            <Text style={[styles.ratingText, { color: themeColors.textSecondary }]}>
              {driver.rating} • {driver.totalTrips} Trips
            </Text>
            {driver.vaccinated && (
              <View style={[styles.vacBadge, { backgroundColor: themeColors.accentLight }]}>
                <Ionicons name="shield-checkmark" size={10} color={themeColors.accent} />
                <Text style={[styles.vacText, { color: themeColors.accent }]}>Verified</Text>
              </View>
            )}
          </View>
        </View>
        {onCall && (
          <TouchableOpacity
            style={[styles.callBtn, { backgroundColor: themeColors.accentLight }]}
            onPress={onCall}
          >
            <Ionicons name="call-outline" size={20} color={themeColors.accent} />
          </TouchableOpacity>
        )}
      </View>

      {vehicle && (
        <View style={[styles.vehicleRow, { borderTopColor: themeColors.border }]}>
          <Ionicons name="car-outline" size={18} color={themeColors.primary} />
          <Text style={[styles.vehicleModel, { color: themeColors.text }]}>{vehicle.model}</Text>
          <View style={[styles.plateBadge, { backgroundColor: themeColors.borderLight }]}>
            <Text style={[styles.plateText, { color: themeColors.text }]}>
              {vehicle.numberPlate}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

// 3. LocationCard / Route timeline
export const LocationCard: React.FC<{
  pickup: string;
  drop: string;
  pickupTime?: string;
  dropTime?: string;
}> = ({ pickup, drop, pickupTime, dropTime }) => {
  const { themeColors } = useApp();

  return (
    <View style={styles.locationContainer}>
      {/* Pickup Row */}
      <View style={styles.locRow}>
        <View style={styles.iconCol}>
          <View style={[styles.pinCircle, { backgroundColor: themeColors.accentLight }]}>
            <View style={[styles.pinInner, { backgroundColor: themeColors.accent }]} />
          </View>
          <View style={[styles.verticalLine, { backgroundColor: themeColors.border }]} />
        </View>
        <View style={styles.textCol}>
          <Text style={[styles.locLabel, { color: themeColors.textMuted }]}>PICKUP</Text>
          <Text style={[styles.locAddress, { color: themeColors.text }]} numberOfLines={2}>
            {pickup}
          </Text>
        </View>
        {pickupTime && (
          <Text style={[styles.timeText, { color: themeColors.primary }]}>{pickupTime}</Text>
        )}
      </View>

      {/* Drop Row */}
      <View style={styles.locRow}>
        <View style={styles.iconCol}>
          <View style={[styles.pinCircle, { backgroundColor: themeColors.primaryLight }]}>
            <Ionicons name="location" size={12} color={themeColors.primary} />
          </View>
        </View>
        <View style={styles.textCol}>
          <Text style={[styles.locLabel, { color: themeColors.textMuted }]}>DROP</Text>
          <Text style={[styles.locAddress, { color: themeColors.text }]} numberOfLines={2}>
            {drop}
          </Text>
        </View>
        {dropTime && (
          <Text style={[styles.timeText, { color: themeColors.textSecondary }]}>{dropTime}</Text>
        )}
      </View>
    </View>
  );
};

// 4. RideCard Component
export const RideCard: React.FC<{
  ride: Ride;
  onTrack?: () => void;
  onViewDetails?: () => void;
  onCancel?: () => void;
}> = ({ ride, onTrack, onViewDetails, onCancel }) => {
  const { themeColors } = useApp();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border },
        Shadows.medium,
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.shiftBadge}>
          <Ionicons
            name={ride.shiftType === 'PICKUP' ? 'sunny-outline' : 'moon-outline'}
            size={14}
            color={themeColors.primary}
          />
          <Text style={[styles.shiftText, { color: themeColors.primary }]}>
            {ride.shiftType === 'PICKUP' ? 'Morning Pickup' : 'Evening Drop'}
          </Text>
        </View>
        <StatusBadge status={ride.status} />
      </View>

      <View style={styles.dateTimeRow}>
        <Text style={[styles.dateText, { color: themeColors.text }]}>{ride.date}</Text>
        <Text style={[styles.dotText, { color: themeColors.textMuted }]}>•</Text>
        <Text style={[styles.timeTextBold, { color: themeColors.primary }]}>{ride.time}</Text>
      </View>

      <LocationCard pickup={ride.pickup.address} drop={ride.drop.address} />

      {ride.otp && (
        <View style={[styles.otpRow, { backgroundColor: themeColors.primaryLight }]}>
          <Text style={[styles.otpLabel, { color: themeColors.primary }]}>Cab Pass OTP:</Text>
          <Text style={[styles.otpValue, { color: themeColors.primary }]}>{ride.otp}</Text>
        </View>
      )}

      <View style={styles.cardActions}>
        {onTrack && ride.status === 'IN_TRANSIT' && (
          <AppButton
            title="Track Ride"
            onPress={onTrack}
            variant="primary"
            size="sm"
            icon={<Ionicons name="navigate-outline" size={14} color="#FFF" />}
            style={{ flex: 1, marginRight: 8 }}
          />
        )}
        {onViewDetails && (
          <AppButton
            title="Details"
            onPress={onViewDetails}
            variant="secondary"
            size="sm"
            style={{ flex: 1, marginRight: onCancel ? 8 : 0 }}
          />
        )}
        {onCancel && (ride.status === 'SCHEDULED' || ride.status === 'BOARDING') && (
          <AppButton
            title="Cancel"
            onPress={onCancel}
            variant="outline"
            size="sm"
            textStyle={{ color: themeColors.danger }}
            style={{ borderColor: themeColors.dangerLight }}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  badgeText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.semibold as any,
  },
  driverCardContainer: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginVertical: 8,
  },
  driverInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#CCC',
  },
  driverDetails: {
    flex: 1,
    marginLeft: 12,
  },
  driverName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.semibold as any,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  ratingText: {
    fontSize: Typography.fontSizes.xs,
    marginLeft: 4,
  },
  vacBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8,
  },
  vacText: {
    fontSize: 10,
    fontWeight: Typography.weights.medium as any,
    marginLeft: 2,
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
    paddingTop: 10,
    borderTopWidth: 1,
  },
  vehicleModel: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.medium as any,
    marginLeft: 6,
    flex: 1,
  },
  plateBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  plateText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.bold as any,
  },
  locationContainer: {
    marginVertical: 10,
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconCol: {
    alignItems: 'center',
    width: 24,
  },
  pinCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  verticalLine: {
    width: 2,
    height: 24,
    marginVertical: 2,
  },
  textCol: {
    flex: 1,
    marginLeft: 8,
  },
  locLabel: {
    fontSize: 10,
    fontWeight: Typography.weights.bold as any,
    letterSpacing: 0.5,
  },
  locAddress: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.medium as any,
    marginTop: 2,
  },
  timeText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.semibold as any,
  },
  card: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shiftBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shiftText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.semibold as any,
    marginLeft: 4,
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  dateText: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.bold as any,
  },
  dotText: {
    marginHorizontal: 6,
  },
  timeTextBold: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.bold as any,
  },
  otpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginVertical: 6,
  },
  otpLabel: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.medium as any,
  },
  otpValue: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.bold as any,
    letterSpacing: 2,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
});
