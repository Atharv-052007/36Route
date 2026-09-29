import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { Header } from '@/components/ui/Header';
import { AppButton } from '@/components/ui/AppButton';
import { MOCK_RECOMMENDATIONS_3821 } from '@/mock';
import { DriverRecommendation } from '@/types';

type WorkflowStep = 'REVIEW' | 'ASSIGNED_WAITING' | 'ACCEPTED' | 'DECLINED';

const WORKFLOW_STEPS: { key: WorkflowStep; label: string }[] = [
  { key: 'REVIEW', label: 'Review' },
  { key: 'ASSIGNED_WAITING', label: 'Assigned' },
  { key: 'ACCEPTED', label: 'Accepted' },
];

export default function DispatchScreen() {
  const router = useRouter();
  const {
    trips,
    selectedTripId,
    assignDriverToTrip,
    simulateDriverResponse,
    isDarkMode,
    themeColors,
  } = useApp();

  const trip = trips.find((t) => t.id === selectedTripId) || trips[0];

  const [recommendations] = useState<DriverRecommendation[]>(MOCK_RECOMMENDATIONS_3821);
  const [selectedDriverIndex, setSelectedDriverIndex] = useState<number>(0);
  const [showRankedList, setShowRankedList] = useState<boolean>(false);
  const [workflowState, setWorkflowState] = useState<WorkflowStep>('REVIEW');
  const [declineReason, setDeclineReason] = useState<string>('Busy on prior shift');

  const currentDriver = recommendations[selectedDriverIndex] || recommendations[0];

  const handleCall = () => {
    Linking.openURL(`tel:${currentDriver.phone}`);
  };

  const handleAssign = async () => {
    setWorkflowState('ASSIGNED_WAITING');
    await assignDriverToTrip(trip.id, currentDriver.driverId);
  };

  const handleDriverAccept = async () => {
    await simulateDriverResponse(trip.id, currentDriver.driverId, 'Accepted');
    setWorkflowState('ACCEPTED');
  };

  const handleDriverDecline = async (reason: string) => {
    setDeclineReason(reason);
    await simulateDriverResponse(trip.id, currentDriver.driverId, 'Declined');
    setWorkflowState('DECLINED');
    if (selectedDriverIndex < recommendations.length - 1) {
      setSelectedDriverIndex((prev) => prev + 1);
    }
  };

  const activeStepIndex = WORKFLOW_STEPS.findIndex((s) => s.key === workflowState);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={themeColors.cardBackground}
      />

      <Header
        title="Dispatch / Assignment"
        subtitle={`${trip.tripNumber} • ${trip.scheduledTime}`}
        showBack
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Step Indicator */}
        <View style={styles.workflowIndicator}>
          {WORKFLOW_STEPS.map((step, i) => {
            const isActive = i === activeStepIndex;
            const isCompleted = i < activeStepIndex;
            return (
              <React.Fragment key={step.key}>
                <View style={styles.stepItem}>
                  <View
                    style={[
                      styles.stepCircle,
                      {
                        backgroundColor: isCompleted
                          ? themeColors.available
                          : isActive
                          ? themeColors.primary
                          : themeColors.backgroundElement,
                        borderColor: isCompleted
                          ? themeColors.available
                          : isActive
                          ? themeColors.primary
                          : themeColors.border,
                      },
                    ]}
                  >
                    {isCompleted ? (
                      <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                    ) : (
                      <Text
                        style={[
                          styles.stepNumber,
                          {
                            color: isActive ? '#FFFFFF' : themeColors.textMuted,
                          },
                        ]}
                      >
                        {i + 1}
                      </Text>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.stepLabel,
                      {
                        color: isActive ? themeColors.text : themeColors.textMuted,
                        fontWeight: isActive ? '600' : '400',
                      },
                    ]}
                  >
                    {step.label}
                  </Text>
                </View>
                {i < WORKFLOW_STEPS.length - 1 && (
                  <View
                    style={[
                      styles.stepLine,
                      {
                        backgroundColor: isCompleted
                          ? themeColors.available
                          : themeColors.border,
                      },
                    ]}
                  />
                )}
              </React.Fragment>
            );
          })}
        </View>

        {/* Trip Info Card */}
        <View
          style={[
            styles.tripCard,
            { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border },
          ]}
        >
          <View style={styles.tripCardHeader}>
            <View style={styles.tripTitleRow}>
              <View
                style={[
                  styles.tripIcon,
                  { backgroundColor: themeColors.primaryLight },
                ]}
              >
                <Ionicons name="bus-outline" size={18} color={themeColors.primary} />
              </View>
              <View>
                <Text style={[styles.tripNumber, { color: themeColors.text }]}>
                  {trip.tripNumber}
                </Text>
                <Text style={[styles.tripTime, { color: themeColors.textSecondary }]}>
                  {trip.scheduledTime}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.statusPill,
                { backgroundColor: themeColors.warningLight, borderColor: themeColors.warning },
              ]}
            >
              <Ionicons name="alert-circle" size={12} color={themeColors.warning} />
              <Text style={[styles.statusPillText, { color: themeColors.warning }]}>
                Driver Required
              </Text>
            </View>
          </View>

          <View style={[styles.tripDivider, { backgroundColor: themeColors.borderLight }]} />

          <View style={styles.tripRouteRow}>
            <Ionicons name="git-compare-outline" size={16} color={themeColors.textSecondary} />
            <Text style={[styles.tripRouteText, { color: themeColors.text }]}>
              {trip.routeSummary}
            </Text>
          </View>

          <View style={styles.tripMetaRow}>
            <View style={styles.tripMetaItem}>
              <Ionicons name="people-outline" size={14} color={themeColors.textMuted} />
              <Text style={[styles.tripMetaText, { color: themeColors.textSecondary }]}>
                {trip.passengerCount} passengers
              </Text>
            </View>
            <View style={[styles.tripMetaDot, { backgroundColor: themeColors.textMuted }]} />
            <View style={styles.tripMetaItem}>
              <Ionicons name="car-outline" size={14} color={themeColors.textMuted} />
              <Text style={[styles.tripMetaText, { color: themeColors.textSecondary }]}>
                Capacity: {trip.maxCapacity}
              </Text>
            </View>
          </View>
        </View>

        {/* ASSIGNED WAITING STATE */}
        {workflowState === 'ASSIGNED_WAITING' && (
          <View
            style={[
              styles.workflowCard,
              {
                backgroundColor: themeColors.assignedLight,
                borderColor: themeColors.assignedBorder,
              },
            ]}
          >
            <View style={styles.workflowCardHeader}>
              <View
                style={[
                  styles.workflowIcon,
                  { backgroundColor: themeColors.assigned },
                ]}
              >
                <Ionicons name="paper-plane" size={16} color="#FFFFFF" />
              </View>
              <View style={styles.workflowCardText}>
                <Text style={[styles.workflowCardTitle, { color: themeColors.text }]}>
                  Assignment Sent
                </Text>
                <Text style={[styles.workflowCardSub, { color: themeColors.textSecondary }]}>
                  To {currentDriver.driverName}
                </Text>
              </View>
            </View>
            <Text style={[styles.workflowCardBody, { color: themeColors.textSecondary }]}>
              Waiting for driver to confirm on mobile terminal. Calling is available as fallback.
            </Text>

            <View style={[styles.simSection, { borderTopColor: themeColors.border }]}>
              <Text style={[styles.simLabel, { color: themeColors.textMuted }]}>
                SIMULATE RESPONSE
              </Text>
              <View style={styles.simRow}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleDriverAccept}
                  style={[styles.simBtn, { backgroundColor: themeColors.available }]}
                >
                  <Ionicons name="checkmark" size={15} color="#FFFFFF" />
                  <Text style={styles.simBtnText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleDriverDecline('Busy on another shift')}
                  style={[styles.simBtn, { backgroundColor: themeColors.danger }]}
                >
                  <Ionicons name="close" size={15} color="#FFFFFF" />
                  <Text style={styles.simBtnText}>Decline</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleCall}
              style={[
                styles.callBtn,
                { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border },
              ]}
            >
              <Ionicons name="call-outline" size={15} color={themeColors.primary} />
              <Text style={[styles.callBtnText, { color: themeColors.primary }]}>
                Call {currentDriver.driverName.split(' ')[0]}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ACCEPTED STATE */}
        {workflowState === 'ACCEPTED' && (
          <View
            style={[
              styles.workflowCard,
              {
                backgroundColor: themeColors.availableLight,
                borderColor: themeColors.availableBorder,
              },
            ]}
          >
            <View style={styles.workflowCardHeader}>
              <View
                style={[
                  styles.workflowIcon,
                  { backgroundColor: themeColors.available },
                ]}
              >
                <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
              </View>
              <View style={styles.workflowCardText}>
                <Text style={[styles.workflowCardTitle, { color: themeColors.available }]}>
                  Driver Accepted!
                </Text>
                <Text style={[styles.workflowCardSub, { color: themeColors.textSecondary }]}>
                  {currentDriver.driverName} confirmed the trip
                </Text>
              </View>
            </View>
            <Text style={[styles.workflowCardBody, { color: themeColors.textSecondary }]}>
              {currentDriver.vehicleModel} ({currentDriver.vehiclePlate}). Trip status updated to Assigned.
            </Text>
            <AppButton
              title="Open Trip Details"
              onPress={() => router.replace('/trip-details')}
              icon={<Ionicons name="arrow-forward" size={16} color="#FFFFFF" />}
            />
          </View>
        )}

        {/* DECLINED STATE */}
        {workflowState === 'DECLINED' && (
          <View
            style={[
              styles.workflowCard,
              {
                backgroundColor: themeColors.warningLight,
                borderColor: themeColors.warningBorder,
              },
            ]}
          >
            <View style={styles.workflowCardHeader}>
              <View
                style={[
                  styles.workflowIcon,
                  { backgroundColor: themeColors.warning },
                ]}
              >
                <Ionicons name="alert-circle" size={16} color="#FFFFFF" />
              </View>
              <View style={styles.workflowCardText}>
                <Text style={[styles.workflowCardTitle, { color: themeColors.text }]}>
                  Driver Declined
                </Text>
                <Text style={[styles.workflowCardSub, { color: themeColors.textSecondary }]}>
                  {declineReason}
                </Text>
              </View>
            </View>
            <Text style={[styles.workflowCardBody, { color: themeColors.textSecondary }]}>
              Automatically recommending the next best driver below.
            </Text>
          </View>
        )}

        {/* Recommended Driver Card */}
        {workflowState !== 'ACCEPTED' && (
          <View
            style={[
              styles.driverCard,
              { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border },
            ]}
          >
            <View style={styles.driverCardHeader}>
              <Text style={[styles.sectionLabel, { color: themeColors.textMuted }]}>
                RECOMMENDED DRIVER
              </Text>
              <View
                style={[
                  styles.matchPill,
                  { backgroundColor: themeColors.accentLight, borderColor: themeColors.accent },
                ]}
              >
                <Ionicons name="flash" size={12} color={themeColors.accent} />
                <Text style={[styles.matchPillText, { color: themeColors.accent }]}>
                  {currentDriver.matchScore}% match
                </Text>
              </View>
            </View>

            <View style={styles.driverInfoRow}>
              <View
                style={[
                  styles.driverAvatar,
                  { backgroundColor: themeColors.primaryLight },
                ]}
              >
                <Text style={[styles.driverInitial, { color: themeColors.primary }]}>
                  {currentDriver.driverName.charAt(0)}
                </Text>
              </View>
              <View style={styles.driverDetails}>
                <Text style={[styles.driverName, { color: themeColors.text }]}>
                  {currentDriver.driverName}
                </Text>
                <Text style={[styles.driverVehicle, { color: themeColors.textSecondary }]}>
                  {currentDriver.vehicleModel} • {currentDriver.vehiclePlate}
                </Text>
              </View>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={14} color={themeColors.warning} />
                <Text style={[styles.ratingText, { color: themeColors.text }]}>
                  {currentDriver.rating}
                </Text>
              </View>
            </View>

            <View style={[styles.reasonsContainer, { backgroundColor: themeColors.backgroundElement }]}>
              <Text style={[styles.reasonsTitle, { color: themeColors.textSecondary }]}>
                Compatibility Factors
              </Text>
              {currentDriver.reasons.map((reason, i) => (
                <View key={i} style={styles.reasonRow}>
                  <View
                    style={[
                      styles.reasonCheck,
                      { backgroundColor: themeColors.available },
                    ]}
                  >
                    <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                  </View>
                  <Text style={[styles.reasonText, { color: themeColors.text }]}>
                    {reason}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.driverActions}>
              <AppButton
                title={`Assign ${currentDriver.driverName.split(' ')[0]}`}
                onPress={handleAssign}
                icon={<Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" />}
              />
              <View style={styles.secondaryRow}>
                <AppButton
                  title="Call"
                  onPress={handleCall}
                  variant="outline"
                  size="sm"
                  icon={<Ionicons name="call-outline" size={15} color={themeColors.primary} />}
                />
                <AppButton
                  title={showRankedList ? 'Hide List' : 'Other Drivers'}
                  onPress={() => setShowRankedList((prev) => !prev)}
                  variant="outline"
                  size="sm"
                  icon={<Ionicons name="list-outline" size={15} color={themeColors.primary} />}
                />
              </View>
            </View>
          </View>
        )}

        {/* Ranked Driver List */}
        {showRankedList && (
          <View
            style={[
              styles.rankedCard,
              { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border },
            ]}
          >
            <Text style={[styles.sectionLabel, { color: themeColors.textMuted }]}>
              ALL DRIVERS
            </Text>
            {recommendations.map((rec, index) => {
              const isSelected = selectedDriverIndex === index;
              return (
                <TouchableOpacity
                  key={rec.driverId}
                  activeOpacity={0.7}
                  onPress={() => {
                    setSelectedDriverIndex(index);
                    setWorkflowState('REVIEW');
                  }}
                  style={[
                    styles.rankedItem,
                    {
                      backgroundColor: isSelected ? themeColors.backgroundSelected : 'transparent',
                      borderColor: isSelected ? themeColors.primary : 'transparent',
                    },
                  ]}
                >
                  <View style={styles.rankedLeft}>
                    <View
                      style={[
                        styles.rankBadge,
                        {
                          backgroundColor: index === 0 ? themeColors.primaryLight : themeColors.backgroundElement,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.rankNumber,
                          { color: index === 0 ? themeColors.primary : themeColors.textSecondary },
                        ]}
                      >
                        {index + 1}
                      </Text>
                    </View>
                    <View>
                      <Text style={[styles.rankedName, { color: themeColors.text }]}>
                        {rec.driverName}
                      </Text>
                      <Text style={[styles.rankedVehicle, { color: themeColors.textSecondary }]}>
                        {rec.vehicleModel} • {rec.distanceToPickup}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.rankedRight}>
                    <Text
                      style={[
                        styles.rankedScore,
                        { color: index === 0 ? themeColors.available : themeColors.accent },
                      ]}
                    >
                      {rec.matchScore}%
                    </Text>
                    <Ionicons
                      name={isSelected ? 'radio-button-on' : 'chevron-forward'}
                      size={16}
                      color={isSelected ? themeColors.primary : themeColors.textMuted}
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    padding: Spacing.base,
    paddingBottom: Spacing.xxl,
  },
  // Workflow step indicator
  workflowIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.sm,
  },
  stepItem: {
    alignItems: 'center',
    gap: 6,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '700',
  },
  stepLabel: {
    fontSize: Typography.fontSizes.xs,
    letterSpacing: 0.2,
  },
  stepLine: {
    height: 2,
    flex: 1,
    marginHorizontal: 6,
    marginBottom: 20,
    borderRadius: 1,
  },
  // Trip info card
  tripCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  tripCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tripTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
  },
  tripIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tripNumber: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.weights.bold,
    letterSpacing: -0.3,
  },
  tripTime: {
    fontSize: Typography.fontSizes.xs,
    marginTop: 1,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  statusPillText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.semibold,
  },
  tripDivider: {
    height: 1,
    marginVertical: Spacing.sm + 4,
  },
  tripRouteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  tripRouteText: {
    fontSize: Typography.fontSizes.base,
    fontWeight: Typography.weights.semibold,
    flex: 1,
  },
  tripMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  tripMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tripMetaText: {
    fontSize: Typography.fontSizes.xs + 1,
  },
  tripMetaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
  // Workflow state cards
  workflowCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.base,
    marginBottom: Spacing.md,
  },
  workflowCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
    marginBottom: Spacing.sm,
  },
  workflowIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workflowCardText: {
    flex: 1,
  },
  workflowCardTitle: {
    fontSize: Typography.fontSizes.base,
    fontWeight: Typography.weights.bold,
  },
  workflowCardSub: {
    fontSize: Typography.fontSizes.xs,
    marginTop: 1,
  },
  workflowCardBody: {
    fontSize: Typography.fontSizes.sm,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  // Simulation
  simSection: {
    paddingTop: Spacing.sm + 4,
    borderTopWidth: 1,
    marginBottom: Spacing.sm + 4,
  },
  simLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
  },
  simRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  simBtn: {
    flex: 1,
    height: 40,
    borderRadius: BorderRadius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  simBtnText: {
    color: '#FFFFFF',
    fontSize: Typography.fontSizes.xs + 1,
    fontWeight: Typography.weights.bold,
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    gap: 6,
  },
  callBtnText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  // Driver recommendation card
  driverCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  driverCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  sectionLabel: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  matchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  matchPillText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.bold,
  },
  driverInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.base,
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverInitial: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.weights.bold,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.weights.bold,
  },
  driverVehicle: {
    fontSize: Typography.fontSizes.xs + 1,
    marginTop: 2,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(245, 158, 11, 0.10)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  ratingText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.bold,
  },
  reasonsContainer: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.base,
    gap: Spacing.sm,
  },
  reasonsTitle: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  reasonCheck: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reasonText: {
    fontSize: Typography.fontSizes.sm,
    flex: 1,
  },
  driverActions: {
    gap: Spacing.sm + 4,
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  // Ranked list
  rankedCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  rankedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.sm + 4,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginTop: Spacing.sm,
  },
  rankedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
    flex: 1,
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNumber: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.bold,
  },
  rankedName: {
    fontSize: Typography.fontSizes.sm + 1,
    fontWeight: Typography.weights.semibold,
  },
  rankedVehicle: {
    fontSize: Typography.fontSizes.xs,
    marginTop: 2,
  },
  rankedRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  rankedScore: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.bold,
  },
});
