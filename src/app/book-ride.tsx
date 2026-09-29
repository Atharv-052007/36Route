import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { Typography, BorderRadius, Shadows, Spacing } from '@/constants/theme';
import { Header } from '@/components/ui/Header';
import { AppInput } from '@/components/ui/AppInput';
import { AppButton } from '@/components/ui/AppButton';
import { ShiftType } from '@/types';

type ShiftOption = {
  key: ShiftType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  time: string;
};

const SHIFT_OPTIONS: ShiftOption[] = [
  { key: 'PICKUP', label: 'Morning', icon: 'sunny-outline', time: '08:30 AM' },
  { key: 'DROP', label: 'Evening', icon: 'moon-outline', time: '06:30 PM' },
  { key: 'NIGHT', label: 'Night', icon: 'moon', time: '10:00 PM' },
];

export default function BookRideScreen() {
  const router = useRouter();
  const { bookRide, themeColors, routes } = useApp();
  const [shiftType, setShiftType] = useState<ShiftType>('PICKUP');
  const [date, setDate] = useState('Tomorrow, 3 Sep 2026');
  const [time, setTime] = useState('08:30 AM');
  const [pickup, setPickup] = useState('Kothrud, Pune');
  const [drop, setDrop] = useState('36Route Tech Park, Electronic City');
  const [selectedRoute, setSelectedRoute] = useState(routes[0]?.id || '');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleShiftSelect = (option: ShiftOption) => {
    setShiftType(option.key);
    setTime(option.time);
    if (option.key === 'PICKUP') {
      setPickup('Kothrud, Pune');
      setDrop('36Route Tech Park, Electronic City');
    } else {
      setPickup('36Route Tech Park, Electronic City');
      setDrop('Kothrud, Pune');
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!pickup.trim()) newErrors.pickup = 'Pickup location is required';
    if (!drop.trim()) newErrors.drop = 'Drop location is required';
    if (!date.trim()) newErrors.date = 'Date is required';
    if (!time.trim()) newErrors.time = 'Time is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBook = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await bookRide({
        date,
        time,
        shiftType,
        pickupAddress: pickup,
        dropAddress: drop,
        routeId: selectedRoute,
      });
      Alert.alert(
        'Ride Booked!',
        'Your ride has been scheduled successfully.',
        [
          { text: 'View Schedule', onPress: () => router.replace('/(tabs)/rides') },
          { text: 'OK', onPress: () => router.dismissTo('/(tabs)') },
        ]
      );
    } catch (e) {
      Alert.alert('Error', 'Failed to book ride');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <Header
        title="Book a Ride"
        subtitle="Schedule your commute"
        showBack
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Step 1: Shift Type */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.stepBadge, { backgroundColor: themeColors.primary }]}>
              <Text style={styles.stepNumber}>1</Text>
            </View>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Shift Type</Text>
          </View>
          <View style={styles.shiftGrid}>
            {SHIFT_OPTIONS.map((option) => {
              const isActive = shiftType === option.key;
              return (
                <View
                  key={option.key}
                  style={[
                    styles.shiftCard,
                    {
                      backgroundColor: isActive ? themeColors.primaryLight : themeColors.cardBackground,
                      borderColor: isActive ? themeColors.primary : themeColors.border,
                    },
                    isActive && Shadows.small,
                  ]}
                >
                  <Ionicons
                    name={option.icon}
                    size={24}
                    color={isActive ? themeColors.primary : themeColors.textMuted}
                  />
                  <Text
                    style={[
                      styles.shiftLabel,
                      { color: isActive ? themeColors.primary : themeColors.text },
                    ]}
                  >
                    {option.label}
                  </Text>
                  <Text
                    style={[
                      styles.shiftTime,
                      { color: isActive ? themeColors.primary : themeColors.textSecondary },
                    ]}
                  >
                    {option.time}
                  </Text>
                  <Ionicons
                    onPress={() => handleShiftSelect(option)}
                    name={isActive ? 'radio-button-on' : 'radio-button-off'}
                    size={20}
                    color={isActive ? themeColors.primary : themeColors.textMuted}
                  />
                </View>
              );
            })}
          </View>
        </View>

        {/* Step 2: Date & Time */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.stepBadge, { backgroundColor: themeColors.primary }]}>
              <Text style={styles.stepNumber}>2</Text>
            </View>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Date & Time</Text>
          </View>
          <View style={[styles.formCard, { backgroundColor: themeColors.cardBackground }, Shadows.subtle]}>
            <AppInput
              label="Date"
              value={date}
              onChangeText={setDate}
              placeholder="Select date"
              leftIcon={<Ionicons name="calendar-outline" size={18} color={themeColors.primary} />}
              error={errors.date}
            />
            <AppInput
              label="Time"
              value={time}
              onChangeText={setTime}
              placeholder="Select time"
              leftIcon={<Ionicons name="time-outline" size={18} color={themeColors.primary} />}
              error={errors.time}
              containerStyle={{ marginBottom: 0 }}
            />
          </View>
        </View>

        {/* Step 3: Locations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.stepBadge, { backgroundColor: themeColors.primary }]}>
              <Text style={styles.stepNumber}>3</Text>
            </View>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Locations</Text>
          </View>
          <View style={[styles.formCard, { backgroundColor: themeColors.cardBackground }, Shadows.subtle]}>
            <AppInput
              label="Pickup Location"
              value={pickup}
              onChangeText={setPickup}
              placeholder="Enter pickup address"
              leftIcon={<Ionicons name="location-outline" size={18} color={themeColors.accent} />}
              error={errors.pickup}
            />
            <View style={styles.connector}>
              <View style={[styles.connectorLine, { backgroundColor: themeColors.border }]} />
              <Ionicons name="swap-vertical" size={18} color={themeColors.textMuted} />
              <View style={[styles.connectorLine, { backgroundColor: themeColors.border }]} />
            </View>
            <AppInput
              label="Drop Location"
              value={drop}
              onChangeText={setDrop}
              placeholder="Enter drop address"
              leftIcon={<Ionicons name="location" size={18} color={themeColors.secondary} />}
              error={errors.drop}
              containerStyle={{ marginBottom: 0 }}
            />
          </View>
        </View>

        {/* Step 4: Route */}
        {routes.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.stepBadge, { backgroundColor: themeColors.primary }]}>
                <Text style={styles.stepNumber}>4</Text>
              </View>
              <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Select Route</Text>
            </View>
            <View style={styles.routeList}>
              {routes.map((route) => {
                const isActive = selectedRoute === route.id;
                return (
                  <View
                    key={route.id}
                    style={[
                      styles.routeCard,
                      {
                        backgroundColor: isActive ? themeColors.primaryLight : themeColors.cardBackground,
                        borderColor: isActive ? themeColors.primary : themeColors.border,
                      },
                      isActive && Shadows.small,
                    ]}
                  >
                    <Ionicons
                      onPress={() => setSelectedRoute(route.id)}
                      name={isActive ? 'radio-button-on' : 'radio-button-off'}
                      size={20}
                      color={isActive ? themeColors.primary : themeColors.textMuted}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.routeName, { color: themeColors.text }]}>{route.name}</Text>
                      <Text style={[styles.routeDetail, { color: themeColors.textSecondary }]}>
                        {route.startingPoint} → {route.destination}
                      </Text>
                    </View>
                    <View style={[styles.capacityBadge, { backgroundColor: themeColors.backgroundElement }]}>
                      <Text style={[styles.capacityText, { color: themeColors.textSecondary }]}>
                        {route.occupiedSeats}/{route.capacity}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Policy Note */}
        <View style={[styles.policyRow, { backgroundColor: themeColors.primaryLight }]}>
          <Ionicons name="information-circle-outline" size={16} color={themeColors.primary} />
          <Text style={[styles.policyText, { color: themeColors.primary }]}>
            Free cancellation up to 2 hours before departure
          </Text>
        </View>

        {/* Book Button */}
        <AppButton
          title="Confirm Booking"
          onPress={handleBook}
          loading={loading}
          size="lg"
          icon={!loading ? <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" /> : undefined}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    padding: Spacing.base,
    paddingBottom: Spacing.xxl,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm + 2,
  },
  stepBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    color: '#FFFFFF',
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.bold as any,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.weights.semibold as any,
  },
  shiftGrid: {
    gap: Spacing.sm,
  },
  shiftCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    gap: Spacing.sm + 2,
  },
  shiftLabel: {
    flex: 1,
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.semibold as any,
  },
  shiftTime: {
    fontSize: Typography.fontSizes.sm,
    marginRight: Spacing.xs,
  },
  formCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'transparent',
    padding: Spacing.md,
  },
  connector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: -Spacing.xs,
    marginLeft: Spacing.xs,
  },
  connectorLine: {
    flex: 1,
    height: 1,
  },
  routeList: {
    gap: Spacing.sm,
  },
  routeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    gap: Spacing.sm + 2,
  },
  routeName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.semibold as any,
  },
  routeDetail: {
    fontSize: Typography.fontSizes.xs,
    marginTop: 2,
  },
  capacityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  capacityText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.medium as any,
  },
  policyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  policyText: {
    fontSize: Typography.fontSizes.sm,
    flex: 1,
    lineHeight: 20,
  },
});
