import React from 'react';
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
import { Badge } from '@/components/ui/Badge';

export default function DriverProfileScreen() {
  const router = useRouter();
  const { drivers, selectedDriverId, isDarkMode } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const driver = drivers.find((d) => d.id === selectedDriverId) || drivers[0];

  const handleCall = () => {
    Linking.openURL(`tel:${driver.phone}`);
  };

  const handleAssignTrip = () => {
    router.push('/dispatch');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.cardBackground}
      />

      <Header
        title={driver.name}
        subtitle={driver.assignedVehicleModel}
        showBack
        rightAction={<Badge status={driver.status} size="sm" />}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Driver Header Summary */}
        <View
          style={[
            styles.headerCard,
            { backgroundColor: theme.cardBackground, borderColor: theme.border },
          ]}
        >
          <View style={[styles.driverAvatar, { backgroundColor: theme.primary }]}>
            <Text style={styles.driverAvatarText}>
              {driver.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.driverMainInfo}>
            <Text style={[styles.driverTitle, { color: theme.text }]}>
              {driver.name}
            </Text>
            <Text style={[styles.driverRatingText, { color: theme.textSecondary }]}>
              ★ {driver.rating} • ID: {driver.id.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleAssignTrip}
            style={[styles.primaryActionBtn, { backgroundColor: theme.primary }]}
          >
            <Ionicons name="paper-plane-outline" size={18} color="#FFFFFF" />
            <Text style={styles.primaryActionText}>Assign Trip</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleCall}
            style={[
              styles.secondaryActionBtn,
              { backgroundColor: theme.cardBackground, borderColor: theme.border },
            ]}
          >
            <Ionicons name="call-outline" size={18} color={theme.text} />
            <Text style={[styles.secondaryActionText, { color: theme.text }]}>
              Call Driver
            </Text>
          </TouchableOpacity>
        </View>

        {/* CONTACT Section */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.cardBackground, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            CONTACT
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleCall}
            style={[styles.infoRow, { borderBottomColor: theme.borderLight }]}
          >
            <View style={styles.infoLeft}>
              <Ionicons name="call-outline" size={16} color={theme.textSecondary} />
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                Phone
              </Text>
            </View>
            <Text style={[styles.infoValue, { color: theme.accent }]}>
              {driver.phone}
            </Text>
          </TouchableOpacity>

          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Ionicons name="mail-outline" size={16} color={theme.textSecondary} />
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                Email
              </Text>
            </View>
            <Text style={[styles.infoValue, { color: theme.text }]}>
              {driver.email}
            </Text>
          </View>
        </View>

        {/* CURRENT ASSIGNMENT Section */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.cardBackground, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            CURRENT ASSIGNMENT
          </Text>
          {driver.status === 'On Trip' ? (
            <View style={styles.assignmentActive}>
              <Text style={[styles.assignmentTrip, { color: theme.onTrip }]}>
                {driver.currentTripId ? `Trip #${driver.currentTripId.replace('trip-', '')}` : 'Active Trip'}
              </Text>
              <Text style={[styles.assignmentRoute, { color: theme.text }]}>
                {driver.currentTripRoute || 'In Transit'}
              </Text>
            </View>
          ) : (
            <Text style={[styles.noAssignmentText, { color: theme.textSecondary }]}>
              No active trip. Driver is currently on standby.
            </Text>
          )}
        </View>

        {/* VEHICLE Section */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.cardBackground, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            VEHICLE
          </Text>
          <View style={styles.vehicleRow}>
            <View>
              <Text style={[styles.vehicleModelText, { color: theme.text }]}>
                {driver.assignedVehicleModel}
              </Text>
              <Text style={[styles.vehiclePlateText, { color: theme.textSecondary }]}>
                {driver.assignedVehiclePlate}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/vehicles')}
              style={[styles.viewVehicleBtn, { backgroundColor: theme.backgroundElement }]}
            >
              <Text style={[styles.viewVehicleText, { color: theme.accent }]}>
                View Vehicle
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* TODAY Section */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.cardBackground, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            TODAY
          </Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <Text style={[styles.metricNumber, { color: theme.text }]}>
                {driver.todayTrips}
              </Text>
              <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
                Total Trips
              </Text>
            </View>
            <View style={[styles.metricDivider, { backgroundColor: theme.border }]} />
            <View style={styles.metricItem}>
              <Text style={[styles.metricNumber, { color: theme.available }]}>
                {driver.completedTrips}
              </Text>
              <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
                Completed
              </Text>
            </View>
            <View style={[styles.metricDivider, { backgroundColor: theme.border }]} />
            <View style={styles.metricItem}>
              <Text style={[styles.metricNumber, { color: theme.upcoming }]}>
                {driver.upcomingTrips}
              </Text>
              <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
                Upcoming
              </Text>
            </View>
          </View>
        </View>

        {/* PERFORMANCE Section */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.cardBackground, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            PERFORMANCE
          </Text>
          <View style={styles.perfRow}>
            <View style={styles.perfCol}>
              <Text style={[styles.perfNumber, { color: theme.available }]}>
                {driver.onTimePerformance}%
              </Text>
              <Text style={[styles.perfLabel, { color: theme.textSecondary }]}>
                On-time
              </Text>
            </View>
            <View style={[styles.metricDivider, { backgroundColor: theme.border }]} />
            <View style={styles.perfCol}>
              <Text style={[styles.perfNumber, { color: theme.accent }]}>
                {driver.acceptanceRate}%
              </Text>
              <Text style={[styles.perfLabel, { color: theme.textSecondary }]}>
                Acceptance
              </Text>
            </View>
          </View>
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
  scrollContent: {
    padding: Spacing.base,
    paddingBottom: Spacing.xxl,
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  driverAvatarText: {
    color: '#FFFFFF',
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.weights.bold,
  },
  driverMainInfo: {
    flex: 1,
  },
  driverTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.weights.bold,
  },
  driverRatingText: {
    fontSize: Typography.fontSizes.xs + 1,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  primaryActionBtn: {
    flex: 1,
    height: 46,
    borderRadius: BorderRadius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  secondaryActionBtn: {
    flex: 1,
    height: 46,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  secondaryActionText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.medium,
  },
  card: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: {
    fontSize: Typography.fontSizes.sm,
  },
  infoValue: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.medium,
  },
  assignmentActive: {
    paddingVertical: Spacing.xs,
  },
  assignmentTrip: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.bold,
  },
  assignmentRoute: {
    fontSize: Typography.fontSizes.base,
    fontWeight: Typography.weights.semibold,
    marginTop: 2,
  },
  noAssignmentText: {
    fontSize: Typography.fontSizes.sm,
    paddingVertical: 4,
  },
  vehicleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vehicleModelText: {
    fontSize: Typography.fontSizes.base,
    fontWeight: Typography.weights.bold,
  },
  vehiclePlateText: {
    fontSize: Typography.fontSizes.xs + 1,
    marginTop: 2,
  },
  viewVehicleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
  },
  viewVehicleText: {
    fontSize: Typography.fontSizes.xs + 1,
    fontWeight: Typography.weights.semibold,
  },
  metricsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: Spacing.xs,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricNumber: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.weights.bold,
  },
  metricLabel: {
    fontSize: Typography.fontSizes.xs,
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 24,
  },
  perfRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: Spacing.xs,
  },
  perfCol: {
    alignItems: 'center',
    flex: 1,
  },
  perfNumber: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: Typography.weights.bold,
  },
  perfLabel: {
    fontSize: Typography.fontSizes.xs + 1,
    marginTop: 2,
  },
});
