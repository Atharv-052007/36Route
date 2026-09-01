import React, { useState } from 'react';
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
import { useRouter } from 'expo-router';
import { useApp } from '../context/AppContext';
import { Typography, Shadows } from '../constants/theme';
import { AppInput } from '../components/ui/AppInput';
import { AppButton } from '../components/ui/AppButton';
import { ShiftType } from '../types';

export default function BookRideScreen() {
  const router = useRouter();
  const { employee, bookRide, themeColors } = useApp();

  const [shiftType, setShiftType] = useState<ShiftType>('PICKUP');
  const [date, setDate] = useState('Tomorrow, 2 Sep 2026');
  const [time, setTime] = useState(shiftType === 'PICKUP' ? '08:30 AM' : '06:30 PM');
  const [pickup, setPickup] = useState(
    shiftType === 'PICKUP' ? employee?.defaultPickup || '' : employee?.defaultDrop || ''
  );
  const [drop, setDrop] = useState(
    shiftType === 'PICKUP' ? employee?.defaultDrop || '' : employee?.defaultPickup || ''
  );
  const [loading, setLoading] = useState(false);

  const handleShiftChange = (type: ShiftType) => {
    setShiftType(type);
    if (type === 'PICKUP') {
      setTime('08:30 AM');
      setPickup(employee?.defaultPickup || '');
      setDrop(employee?.defaultDrop || '');
    } else {
      setTime('06:30 PM');
      setPickup(employee?.defaultDrop || '');
      setDrop(employee?.defaultPickup || '');
    }
  };

  const handleConfirmBooking = async () => {
    if (!pickup || !drop) {
      Alert.alert('Error', 'Please fill pickup and drop locations');
      return;
    }

    try {
      setLoading(true);
      await bookRide({
        date,
        time,
        shiftType,
        pickupAddress: pickup,
        dropAddress: drop,
      });
      setLoading(false);
      Alert.alert('Success 🎉', 'Your corporate commute cab has been booked!', [
        {
          text: 'View Schedule',
          onPress: () => router.replace('/(tabs)/rides'),
        },
      ]);
    } catch (err: any) {
      setLoading(false);
      Alert.alert('Booking Error', err.message || 'Failed to book ride');
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Top Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={themeColors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: themeColors.text }]}>Book Shift Commute</Text>
        </View>

        {/* Shift Type Toggle */}
        <View style={[styles.shiftToggle, { backgroundColor: themeColors.borderLight }]}>
          <TouchableOpacity
            style={[
              styles.shiftBtn,
              shiftType === 'PICKUP' && { backgroundColor: themeColors.cardBackground },
              Shadows.small,
            ]}
            onPress={() => handleShiftChange('PICKUP')}
          >
            <Ionicons
              name="sunny-outline"
              size={18}
              color={shiftType === 'PICKUP' ? themeColors.primary : themeColors.textSecondary}
            />
            <Text
              style={[
                styles.shiftBtnText,
                {
                  color: shiftType === 'PICKUP' ? themeColors.primary : themeColors.textSecondary,
                },
              ]}
            >
              Morning Pickup
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.shiftBtn,
              shiftType === 'DROP' && { backgroundColor: themeColors.cardBackground },
              Shadows.small,
            ]}
            onPress={() => handleShiftChange('DROP')}
          >
            <Ionicons
              name="moon-outline"
              size={18}
              color={shiftType === 'DROP' ? themeColors.primary : themeColors.textSecondary}
            />
            <Text
              style={[
                styles.shiftBtnText,
                { color: shiftType === 'DROP' ? themeColors.primary : themeColors.textSecondary },
              ]}
            >
              Evening Drop
            </Text>
          </TouchableOpacity>
        </View>

        {/* Booking Form Card */}
        <View
          style={[
            styles.card,
            { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border },
            Shadows.medium,
          ]}
        >
          <Text style={[styles.cardTitle, { color: themeColors.text }]}>Commute Details</Text>

          <AppInput
            label="Schedule Date"
            value={date}
            onChangeText={setDate}
            leftIcon={<Ionicons name="calendar-outline" size={20} color={themeColors.primary} />}
          />

          <AppInput
            label="Shift Time Slot"
            value={time}
            onChangeText={setTime}
            leftIcon={<Ionicons name="time-outline" size={20} color={themeColors.primary} />}
          />

          <AppInput
            label="Pickup Address"
            value={pickup}
            onChangeText={setPickup}
            multiline
            leftIcon={
              <Ionicons name="ellipse" size={14} color={themeColors.accent} style={{ margin: 3 }} />
            }
          />

          <AppInput
            label="Drop Address"
            value={drop}
            onChangeText={setDrop}
            multiline
            leftIcon={<Ionicons name="location" size={20} color={themeColors.primary} />}
          />
        </View>

        {/* Summary Card */}
        <View
          style={[
            styles.summaryCard,
            { backgroundColor: themeColors.primaryLight, borderColor: themeColors.border },
          ]}
        >
          <View style={styles.summaryRow}>
            <Ionicons name="information-circle-outline" size={20} color={themeColors.primary} />
            <Text style={[styles.summaryText, { color: themeColors.primary }]}>
              Roster Policy: Cancellations and schedule changes are permitted up to 2 hours prior to
              pickup time.
            </Text>
          </View>
        </View>

        <AppButton
          title="Confirm & Request Ride"
          onPress={handleConfirmBooking}
          loading={loading}
          size="lg"
          style={{ marginTop: 20 }}
        />
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
  shiftToggle: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
    marginBottom: 18,
  },
  shiftBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },
  shiftBtnText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.bold as any,
    marginLeft: 6,
  },
  card: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.bold as any,
    marginBottom: 14,
  },
  summaryCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryText: {
    flex: 1,
    fontSize: Typography.fontSizes.xs,
    marginLeft: 8,
    lineHeight: 18,
  },
});
