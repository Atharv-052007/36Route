import React, { useState } from 'react';
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
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { Typography, BorderRadius, Shadows } from '@/constants/theme';
import { AppInput } from '@/components/ui/AppInput';
import { AppButton } from '@/components/ui/AppButton';
import { ShiftType } from '@/types';

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

  const toggleShift = () => {
    const newType = shiftType === 'PICKUP' ? 'DROP' : 'PICKUP';
    setShiftType(newType);
    if (newType === 'DROP') {
      setTime('06:30 PM');
      setPickup('36Route Tech Park, Electronic City');
      setDrop('Kothrud, Pune');
    } else {
      setTime('08:30 AM');
      setPickup('Kothrud, Pune');
      setDrop('36Route Tech Park, Electronic City');
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
          { text: 'OK', onPress: () => router.back() },
        ]
      );
    } catch (e) {
      Alert.alert('Error', 'Failed to book ride');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppSafeAreaView style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backBtn, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}
          >
            <Ionicons name="arrow-back" size={20} color={themeColors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: themeColors.text }]}>Book a Ride</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Shift Toggle */}
        <View style={[styles.shiftToggle, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
          <TouchableOpacity
            onPress={() => shiftType !== 'PICKUP' && toggleShift()}
            style={[
              styles.shiftBtn,
              shiftType === 'PICKUP' && { backgroundColor: themeColors.secondary },
            ]}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-up"
              size={16}
              color={shiftType === 'PICKUP' ? '#FFFFFF' : themeColors.textSecondary}
            />
            <Text
              style={[
                styles.shiftBtnText,
                { color: shiftType === 'PICKUP' ? '#FFFFFF' : themeColors.textSecondary },
              ]}
            >
              Morning Pickup
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => shiftType !== 'DROP' && toggleShift()}
            style={[
              styles.shiftBtn,
              shiftType === 'DROP' && { backgroundColor: themeColors.secondary },
            ]}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-down"
              size={16}
              color={shiftType === 'DROP' ? '#FFFFFF' : themeColors.textSecondary}
            />
            <Text
              style={[
                styles.shiftBtnText,
                { color: shiftType === 'DROP' ? '#FFFFFF' : themeColors.textSecondary },
              ]}
            >
              Evening Drop
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={[styles.formCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }, Shadows.small]}>
          <AppInput
            label="Date"
            value={date}
            onChangeText={setDate}
            placeholder="Select date"
            leftIcon={<Ionicons name="calendar-outline" size={18} color={themeColors.textMuted} />}
            error={errors.date}
          />

          <AppInput
            label="Time"
            value={time}
            onChangeText={setTime}
            placeholder="Select time"
            leftIcon={<Ionicons name="time-outline" size={18} color={themeColors.textMuted} />}
            error={errors.time}
          />

          <AppInput
            label="Pickup Location"
            value={pickup}
            onChangeText={setPickup}
            placeholder="Enter pickup address"
            leftIcon={<Ionicons name="location-outline" size={18} color={themeColors.accent} />}
            error={errors.pickup}
          />

          <AppInput
            label="Drop Location"
            value={drop}
            onChangeText={setDrop}
            placeholder="Enter drop address"
            leftIcon={<Ionicons name="location" size={18} color={themeColors.secondary} />}
            error={errors.drop}
          />

          {/* Route Selection */}
          {routes.length > 0 && (
            <View style={{ marginBottom: 16 }}>
              <Text style={[styles.routeLabel, { color: themeColors.textSecondary }]}>Available Routes</Text>
              <View style={styles.routeList}>
                {routes.map((route) => (
                  <TouchableOpacity
                    key={route.id}
                    onPress={() => setSelectedRoute(route.id)}
                    style={[
                      styles.routeOption,
                      {
                        backgroundColor: selectedRoute === route.id ? themeColors.secondaryLight : themeColors.backgroundElement,
                        borderColor: selectedRoute === route.id ? themeColors.secondary : themeColors.border,
                      },
                    ]}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={selectedRoute === route.id ? 'radio-button-on' : 'radio-button-off'}
                      size={18}
                      color={selectedRoute === route.id ? themeColors.secondary : themeColors.textMuted}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.routeName, { color: themeColors.text }]}>{route.name}</Text>
                      <Text style={[styles.routeDetail, { color: themeColors.textSecondary }]}>
                        {route.startingPoint} → {route.destination} • {route.distance} km
                      </Text>
                    </View>
                    <Text style={[styles.routeCapacity, { color: themeColors.textMuted }]}>
                      {route.occupiedSeats}/{route.capacity}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Policy */}
        <View style={[styles.policyCard, { backgroundColor: themeColors.backgroundElement }]}>
          <Ionicons name="information-circle-outline" size={16} color={themeColors.textMuted} />
          <Text style={[styles.policyText, { color: themeColors.textSecondary }]}>
            Cancellations permitted up to 2 hours before scheduled time.
          </Text>
        </View>

        <AppButton
          title="Confirm Booking"
          onPress={handleBook}
          loading={loading}
          size="lg"
          style={{ marginTop: 8 }}
        />
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
    marginBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.weights.bold as any,
  },
  shiftToggle: {
    flexDirection: 'row',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: 4,
    marginBottom: 16,
  },
  shiftBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: BorderRadius.sm,
    gap: 6,
  },
  shiftBtnText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold as any,
  },
  formCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  routeLabel: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.medium as any,
    marginBottom: 8,
  },
  routeList: { gap: 8 },
  routeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    gap: 10,
  },
  routeName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.semibold as any,
  },
  routeDetail: { fontSize: Typography.fontSizes.xs, marginTop: 2 },
  routeCapacity: { fontSize: Typography.fontSizes.xs },
  policyCard: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: BorderRadius.sm,
    gap: 8,
    marginBottom: 16,
  },
  policyText: { fontSize: Typography.fontSizes.xs, flex: 1, lineHeight: 18 },
});
