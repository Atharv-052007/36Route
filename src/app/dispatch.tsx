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
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { Header } from '@/components/ui/Header';
import { Badge } from '@/components/ui/Badge';
import { MOCK_RECOMMENDATIONS_3821 } from '@/mock';
import { DriverRecommendation } from '@/types';

type WorkflowStep = 'REVIEW' | 'ASSIGNED_WAITING' | 'ACCEPTED' | 'DECLINED';

export default function DispatchScreen() {
  const router = useRouter();
  const {
    trips,
    selectedTripId,
    assignDriverToTrip,
    simulateDriverResponse,
    isDarkMode,
  } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

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

    // Recommend next driver
    if (selectedDriverIndex < recommendations.length - 1) {
      setSelectedDriverIndex((prev) => prev + 1);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.cardBackground}
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
        {/* Trip Banner */}
        <View
          style={[
            styles.tripBanner,
            { backgroundColor: theme.cardBackground, borderColor: theme.border },
          ]}
        >
          <View style={styles.bannerTop}>
            <View>
              <Text style={[styles.tripNum, { color: theme.textSecondary }]}>
                {trip.tripNumber}
              </Text>
              <Text style={[styles.timeText, { color: theme.text }]}>
                {trip.scheduledTime}
              </Text>
            </View>
            <Badge status="Needs Attention" label="Driver required" size="sm" />
          </View>

          <Text style={[styles.routeText, { color: theme.text }]}>
            {trip.routeSummary}
          </Text>

          <View style={styles.passengerRow}>
            <Ionicons name="people-outline" size={15} color={theme.textSecondary} />
            <Text style={[styles.passengerText, { color: theme.textSecondary }]}>
              {trip.passengerCount} passengers • Capacity: {trip.maxCapacity}
            </Text>
          </View>
        </View>

        {/* WORKFLOW STATE: ASSIGNED / WAITING SIMULATION */}
        {workflowState === 'ASSIGNED_WAITING' && (
          <View
            style={[
              styles.workflowBox,
              { backgroundColor: theme.assignedLight, borderColor: theme.assignedBorder },
            ]}
          >
            <View style={styles.workflowHeader}>
              <Ionicons name="paper-plane" size={20} color={theme.assigned} />
              <Text style={[styles.workflowTitle, { color: theme.text }]}>
                Assignment sent to {currentDriver.driverName}
              </Text>
            </View>
            <Text style={[styles.workflowSub, { color: theme.textSecondary }]}>
              Waiting for driver to confirm on mobile terminal. Calling is available as fallback.
            </Text>

            <View style={styles.simControls}>
              <Text style={[styles.simLabel, { color: theme.textMuted }]}>
                SIMULATE DRIVER RESPONSE:
              </Text>
              <View style={styles.simButtonsRow}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleDriverAccept}
                  style={[styles.simAcceptBtn, { backgroundColor: theme.available }]}
                >
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  <Text style={styles.simBtnText}>Accept</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleDriverDecline('Busy on another shift')}
                  style={[styles.simDeclineBtn, { backgroundColor: theme.danger }]}
                >
                  <Ionicons name="close" size={16} color="#FFFFFF" />
                  <Text style={styles.simBtnText}>Decline (Busy)</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleCall}
              style={[
                styles.callFallbackBtn,
                { backgroundColor: theme.cardBackground, borderColor: theme.border },
              ]}
            >
              <Ionicons name="call-outline" size={16} color={theme.text} />
              <Text style={[styles.callFallbackText, { color: theme.text }]}>
                Call {currentDriver.driverName} ({currentDriver.phone})
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* WORKFLOW STATE: ACCEPTED */}
        {workflowState === 'ACCEPTED' && (
          <View
            style={[
              styles.workflowBox,
              { backgroundColor: theme.availableLight, borderColor: theme.availableBorder },
            ]}
          >
            <View style={styles.workflowHeader}>
              <Ionicons name="checkmark-circle" size={24} color={theme.available} />
              <Text style={[styles.workflowTitle, { color: theme.available }]}>
                {currentDriver.driverName} accepted the trip!
              </Text>
            </View>
            <Text style={[styles.workflowSub, { color: theme.textSecondary }]}>
              Vehicle: {currentDriver.vehicleModel} ({currentDriver.vehiclePlate}). System has updated trip status to Assigned.
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.replace('/trip-details')}
              style={[styles.viewTripBtn, { backgroundColor: theme.primary }]}
            >
              <Text style={styles.viewTripText}>Open Trip Details</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}

        {/* WORKFLOW STATE: DECLINED */}
        {workflowState === 'DECLINED' && (
          <View
            style={[
              styles.workflowBox,
              { backgroundColor: theme.warningLight, borderColor: theme.warningBorder },
            ]}
          >
            <View style={styles.workflowHeader}>
              <Ionicons name="alert-circle" size={22} color={theme.warning} />
              <Text style={[styles.workflowTitle, { color: theme.text }]}>
                Driver declined: {declineReason}
              </Text>
            </View>
            <Text style={[styles.workflowSub, { color: theme.textSecondary }]}>
              Automatically recommended the next best driver below.
            </Text>
          </View>
        )}

        {/* RECOMMENDED DRIVER CARD */}
        {workflowState !== 'ACCEPTED' && (
          <View
            style={[
              styles.recCard,
              { backgroundColor: theme.cardBackground, borderColor: theme.border },
            ]}
          >
            <View style={styles.recHeaderRow}>
              <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                RECOMMENDED DRIVER
              </Text>
              <View
                style={[
                  styles.matchBadge,
                  { backgroundColor: theme.accentLight, borderColor: theme.accent },
                ]}
              >
                <Text style={[styles.matchText, { color: theme.accent }]}>
                  {currentDriver.matchScore}% match
                </Text>
              </View>
            </View>

            <View style={styles.driverMainRow}>
              <View>
                <Text style={[styles.driverNameText, { color: theme.text }]}>
                  {currentDriver.driverName}
                </Text>
                <Text style={[styles.driverVehText, { color: theme.textSecondary }]}>
                  {currentDriver.vehicleModel} • {currentDriver.vehiclePlate}
                </Text>
              </View>
              <Text style={[styles.driverRating, { color: theme.textSecondary }]}>
                ★ {currentDriver.rating}
              </Text>
            </View>

            {/* Reasons checklist */}
            <View
              style={[
                styles.reasonsBox,
                { backgroundColor: theme.backgroundElement },
              ]}
            >
              <Text style={[styles.reasonsTitle, { color: theme.textSecondary }]}>
                Compatibility factors:
              </Text>
              {currentDriver.reasons.map((reason, i) => (
                <View key={i} style={styles.reasonItem}>
                  <Ionicons name="checkmark-sharp" size={14} color={theme.available} />
                  <Text style={[styles.reasonText, { color: theme.text }]}>
                    {reason}
                  </Text>
                </View>
              ))}
            </View>

            {/* Actions: Assign | Call | Choose Another */}
            <View style={styles.actionButtonsCol}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleAssign}
                style={[styles.assignBtn, { backgroundColor: theme.primary }]}
              >
                <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" />
                <Text style={styles.assignBtnText}>
                  Assign {currentDriver.driverName.split(' ')[0]}
                </Text>
              </TouchableOpacity>

              <View style={styles.secondaryActionsRow}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleCall}
                  style={[
                    styles.subActionBtn,
                    {
                      backgroundColor: theme.backgroundElement,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Ionicons name="call-outline" size={16} color={theme.text} />
                  <Text style={[styles.subActionText, { color: theme.text }]}>
                    Call
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setShowRankedList((prev) => !prev)}
                  style={[
                    styles.subActionBtn,
                    {
                      backgroundColor: theme.backgroundElement,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Ionicons name="list-outline" size={16} color={theme.text} />
                  <Text style={[styles.subActionText, { color: theme.text }]}>
                    {showRankedList ? 'Hide Alternatives' : 'Choose Another'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* RANKED RECOMMENDATIONS LIST */}
        {showRankedList && (
          <View
            style={[
              styles.rankedCard,
              { backgroundColor: theme.cardBackground, borderColor: theme.border },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
              RANKED DRIVERS
            </Text>
            {recommendations.map((rec, index) => {
              const isCurrent = selectedDriverIndex === index;
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
                      borderBottomColor: theme.borderLight,
                      backgroundColor: isCurrent
                        ? theme.backgroundElement
                        : 'transparent',
                    },
                  ]}
                >
                  <View style={styles.rankedLeft}>
                    <Text style={[styles.rankIndex, { color: theme.textMuted }]}>
                      {index + 1}.
                    </Text>
                    <View>
                      <Text style={[styles.rankedName, { color: theme.text }]}>
                        {rec.driverName}
                      </Text>
                      <Text style={[styles.rankedVeh, { color: theme.textSecondary }]}>
                        {rec.vehicleModel} • {rec.distanceToPickup}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.rankedRight}>
                    <Text
                      style={[
                        styles.rankedScore,
                        {
                          color: index === 0 ? theme.available : theme.accent,
                        },
                      ]}
                    >
                      {rec.matchScore}%
                    </Text>
                    <Ionicons
                      name={isCurrent ? 'radio-button-on' : 'chevron-forward'}
                      size={16}
                      color={isCurrent ? theme.accent : theme.textMuted}
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
  tripBanner: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  bannerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  tripNum: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.medium,
  },
  timeText: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.weights.bold,
  },
  routeText: {
    fontSize: Typography.fontSizes.base,
    fontWeight: Typography.weights.semibold,
    marginBottom: 6,
  },
  passengerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  passengerText: {
    fontSize: Typography.fontSizes.xs + 1,
  },
  workflowBox: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  workflowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  workflowTitle: {
    fontSize: Typography.fontSizes.base,
    fontWeight: Typography.weights.bold,
  },
  workflowSub: {
    fontSize: Typography.fontSizes.xs + 1,
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  simControls: {
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.08)',
  },
  simLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  simButtonsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  simAcceptBtn: {
    flex: 1,
    height: 38,
    borderRadius: BorderRadius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  simDeclineBtn: {
    flex: 1,
    height: 38,
    borderRadius: BorderRadius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  simBtnText: {
    color: '#FFFFFF',
    fontSize: Typography.fontSizes.xs + 1,
    fontWeight: Typography.weights.bold,
  },
  callFallbackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    gap: 6,
    marginTop: 4,
  },
  callFallbackText: {
    fontSize: Typography.fontSizes.xs + 1,
    fontWeight: Typography.weights.medium,
  },
  viewTripBtn: {
    height: 44,
    borderRadius: BorderRadius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: Spacing.sm,
  },
  viewTripText: {
    color: '#FFFFFF',
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  recCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  recHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.8,
  },
  matchBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  matchText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.bold,
  },
  driverMainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  driverNameText: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.weights.bold,
  },
  driverVehText: {
    fontSize: Typography.fontSizes.xs + 1,
    marginTop: 2,
  },
  driverRating: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  reasonsBox: {
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.base,
    gap: 6,
  },
  reasonsTitle: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.semibold,
    marginBottom: 2,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reasonText: {
    fontSize: Typography.fontSizes.xs + 1,
  },
  actionButtonsCol: {
    gap: Spacing.sm,
  },
  assignBtn: {
    height: 48,
    borderRadius: BorderRadius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  assignBtnText: {
    color: '#FFFFFF',
    fontSize: Typography.fontSizes.sm + 1,
    fontWeight: Typography.weights.bold,
  },
  secondaryActionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  subActionBtn: {
    flex: 1,
    height: 42,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  subActionText: {
    fontSize: Typography.fontSizes.xs + 1,
    fontWeight: Typography.weights.medium,
  },
  rankedCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  rankedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderBottomWidth: 1,
    borderRadius: BorderRadius.xs,
  },
  rankedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  rankIndex: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.bold,
    width: 20,
  },
  rankedName: {
    fontSize: Typography.fontSizes.sm + 1,
    fontWeight: Typography.weights.semibold,
  },
  rankedVeh: {
    fontSize: Typography.fontSizes.xs,
    marginTop: 2,
  },
  rankedRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rankedScore: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.bold,
  },
});
