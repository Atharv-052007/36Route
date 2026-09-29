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
import { AppButton } from '@/components/ui/AppButton';

const STEP_LABELS = [
  'Pickup & Destination',
  'Date & Time',
  'Passengers',
  'Route Selection',
  'Vehicle Assignment',
  'Driver Assignment',
];

const STEP_ICONS: string[] = [
  'location',
  'calendar',
  'people',
  'map',
  'car',
  'person',
];

export default function CreateTripScreen() {
  const router = useRouter();
  const { routes, vehicles, drivers, createTrip, setSelectedTripId, isDarkMode, themeColors } = useApp();

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
          { text: 'View Trip Details', onPress: () => router.replace('/trip-details') },
          { text: 'Go to Trips', onPress: () => router.replace('/(admin)/trips') },
        ]
      );
    } catch (e) {
      Alert.alert('Error', 'Unable to create trip. Please check details.');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={themeColors.cardBackground}
      />

      <Header
        title="Create Trip"
        subtitle={`Step ${step} of 6`}
        showBack
        onBackPress={handlePrev}
      />

      {/* Step progress bar */}
      <View style={[styles.progressContainer, { backgroundColor: themeColors.cardBackground }]}>
        <View style={styles.stepRow}>
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <View key={s} style={styles.stepCol}>
              <View style={styles.stepDotRow}>
                <View
                  style={[
                    styles.stepDot,
                    {
                      backgroundColor: s <= step ? themeColors.primary : themeColors.backgroundElement,
                      borderColor: s <= step ? themeColors.primary : themeColors.border,
                    },
                  ]}
                >
                  {s < step ? (
                    <Ionicons name="checkmark" size={11} color="#FFFFFF" />
                  ) : (
                    <Text
                      style={[
                        styles.stepDotText,
                        { color: s <= step ? '#FFFFFF' : themeColors.textMuted },
                      ]}
                    >
                      {s}
                    </Text>
                  )}
                </View>
                {s < 6 && (
                  <View
                    style={[
                      styles.stepConnector,
                      { backgroundColor: s < step ? themeColors.primary : themeColors.border },
                    ]}
                  />
                )}
              </View>
              <Text
                style={[
                  styles.stepDotLabel,
                  {
                    color: s === step ? themeColors.text : themeColors.textMuted,
                    fontWeight: s === step ? '600' : '400',
                  },
                ]}
                numberOfLines={1}
              >
                {STEP_LABELS[s - 1]}
              </Text>
            </View>
          ))}
        </View>
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
              { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border },
            ]}
          >
            <View style={styles.stepCardHeader}>
              <View style={[styles.stepCardIcon, { backgroundColor: themeColors.primaryLight }]}>
                <Ionicons name="location" size={20} color={themeColors.primary} />
              </View>
              <View>
                <Text style={[styles.stepTitle, { color: themeColors.text }]}>
                  Pickup & Destination
                </Text>
                <Text style={[styles.stepDesc, { color: themeColors.textSecondary }]}>
                  Specify origin and termination points
                </Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: themeColors.textSecondary }]}>
                Pickup Location
              </Text>
              <View style={[styles.inputWrap, { backgroundColor: themeColors.backgroundElement, borderColor: themeColors.border }]}>
                <Ionicons name="radio-button-on" size={16} color={themeColors.primary} />
                <TextInput
                  style={[styles.textInput, { color: themeColors.text }]}
                  value={origin}
                  onChangeText={setOrigin}
                  placeholder="e.g. Kothrud Stand"
                  placeholderTextColor={themeColors.textMuted}
                />
              </View>
            </View>

            <View style={styles.routeArrow}>
              <View style={[styles.routeArrowLine, { backgroundColor: themeColors.border }]} />
              <Ionicons name="swap-vertical" size={16} color={themeColors.textMuted} />
              <View style={[styles.routeArrowLine, { backgroundColor: themeColors.border }]} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: themeColors.textSecondary }]}>
                Destination
              </Text>
              <View style={[styles.inputWrap, { backgroundColor: themeColors.backgroundElement, borderColor: themeColors.border }]}>
                <Ionicons name="location" size={16} color={themeColors.danger} />
                <TextInput
                  style={[styles.textInput, { color: themeColors.text }]}
                  value={destination}
                  onChangeText={setDestination}
                  placeholder="e.g. Hinjewadi Phase 1"
                  placeholderTextColor={themeColors.textMuted}
                />
              </View>
            </View>

            <View style={styles.presetSection}>
              <Text style={[styles.presetLabel, { color: themeColors.textMuted }]}>
                Recent Routes
              </Text>
              <View style={styles.presetWrap}>
                {['Kothrud → Hinjewadi', 'Wakad → Baner', 'Hadapsar → Kharadi'].map((p) => (
                  <TouchableOpacity
                    key={p}
                    onPress={() => {
                      const parts = p.split('→');
                      setOrigin(parts[0].trim());
                      setDestination(parts[1].trim());
                    }}
                    style={[styles.presetChip, { backgroundColor: themeColors.backgroundElement, borderColor: themeColors.border }]}
                  >
                    <Ionicons name="time-outline" size={13} color={themeColors.textSecondary} />
                    <Text style={[styles.presetChipText, { color: themeColors.textSecondary }]}>{p}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* STEP 2: Date & Time */}
        {step === 2 && (
          <View
            style={[
              styles.stepCard,
              { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border },
            ]}
          >
            <View style={styles.stepCardHeader}>
              <View style={[styles.stepCardIcon, { backgroundColor: themeColors.primaryLight }]}>
                <Ionicons name="calendar" size={20} color={themeColors.primary} />
              </View>
              <View>
                <Text style={[styles.stepTitle, { color: themeColors.text }]}>
                  Schedule Departure
                </Text>
                <Text style={[styles.stepDesc, { color: themeColors.textSecondary }]}>
                  Select the departure shift schedule
                </Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: themeColors.textSecondary }]}>Date</Text>
              <View style={styles.chipGrid}>
                {['Today, 4 Sep', 'Tomorrow, 5 Sep', 'Custom Date'].map((d) => (
                  <TouchableOpacity
                    key={d}
                    onPress={() => setDate(d)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: date === d ? themeColors.primary : themeColors.backgroundElement,
                        borderColor: date === d ? themeColors.primary : themeColors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        {
                          color: date === d ? '#FFFFFF' : themeColors.textSecondary,
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
              <Text style={[styles.inputLabel, { color: themeColors.textSecondary }]}>
                Departure Time
              </Text>
              <View style={[styles.inputWrap, { backgroundColor: themeColors.backgroundElement, borderColor: themeColors.border }]}>
                <Ionicons name="time-outline" size={16} color={themeColors.textMuted} />
                <TextInput
                  style={[styles.textInput, { color: themeColors.text }]}
                  value={time}
                  onChangeText={setTime}
                  placeholder="e.g. 08:30"
                  placeholderTextColor={themeColors.textMuted}
                />
              </View>
              <View style={styles.chipGrid}>
                {['07:15', '07:30', '08:00', '08:30', '09:00'].map((t) => (
                  <TouchableOpacity
                    key={t}
                    onPress={() => setTime(t)}
                    style={[
                      styles.timeChip,
                      {
                        backgroundColor: time === t ? themeColors.accent : themeColors.backgroundElement,
                        borderColor: time === t ? themeColors.accent : themeColors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        {
                          color: time === t ? '#FFFFFF' : themeColors.textSecondary,
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
              { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border },
            ]}
          >
            <View style={styles.stepCardHeader}>
              <View style={[styles.stepCardIcon, { backgroundColor: themeColors.primaryLight }]}>
                <Ionicons name="people" size={20} color={themeColors.primary} />
              </View>
              <View>
                <Text style={[styles.stepTitle, { color: themeColors.text }]}>
                  Passenger Count
                </Text>
                <Text style={[styles.stepDesc, { color: themeColors.textSecondary }]}>
                  How many employees will ride this trip?
                </Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: themeColors.textSecondary }]}>
                Number of Passengers
              </Text>
              <View style={[styles.inputWrap, { backgroundColor: themeColors.backgroundElement, borderColor: themeColors.border }]}>
                <Ionicons name="person-outline" size={16} color={themeColors.textMuted} />
                <TextInput
                  style={[
                    styles.textInput,
                    { color: themeColors.text, fontSize: Typography.fontSizes.xl, fontWeight: '700' },
                  ]}
                  value={passengerCount}
                  onChangeText={setPassengerCount}
                  keyboardType="number-pad"
                />
              </View>
            </View>

            <View style={styles.chipGrid}>
              {['6', '8', '12', '14', '18'].map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setPassengerCount(c)}
                  style={[
                    styles.countChip,
                    {
                      backgroundColor: passengerCount === c ? themeColors.accent : themeColors.backgroundElement,
                      borderColor: passengerCount === c ? themeColors.accent : themeColors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      {
                        color: passengerCount === c ? '#FFFFFF' : themeColors.textSecondary,
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
              { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border },
            ]}
          >
            <View style={styles.stepCardHeader}>
              <View style={[styles.stepCardIcon, { backgroundColor: themeColors.primaryLight }]}>
                <Ionicons name="map" size={20} color={themeColors.primary} />
              </View>
              <View>
                <Text style={[styles.stepTitle, { color: themeColors.text }]}>
                  Select Route
                </Text>
                <Text style={[styles.stepDesc, { color: themeColors.textSecondary }]}>
                  Standard route with predefined pickup stops
                </Text>
              </View>
            </View>

            {routes.map((r) => {
              const isSelected = selectedRouteId === r.id;
              return (
                <TouchableOpacity
                  key={r.id}
                  activeOpacity={0.7}
                  onPress={() => setSelectedRouteId(r.id)}
                  style={[
                    styles.selectCard,
                    {
                      backgroundColor: isSelected ? themeColors.backgroundSelected : 'transparent',
                      borderColor: isSelected ? themeColors.primary : themeColors.border,
                    },
                  ]}
                >
                  <View style={styles.selectCardLeft}>
                    <View
                      style={[
                        styles.radioOuter,
                        { borderColor: isSelected ? themeColors.primary : themeColors.textMuted },
                      ]}
                    >
                      {isSelected && <View style={[styles.radioInner, { backgroundColor: themeColors.primary }]} />}
                    </View>
                    <View style={styles.selectCardInfo}>
                      <Text style={[styles.selectCardTitle, { color: themeColors.text }]}>
                        {r.name}
                      </Text>
                      <View style={styles.selectCardMeta}>
                        <Ionicons name="navigate-outline" size={12} color={themeColors.textMuted} />
                        <Text style={[styles.selectCardSub, { color: themeColors.textSecondary }]}>
                          {r.stopsCount} stops
                        </Text>
                        <Text style={[styles.selectCardDot, { color: themeColors.textMuted }]}>•</Text>
                        <Text style={[styles.selectCardSub, { color: themeColors.textSecondary }]}>
                          {r.distanceKm} km
                        </Text>
                        <Text style={[styles.selectCardDot, { color: themeColors.textMuted }]}>•</Text>
                        <Text style={[styles.selectCardSub, { color: themeColors.textSecondary }]}>
                          ~{r.estimatedMinutes}m
                        </Text>
                      </View>
                    </View>
                  </View>
                  {isSelected && <Ionicons name="checkmark-circle" size={20} color={themeColors.primary} />}
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
              { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border },
            ]}
          >
            <View style={styles.stepCardHeader}>
              <View style={[styles.stepCardIcon, { backgroundColor: themeColors.primaryLight }]}>
                <Ionicons name="car" size={20} color={themeColors.primary} />
              </View>
              <View>
                <Text style={[styles.stepTitle, { color: themeColors.text }]}>
                  Select Vehicle
                </Text>
                <Text style={[styles.stepDesc, { color: themeColors.textSecondary }]}>
                  Fleet vehicles matching {passengerCount} seats
                </Text>
              </View>
            </View>

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
                      styles.selectCard,
                      {
                        backgroundColor: isSelected ? themeColors.backgroundSelected : 'transparent',
                        borderColor: isSelected ? themeColors.primary : themeColors.border,
                      },
                    ]}
                  >
                    <View style={styles.selectCardLeft}>
                      <View
                        style={[
                          styles.radioOuter,
                          { borderColor: isSelected ? themeColors.primary : themeColors.textMuted },
                        ]}
                      >
                        {isSelected && <View style={[styles.radioInner, { backgroundColor: themeColors.primary }]} />}
                      </View>
                      <View style={styles.selectCardInfo}>
                        <Text style={[styles.selectCardTitle, { color: themeColors.text }]}>
                          {v.model}
                        </Text>
                        <Text style={[styles.selectCardSub, { color: themeColors.textSecondary }]}>
                          {v.plateNumber} • {v.capacity} seats • {v.status}
                        </Text>
                      </View>
                    </View>
                    {isSelected && <Ionicons name="checkmark-circle" size={20} color={themeColors.primary} />}
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
              { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border },
            ]}
          >
            <View style={styles.stepCardHeader}>
              <View style={[styles.stepCardIcon, { backgroundColor: themeColors.primaryLight }]}>
                <Ionicons name="person" size={20} color={themeColors.primary} />
              </View>
              <View>
                <Text style={[styles.stepTitle, { color: themeColors.text }]}>
                  Select Driver
                </Text>
                <Text style={[styles.stepDesc, { color: themeColors.textSecondary }]}>
                  Choose an available driver or confirm dispatch
                </Text>
              </View>
            </View>

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
                      styles.selectCard,
                      {
                        backgroundColor: isSelected ? themeColors.backgroundSelected : 'transparent',
                        borderColor: isSelected ? themeColors.primary : themeColors.border,
                      },
                    ]}
                  >
                    <View style={styles.selectCardLeft}>
                      <View
                        style={[
                          styles.radioOuter,
                          { borderColor: isSelected ? themeColors.primary : themeColors.textMuted },
                        ]}
                      >
                        {isSelected && <View style={[styles.radioInner, { backgroundColor: themeColors.primary }]} />}
                      </View>
                      <View style={styles.selectCardInfo}>
                        <View style={styles.driverNameRow}>
                          <Text style={[styles.selectCardTitle, { color: themeColors.text }]}>
                            {d.name}
                          </Text>
                          {index === 0 && (
                            <View style={[styles.recBadge, { backgroundColor: themeColors.accentLight }]}>
                              <Text style={[styles.recBadgeText, { color: themeColors.accent }]}>
                                Recommended
                              </Text>
                            </View>
                          )}
                        </View>
                        <Text style={[styles.selectCardSub, { color: themeColors.textSecondary }]}>
                          {d.status} • {d.assignedVehicleModel} • On-time: {d.onTimePerformance}%
                        </Text>
                      </View>
                    </View>
                    {isSelected && <Ionicons name="checkmark-circle" size={20} color={themeColors.primary} />}
                  </TouchableOpacity>
                );
              })}
          </View>
        )}

        {/* Navigation */}
        <View style={styles.navRow}>
          {step > 1 && (
            <AppButton
              title="Back"
              onPress={handlePrev}
              variant="outline"
              size="md"
              fullWidth={false}
              style={{ flex: 1 }}
              icon={<Ionicons name="arrow-back" size={16} color={themeColors.primary} />}
            />
          )}
          <AppButton
            title={step === 6 ? 'Create Trip' : 'Continue'}
            onPress={handleNext}
            variant="primary"
            size="md"
            fullWidth={step === 1}
            style={{ flex: step > 1 ? 1 : undefined }}
            icon={
              <Ionicons
                name={step === 6 ? 'checkmark-circle' : 'arrow-forward'}
                size={18}
                color="#FFFFFF"
              />
            }
          />
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
  progressContainer: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.1)',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepCol: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  stepDotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  stepDotText: {
    fontSize: 10,
    fontWeight: '700',
  },
  stepConnector: {
    height: 2,
    flex: 1,
    borderRadius: 1,
    marginLeft: 4,
  },
  stepDotLabel: {
    fontSize: 9,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  scrollContent: {
    padding: Spacing.base,
    paddingBottom: Spacing.xxl,
  },
  // Step card
  stepCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.base,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },
  stepCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.base,
  },
  stepCardIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.weights.bold,
    letterSpacing: -0.3,
  },
  stepDesc: {
    fontSize: Typography.fontSizes.sm,
    marginTop: 2,
  },
  // Input
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.medium,
    marginBottom: Spacing.sm,
    letterSpacing: 0.1,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    height: 48,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  textInput: {
    flex: 1,
    fontSize: Typography.fontSizes.base,
    paddingVertical: 0,
  },
  routeArrow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  routeArrowLine: {
    flex: 1,
    height: 1,
  },
  // Chips
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  chipText: {
    fontSize: Typography.fontSizes.xs + 1,
  },
  timeChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  countChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  // Presets
  presetSection: {
    marginTop: Spacing.sm,
  },
  presetLabel: {
    fontSize: Typography.fontSizes.xs,
    marginBottom: Spacing.sm,
    fontWeight: Typography.weights.medium,
  },
  presetWrap: {
    gap: Spacing.sm,
  },
  presetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  presetChipText: {
    fontSize: Typography.fontSizes.xs + 1,
    fontWeight: Typography.weights.medium,
  },
  // Select card
  selectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  selectCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  selectCardInfo: {
    flex: 1,
  },
  selectCardTitle: {
    fontSize: Typography.fontSizes.sm + 1,
    fontWeight: Typography.weights.bold,
  },
  selectCardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  selectCardSub: {
    fontSize: Typography.fontSizes.xs,
  },
  selectCardDot: {
    fontSize: Typography.fontSizes.xs,
  },
  driverNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  recBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  recBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  // Navigation
  navRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
});
