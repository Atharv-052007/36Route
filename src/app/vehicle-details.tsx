import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { Header } from '@/components/ui/Header';
import { Badge } from '@/components/ui/Badge';
import { AppButton } from '@/components/ui/AppButton';

export default function VehicleDetailsScreen() {
  const router = useRouter();
  const { vehicles, selectedVehicleId, isDarkMode } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const vehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

  const handleChangeDriver = () => {
    router.push('/(admin)/people');
  };

  const handleViewMaintenance = () => {
    Alert.alert(
      'Maintenance Log',
      `${vehicle.model} (${vehicle.plateNumber})\nNext scheduled inspection in ${vehicle.nextServiceKm} km.\nAll mechanical audits logged at Pune Service Bay 4.`
    );
  };

  return (
    <View style={[styles.safe, { backgroundColor: theme.background }]}>
      <Header
        title={vehicle.model}
        subtitle={vehicle.plateNumber}
        showBack
        rightAction={<Badge status={vehicle.status} size="sm" />}
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Vehicle Card */}
        <View style={[styles.heroCard, { backgroundColor: theme.cardBackground }, Shadows.medium]}>
          <View style={[styles.vehicleSilhouette, { backgroundColor: theme.primaryLight }]}>
            <Ionicons name="car-sport" size={40} color={theme.primary} />
          </View>
          <Text style={[styles.vehicleModel, { color: theme.text }]}>{vehicle.model}</Text>
          <Text style={[styles.vehiclePlate, { color: theme.textSecondary }]}>{vehicle.plateNumber}</Text>
          <Badge status={vehicle.status} size="md" />
        </View>

        {/* Quick Actions */}
        <View style={styles.actionRow}>
          <AppButton
            title="Change Driver"
            onPress={handleChangeDriver}
            variant="primary"
            icon={<Ionicons name="person-circle-outline" size={18} color="#FFF" />}
          />
          <AppButton
            title="Maintenance"
            onPress={handleViewMaintenance}
            variant="outline"
            icon={<Ionicons name="build-outline" size={18} color={theme.primary} />}
          />
        </View>

        {/* Specs & Metrics */}
        <View style={[styles.card, { backgroundColor: theme.cardBackground }, Shadows.small]}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="information-circle-outline" size={16} color={theme.primary} />
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>SPECIFICATIONS</Text>
          </View>

          <View style={styles.specsGrid}>
            <View style={[styles.specItem, { backgroundColor: theme.backgroundElement }]}>
              <Ionicons name="people-outline" size={18} color={theme.primary} />
              <Text style={[styles.specValue, { color: theme.text }]}>{vehicle.capacity}</Text>
              <Text style={[styles.specLabel, { color: theme.textSecondary }]}>Seats</Text>
            </View>
            <View style={[styles.specItem, { backgroundColor: theme.backgroundElement }]}>
              <Ionicons name="speedometer-outline" size={18} color={theme.accent} />
              <Text style={[styles.specValue, { color: theme.text }]}>{vehicle.todayDistanceKm}</Text>
              <Text style={[styles.specLabel, { color: theme.textSecondary }]}>km today</Text>
            </View>
            <View style={[styles.specItem, { backgroundColor: theme.backgroundElement }]}>
              <Ionicons name="car-outline" size={18} color={theme.secondary} />
              <Text style={[styles.specValue, { color: theme.text }]}>{vehicle.todayTrips}</Text>
              <Text style={[styles.specLabel, { color: theme.textSecondary }]}>trips</Text>
            </View>
          </View>
        </View>

        {/* Current Driver */}
        <View style={[styles.card, { backgroundColor: theme.cardBackground }, Shadows.small]}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="person-outline" size={16} color={theme.accent} />
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>CURRENT DRIVER</Text>
          </View>

          {vehicle.currentDriverName ? (
            <View style={styles.driverRow}>
              <View style={[styles.driverAvatar, { backgroundColor: theme.accentLight }]}>
                <Text style={[styles.driverInitial, { color: theme.accent }]}>
                  {vehicle.currentDriverName.charAt(0)}
                </Text>
              </View>
              <View style={styles.driverInfo}>
                <Text style={[styles.driverName, { color: theme.text }]}>{vehicle.currentDriverName}</Text>
                <Text style={[styles.driverSub, { color: theme.textSecondary }]}>Assigned now</Text>
              </View>
              <TouchableOpacity
                style={[styles.changeDriverBtn, { backgroundColor: theme.backgroundElement }]}
                onPress={handleChangeDriver}
              >
                <Ionicons name="swap-horizontal" size={14} color={theme.text} />
                <Text style={[styles.changeDriverText, { color: theme.text }]}>Change</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={[styles.emptyDriver, { backgroundColor: theme.backgroundElement }]}>
              <Ionicons name="person-add-outline" size={20} color={theme.textMuted} />
              <Text style={[styles.emptyDriverText, { color: theme.textSecondary }]}>
                No driver currently assigned.
              </Text>
            </View>
          )}
        </View>

        {/* Documents */}
        <View style={[styles.card, { backgroundColor: theme.cardBackground }, Shadows.small]}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="document-text-outline" size={16} color={theme.secondary} />
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>DOCUMENTS</Text>
          </View>

          <View style={styles.docsList}>
            <View style={styles.docItem}>
              <View style={styles.docLeft}>
                <View style={[
                  styles.docIcon,
                  { backgroundColor: vehicle.documents.insurance ? theme.accentLight : theme.dangerLight }
                ]}>
                  <Ionicons
                    name={vehicle.documents.insurance ? 'checkmark' : 'close'}
                    size={14}
                    color={vehicle.documents.insurance ? theme.accent : theme.danger}
                  />
                </View>
                <Text style={[styles.docName, { color: theme.text }]}>Commercial Insurance</Text>
              </View>
              <Badge status={vehicle.documents.insurance ? 'Completed' : 'Cancelled'} size="sm" />
            </View>

            <View style={styles.docItem}>
              <View style={styles.docLeft}>
                <View style={[
                  styles.docIcon,
                  { backgroundColor: vehicle.documents.permit ? theme.accentLight : theme.dangerLight }
                ]}>
                  <Ionicons
                    name={vehicle.documents.permit ? 'checkmark' : 'close'}
                    size={14}
                    color={vehicle.documents.permit ? theme.accent : theme.danger}
                  />
                </View>
                <Text style={[styles.docName, { color: theme.text }]}>Tourist / State Permit</Text>
              </View>
              <Badge status={vehicle.documents.permit ? 'Completed' : 'Cancelled'} size="sm" />
            </View>

            <View style={[styles.docItem, { borderBottomWidth: 0 }]}>
              <View style={styles.docLeft}>
                <View style={[
                  styles.docIcon,
                  { backgroundColor: vehicle.documents.fitness ? theme.accentLight : theme.warningLight }
                ]}>
                  <Ionicons
                    name={vehicle.documents.fitness ? 'checkmark' : 'alert'}
                    size={14}
                    color={vehicle.documents.fitness ? theme.accent : theme.warning}
                  />
                </View>
                <Text style={[styles.docName, { color: theme.text }]}>RTO Fitness Certificate</Text>
              </View>
              <Badge
                status={vehicle.documents.fitness ? 'Completed' : 'Needs Attention'}
                size="sm"
              />
            </View>
          </View>
        </View>

        {/* Maintenance */}
        <View style={[styles.card, { backgroundColor: theme.cardBackground }, Shadows.small]}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="construct-outline" size={16} color={theme.warning} />
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>MAINTENANCE</Text>
          </View>

          <View style={[styles.maintenanceBox, { backgroundColor: theme.warningLight, borderColor: theme.warningBorder }]}>
            <View style={styles.maintenanceInfo}>
              <Text style={[styles.maintenanceTitle, { color: theme.text }]}>Next Service</Text>
              <Text style={[styles.maintenanceSub, { color: theme.textSecondary }]}>
                Regular oil & brake inspection
              </Text>
            </View>
            <View style={styles.maintenanceKm}>
              <Text style={[styles.kmValue, { color: theme.warning }]}>{vehicle.nextServiceKm.toLocaleString()}</Text>
              <Text style={[styles.kmUnit, { color: theme.textSecondary }]}>km</Text>
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
    gap: Spacing.sm,
  },
  vehicleSilhouette: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  vehicleModel: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.weights.bold,
    letterSpacing: -0.3,
  },
  vehiclePlate: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.medium,
    letterSpacing: 1,
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
  specsGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  specItem: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.sm + 4,
    borderRadius: BorderRadius.md,
    gap: 4,
  },
  specValue: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.weights.bold,
  },
  specLabel: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.medium,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
  },
  driverAvatar: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverInitial: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.weights.bold,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.bold,
  },
  driverSub: {
    fontSize: Typography.fontSizes.xs + 1,
    marginTop: 1,
  },
  changeDriverBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.sm,
  },
  changeDriverText: {
    fontSize: Typography.fontSizes.xs + 1,
    fontWeight: Typography.weights.semibold,
  },
  emptyDriver: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm + 4,
    borderRadius: BorderRadius.sm,
    gap: Spacing.sm,
  },
  emptyDriverText: {
    fontSize: Typography.fontSizes.sm,
    flex: 1,
  },
  docsList: {
    gap: Spacing.xs,
  },
  docItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.1)',
  },
  docLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
    flex: 1,
  },
  docIcon: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docName: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.medium,
  },
  maintenanceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.sm + 4,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  maintenanceInfo: {
    flex: 1,
  },
  maintenanceTitle: {
    fontSize: Typography.fontSizes.sm + 1,
    fontWeight: Typography.weights.semibold,
  },
  maintenanceSub: {
    fontSize: Typography.fontSizes.xs,
    marginTop: 2,
  },
  maintenanceKm: {
    alignItems: 'center',
  },
  kmValue: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.weights.bold,
  },
  kmUnit: {
    fontSize: Typography.fontSizes.xs,
  },
});
