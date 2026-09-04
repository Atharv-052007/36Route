import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { Header } from '@/components/ui/Header';
import { StepIndicator } from '@/components/ui/StepIndicator';

const STEP_LABELS = [
  'Pickup & Destination',
  'Date & Time',
  'Passengers',
  'Route Selection',
  'Vehicle Assignment',
  'Driver Assignment',
];

export default function CreateTripScreen() {
  const router = useRouter();
  const { routes, vehicles, drivers, createTrip, setSelectedTripId, isDarkMode } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const [step, setStep] = useState(1);

  // Form State
  const [origin, setOrigin] = useState('Kothrud');
  const [destination, setDestination] = useState('Hinjewadi');
  const [date, setDate] = useState('Today, 4 Sep');
  const [time, setTime] = useState('08:30');
  const [passengerCount, setPassengerCount] = useState('12');
  const [selectedRouteId, setSelectedRouteId] = useState(routes[0]?.id || 'route-1');
  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicles[0]?.id || 'veh-1');
  const [selectedDriverId, setSelectedDriverId] = useState(drivers[0]?.id || 'drv-1');

  const handleNext = () => {
    if (step < 6) {
      setStep(step + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const handleFinalSubmit = async () => {
    try {
      const newTrip = await createTrip({
        origin,
        destination,
        date,
        time,
        passengersCount: parseInt(passengerCount, 10) || 12,
        routeId: selectedRouteId,
        vehicleId: selectedVehicleId,
        driverId: selectedDriverId,
      });

      setSelectedTripId(newTrip.id);
      Alert.alert(
        'Trip Created',
        `${newTrip.tripNumber} (${time} • ${origin} → ${destination}) has been successfully scheduled.`,
        [
          {
            text: 'View Trip Details',
            onPress: () => router.replace('/trip-details'),
          },
          {
            text: 'Go to Trips',
            onPress: () => router.replace('/(admin)/trips'),
          },
        ]
      );
    } catch (e) {
      Alert.alert('Error', 'Unable to create trip. Please check details.');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.cardBackground}
      />

      <Header
        title="Create Trip"
        subtitle={`Step ${step} of 6`}
        showBack
        onBackPress={handlePrev}
      />

      <View style={[styles.indicatorContainer, { backgroundColor: theme.cardBackground }]}>
        <StepIndicator
          currentStep={step}
          totalSteps={6}
          stepLabels={STEP_LABELS}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* STEP 1: Pickup & Destination */}
        {step === 1 && (
          <View
            style={[
              styles.stepCard,
              { backgroundColor: theme.cardBackground, borderColor: theme.border },
            ]}
          >
            <Text style={[styles.stepTitle, { color: theme.text }]}>
              Enter Pickup & Destination
            </Text>
            <Text style={[styles.stepDesc, { color: theme.textSecondary }]}>
              Specify primary origin and end termination points.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>
                Pickup Location
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: theme.backgroundElement,
                    borderColor: theme.border,
                    color: theme.text,
                  },
                ]}
                value={origin}
                onChangeText={setOrigin}
                placeholder="e.g. Kothrud Stand"
                placeholderTextColor={theme.textMuted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>
                Destination
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: theme.backgroundElement,
                    borderColor: theme.border,
                    color: theme.text,
                  },
                ]}
                value={destination}
                onChangeText={setDestination}
                placeholder="e.g. Hinjewadi Phase 1"
                placeholderTextColor={theme.textMuted}
              />
            </View>

            <View style={styles.presetsRow}>
              <Text style={[styles.presetLabel, { color: theme.textMuted }]}>
                Recent:
              </Text>
              {['Kothrud → Hinjewadi', 'Wakad → Baner', 'Hadapsar → Kharadi'].map((p) => (
                <TouchableOpacity
                  key={p}
                  onPress={() => {
                    const parts = p.split('→');
                    setOrigin(parts[0].trim());
                    setDestination(parts[1].trim());
                  }}
                  style={[
                    styles.presetChip,
                    { backgroundColor: theme.backgroundElement, borderColor: theme.border },
                  ]}
                >
                  <Text style={[styles.presetChipText, { color: theme.textSecondary }]}>
                    {p}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* STEP 2: Date & Time */}
        {step === 2 && (
          <View
            style={[
              styles.stepCard,
              { backgroundColor: theme.cardBackground, borderColor: theme.border },
            ]}
          >
            <Text style={[styles.stepTitle, { color: theme.text }]}>
              Schedule Date & Time
            </Text>
            <Text style={[styles.stepDesc, { color: theme.textSecondary }]}>
              Select the departure shift schedule.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>
                Date
              </Text>
              <View style={styles.chipsRow}>
                {['Today, 4 Sep', 'Tomorrow, 5 Sep', 'Custom Date'].map((d) => (
                  <TouchableOpacity
                    key={d}
                    onPress={() => setDate(d)}
                    style={[
                      styles.choiceChip,
                      {
                        backgroundColor:
                          date === d ? theme.primary : theme.backgroundElement,
                        borderColor: date === d ? theme.primary : theme.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.choiceChipText,
                        {
                          color: date === d ? theme.textInverse : theme.textSecondary,
                          fontWeight: date === d ? '600' : '400',
                        },
                      ]}
                    >
                      {d}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>
                Departure Time
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: theme.backgroundElement,
                    borderColor: theme.border,
                    color: theme.text,
                  },
                ]}
                value={time}
                onChangeText={setTime}
                placeholder="e.g. 07:30 or 08:00"
                placeholderTextColor={theme.textMuted}
              />
              <View style={styles.chipsRow}>
                {['07:15', '07:30', '08:00', '08:30', '09:00'].map((t) => (
                  <TouchableOpacity
                    key={t}
                    onPress={() => setTime(t)}
                    style={[
                      styles.timeChip,
                      {
                        backgroundColor:
                          time === t ? theme.accent : theme.backgroundElement,
                        borderColor: time === t ? theme.accent : theme.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.choiceChipText,
                        {
                          color: time === t ? '#FFFFFF' : theme.textSecondary,
                          fontWeight: time === t ? '600' : '400',
                        },
                      ]}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* STEP 3: Passengers */}
        {step === 3 && (
          <View
            style={[
              styles.stepCard,
              { backgroundColor: theme.cardBackground, borderColor: theme.border },
            ]}
          >
            <Text style={[styles.stepTitle, { color: theme.text }]}>
              Expected Passengers
            </Text>
            <Text style={[styles.stepDesc, { color: theme.textSecondary }]}>
              How many employees will ride this trip?
            </Text>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>
                Passenger Count
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: theme.backgroundElement,
                    borderColor: theme.border,
                    color: theme.text,
                    fontSize: Typography.fontSizes.xl,
                    fontWeight: '700',
                  },
                ]}
                value={passengerCount}
                onChangeText={setPassengerCount}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.chipsRow}>
              {['6', '8', '12', '14', '18'].map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setPassengerCount(c)}
                  style={[
                    styles.countChip,
                    {
                      backgroundColor:
                        passengerCount === c ? theme.accent : theme.backgroundElement,
                      borderColor: passengerCount === c ? theme.accent : theme.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.choiceChipText,
                      {
                        color: passengerCount === c ? '#FFFFFF' : theme.textSecondary,
                        fontWeight: passengerCount === c ? '600' : '400',
                      },
                    ]}
                  >
                    {c} seats
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* STEP 4: Route */}
        {step === 4 && (
          <View
            style={[
              styles.stepCard,
              { backgroundColor: theme.cardBackground, borderColor: theme.border },
            ]}
          >
            <Text style={[styles.stepTitle, { color: theme.text }]}>
              Select Route
            </Text>
            <Text style={[styles.stepDesc, { color: theme.textSecondary }]}>
              Standard route with predefined pickup stops.
            </Text>

            {routes.map((r) => {
              const isSelected = selectedRouteId === r.id;
              return (
                <TouchableOpacity
                  key={r.id}
                  activeOpacity={0.7}
                  onPress={() => setSelectedRouteId(r.id)}
                  style={[
                    styles.selectableCard,
                    {
                      backgroundColor: isSelected
                        ? theme.backgroundElement
                        : theme.cardBackground,
                      borderColor: isSelected ? theme.accent : theme.border,
                    },
                  ]}
                >
                  <View style={styles.selectableLeft}>
                    <Ionicons
                      name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                      size={18}
                      color={isSelected ? theme.accent : theme.textMuted}
                    />
                    <View>
                      <Text style={[styles.selectCardTitle, { color: theme.text }]}>
                        {r.name}
                      </Text>
                      <Text style={[styles.selectCardSub, { color: theme.textSecondary }]}>
                        {r.stopsCount} stops • {r.distanceKm} km • ~{r.estimatedMinutes} mins
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* STEP 5: Vehicle */}
        {step === 5 && (
          <View
            style={[
              styles.stepCard,
              { backgroundColor: theme.cardBackground, borderColor: theme.border },
            ]}
          >
            <Text style={[styles.stepTitle, { color: theme.text }]}>
              Select Vehicle
            </Text>
            <Text style={[styles.stepDesc, { color: theme.textSecondary }]}>
              Fleet vehicles matching capacity requirements ({passengerCount} seats).
            </Text>

            {vehicles
              .filter((v) => v.status !== 'Maintenance')
              .map((v) => {
                const isSelected = selectedVehicleId === v.id;
                return (
                  <TouchableOpacity
                    key={v.id}
                    activeOpacity={0.7}
                    onPress={() => setSelectedVehicleId(v.id)}
                    style={[
                      styles.selectableCard,
                      {
                        backgroundColor: isSelected
                          ? theme.backgroundElement
                          : theme.cardBackground,
                        borderColor: isSelected ? theme.accent : theme.border,
                      },
                    ]}
                  >
                    <View style={styles.selectableLeft}>
                      <Ionicons
                        name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                        size={18}
                        color={isSelected ? theme.accent : theme.textMuted}
                      />
                      <View>
                        <Text style={[styles.selectCardTitle, { color: theme.text }]}>
                          {v.model} ({v.plateNumber})
                        </Text>
                        <Text style={[styles.selectCardSub, { color: theme.textSecondary }]}>
                          Capacity: {v.capacity} • Status: {v.status}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
          </View>
        )}

        {/* STEP 6: Driver */}
        {step === 6 && (
          <View
            style={[
              styles.stepCard,
              { backgroundColor: theme.cardBackground, borderColor: theme.border },
            ]}
          >
            <Text style={[styles.stepTitle, { color: theme.text }]}>
              Select Driver
            </Text>
            <Text style={[styles.stepDesc, { color: theme.textSecondary }]}>
              Choose an available driver or confirm dispatch.
            </Text>

            {drivers
              .filter((d) => d.status !== 'Unavailable')
              .map((d, index) => {
                const isSelected = selectedDriverId === d.id;
                return (
                  <TouchableOpacity
                    key={d.id}
                    activeOpacity={0.7}
                    onPress={() => setSelectedDriverId(d.id)}
                    style={[
                      styles.selectableCard,
                      {
                        backgroundColor: isSelected
                          ? theme.backgroundElement
                          : theme.cardBackground,
                        borderColor: isSelected ? theme.accent : theme.border,
                      },
                    ]}
                  >
                    <View style={styles.selectableLeft}>
                      <Ionicons
                        name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                        size={18}
                        color={isSelected ? theme.accent : theme.textMuted}
                      />
                      <View>
                        <View style={styles.driverNameRank}>
                          <Text style={[styles.selectCardTitle, { color: theme.text }]}>
                            {d.name}
                          </Text>
                          {index === 0 && (
                            <View style={[styles.recTag, { backgroundColor: theme.availableLight }]}>
                              <Text style={[styles.recTagText, { color: theme.available }]}>
                                Recommended
                              </Text>
                            </View>
                          )}
                        </View>
                        <Text style={[styles.selectCardSub, { color: theme.textSecondary }]}>
                          {d.status} • {d.assignedVehicleModel} • On-time: {d.onTimePerformance}%
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
          </View>
        )}

        {/* Action Controls */}
        <View style={styles.bottomControls}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleNext}
            style={[styles.nextBtn, { backgroundColor: theme.primary }]}
          >
            <Text style={styles.nextBtnText}>
              {step === 6 ? 'Create Trip' : 'Continue'}
            </Text>
            <Ionicons
              name={step === 6 ? 'checkmark-circle' : 'arrow-forward'}
              size={18}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  indicatorContainer: {
    paddingHorizontal: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.15)',
  },
  scrollContent: {
    padding: Spacing.base,
    paddingBottom: Spacing.xxl,
  },
  stepCard: {
    padding: Spacing.base,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.lg,
    ...Shadows.subtle,
  },
  stepTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.weights.bold,
    marginBottom: 4,
  },
  stepDesc: {
    fontSize: Typography.fontSizes.sm,
    marginBottom: Spacing.base,
  },
  inputGroup: {
    marginBottom: Spacing.base,
  },
  label: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.medium,
    marginBottom: 6,
  },
  textInput: {
    height: 48,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    fontSize: Typography.fontSizes.base,
  },
  presetsRow: {
    marginTop: Spacing.sm,
  },
  presetLabel: {
    fontSize: Typography.fontSizes.xs,
    marginBottom: 6,
  },
  presetChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    marginBottom: 6,
  },
  presetChipText: {
    fontSize: Typography.fontSizes.xs + 1,
    fontWeight: Typography.weights.medium,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs + 2,
    marginTop: 6,
  },
  choiceChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  choiceChipText: {
    fontSize: Typography.fontSizes.xs + 1,
  },
  timeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  countChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  selectableCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  selectableLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  selectCardTitle: {
    fontSize: Typography.fontSizes.sm + 1,
    fontWeight: Typography.weights.bold,
  },
  selectCardSub: {
    fontSize: Typography.fontSizes.xs,
    marginTop: 2,
  },
  driverNameRank: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  recTagText: {
    fontSize: 10,
    fontWeight: '700',
  },
  bottomControls: {
    marginTop: Spacing.xs,
  },
  nextBtn: {
    height: 48,
    borderRadius: BorderRadius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: Typography.fontSizes.base,
    fontWeight: Typography.weights.semibold,
  },
});
