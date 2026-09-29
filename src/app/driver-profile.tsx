import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { Header } from '@/components/ui/Header';
import { Badge } from '@/components/ui/Badge';
import { AppButton } from '@/components/ui/AppButton';

export default function DriverProfileScreen() {
  const router = useRouter();
  const { drivers, selectedDriverId, isDarkMode } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const driver = drivers.find((d) => d.id === selectedDriverId) || drivers[0];

  const handleCall = () => {
    Linking.openURL(`tel:${driver.phone}`);
  };

  return (
    <View style={[styles.safe, { backgroundColor: theme.background }]}>
      <Header
        title={driver.name}
        subtitle={driver.assignedVehicleModel}
        showBack
        rightAction={<Badge status={driver.status} size="sm" />}
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Avatar Section */}
        <View style={[styles.heroCard, { backgroundColor: theme.cardBackground }, Shadows.medium]}>
          <View style={[styles.avatarOuter, { borderColor: theme.primary }]}>
            <View style={[styles.avatarInner, { backgroundColor: theme.primaryLight }]}>
              <Text style={[styles.avatarText, { color: theme.primary }]}>
                {driver.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>

          <Text style={[styles.driverName, { color: theme.text }]}>{driver.name}</Text>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color={theme.warning} />
            <Text style={[styles.ratingValue, { color: theme.text }]}>{driver.rating}</Text>
            <View style={[styles.ratingDivider, { backgroundColor: theme.border }]} />
            <Text style={[styles.driverId, { color: theme.textSecondary }]}>
              ID: {driver.id.toUpperCase()}
            </Text>
          </View>

          <View style={styles.statusRow}>
            <Badge status={driver.status} size="md" />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <AppButton
            title="Call Driver"
            onPress={handleCall}
            variant="primary"
            icon={<Ionicons name="call" size={18} color="#FFF" />}
          />
          <AppButton
            title="Assign Trip"
            onPress={() => router.push('/dispatch')}
            variant="outline"
            icon={<Ionicons name="paper-plane-outline" size={18} color={theme.primary} />}
          />
        </View>

        {/* Contact Info */}
        <View style={[styles.card, { backgroundColor: theme.cardBackground }, Shadows.small]}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="call-outline" size={16} color={theme.primary} />
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>CONTACT</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleCall}
            style={[styles.infoRow, { borderBottomColor: theme.borderLight }]}
          >
            <View style={styles.infoLeft}>
              <Ionicons name="call-outline" size={16} color={theme.textSecondary} />
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Phone</Text>
            </View>
            <Text style={[styles.infoValue, { color: theme.primary }]}>{driver.phone}</Text>
          </TouchableOpacity>

          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Ionicons name="mail-outline" size={16} color={theme.textSecondary} />
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Email</Text>
            </View>
            <Text style={[styles.infoValue, { color: theme.text }]}>{driver.email}</Text>
          </View>
        </View>

        {/* Current Assignment */}
        <View style={[styles.card, { backgroundColor: theme.cardBackground }, Shadows.small]}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="navigate-outline" size={16} color={theme.accent} />
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>CURRENT ASSIGNMENT</Text>
          </View>

          {driver.status === 'On Trip' ? (
            <View style={[styles.assignmentBox, { backgroundColor: theme.onTripLight, borderColor: theme.onTripBorder }]}>
              <View style={styles.assignmentHeader}>
                <Ionicons name="car-sport" size={16} color={theme.onTrip} />
                <Text style={[styles.assignmentTrip, { color: theme.onTrip }]}>
                  {driver.currentTripId ? `Trip #${driver.currentTripId.replace('trip-', '')}` : 'Active Trip'}
                </Text>
              </View>
              <Text style={[styles.assignmentRoute, { color: theme.text }]}>
                {driver.currentTripRoute || 'In Transit'}
              </Text>
            </View>
          ) : (
            <View style={[styles.standbyBox, { backgroundColor: theme.backgroundElement }]}>
              <Ionicons name="pause-circle-outline" size={18} color={theme.textMuted} />
              <Text style={[styles.standbyText, { color: theme.textSecondary }]}>
                No active trip. Driver is on standby.
              </Text>
            </View>
          )}
        </View>

        {/* Vehicle Info */}
        <View style={[styles.card, { backgroundColor: theme.cardBackground }, Shadows.small]}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="car-sport-outline" size={16} color={theme.secondary} />
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>VEHICLE</Text>
          </View>

          <View style={styles.vehicleRow}>
            <View style={[styles.vehicleIcon, { backgroundColor: theme.secondaryLight }]}>
              <Ionicons name="car-sport" size={20} color={theme.secondary} />
            </View>
            <View style={styles.vehicleInfo}>
              <Text style={[styles.vehicleModel, { color: theme.text }]}>
                {driver.assignedVehicleModel}
              </Text>
              <Text style={[styles.vehiclePlate, { color: theme.textSecondary }]}>
                {driver.assignedVehiclePlate}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/vehicles')}
              style={[styles.viewVehicleBtn, { backgroundColor: theme.secondaryLight }]}
            >
              <Text style={[styles.viewVehicleText, { color: theme.secondary }]}>View</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Today's Stats */}
        <View style={[styles.card, { backgroundColor: theme.cardBackground }, Shadows.small]}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="bar-chart-outline" size={16} color={theme.warning} />
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>TODAY</Text>
          </View>

          <View style={styles.statsGrid}>
            <View style={[styles.statItem, { backgroundColor: theme.backgroundElement }]}>
              <Text style={[styles.statValue, { color: theme.text }]}>{driver.todayTrips}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total</Text>
            </View>
            <View style={[styles.statItem, { backgroundColor: theme.availableLight }]}>
              <Text style={[styles.statValue, { color: theme.available }]}>{driver.completedTrips}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Done</Text>
            </View>
            <View style={[styles.statItem, { backgroundColor: theme.upcomingLight }]}>
              <Text style={[styles.statValue, { color: theme.upcoming }]}>{driver.upcomingTrips}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Next</Text>
            </View>
          </View>
        </View>

        {/* Performance */}
        <View style={[styles.card, { backgroundColor: theme.cardBackground }, Shadows.small]}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="speedometer-outline" size={16} color={theme.accent} />
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>PERFORMANCE</Text>
          </View>

          <View style={styles.perfGrid}>
            <View style={styles.perfItem}>
              <View style={[styles.perfCircle, { backgroundColor: theme.accentLight }]}>
                <Text style={[styles.perfValue, { color: theme.accent }]}>{driver.onTimePerformance}%</Text>
              </View>
              <Text style={[styles.perfLabel, { color: theme.textSecondary }]}>On-time</Text>
            </View>
            <View style={styles.perfItem}>
              <View style={[styles.perfCircle, { backgroundColor: theme.primaryLight }]}>
                <Text style={[styles.perfValue, { color: theme.primary }]}>{driver.acceptanceRate}%</Text>
              </View>
              <Text style={[styles.perfLabel, { color: theme.textSecondary }]}>Acceptance</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    padding: Spacing.base,
    paddingBottom: Spacing.xxl,
    gap: Spacing.md,
  },
  heroCard: {
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.1)',
  },
  avatarOuter: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  avatarInner: {
    width: 70,
    height: 70,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: Typography.fontSizes.hero,
    fontWeight: Typography.weights.bold,
  },
  driverName: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.weights.bold,
    letterSpacing: -0.3,
    marginBottom: Spacing.xs,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  ratingValue: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.semibold,
  },
  ratingDivider: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
  driverId: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.medium,
  },
  statusRow: {
    marginTop: Spacing.md,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  card: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.06)',
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.8,
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm + 2,
    borderBottomWidth: 1,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  infoLabel: {
    fontSize: Typography.fontSizes.sm,
  },
  infoValue: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  assignmentBox: {
    padding: Spacing.sm + 4,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  assignmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  assignmentTrip: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.bold,
  },
  assignmentRoute: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.semibold,
  },
  standbyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm + 4,
    borderRadius: BorderRadius.sm,
    gap: Spacing.sm,
  },
  standbyText: {
    fontSize: Typography.fontSizes.sm,
    flex: 1,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
  },
  vehicleIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleModel: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.bold,
  },
  vehiclePlate: {
    fontSize: Typography.fontSizes.sm,
    marginTop: 1,
  },
  viewVehicleBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.sm,
  },
  viewVehicleText: {
    fontSize: Typography.fontSizes.xs + 1,
    fontWeight: Typography.weights.semibold,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.sm + 4,
    borderRadius: BorderRadius.md,
    gap: 2,
  },
  statValue: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.weights.bold,
  },
  statLabel: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.medium,
  },
  perfGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.xs,
  },
  perfItem: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  perfCircle: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  perfValue: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.weights.bold,
  },
  perfLabel: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.medium,
  },
});
