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
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { Header } from '@/components/ui/Header';
import { Badge } from '@/components/ui/Badge';

export default function VehicleDetailsScreen() {
  const router = useRouter();
  const { vehicles, selectedVehicleId, isDarkMode } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const vehicle =
    vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

  const handleChangeDriver = () => {
    router.push('/(tabs)/people');
  };

  const handleViewMaintenance = () => {
    Alert.alert(
      'Maintenance Log',
      `${vehicle.model} (${vehicle.plateNumber})\nNext scheduled inspection in ${vehicle.nextServiceKm} km.\nAll mechanical audits logged at Pune Service Bay 4.`
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.cardBackground}
      />

      <Header
        title={vehicle.model}
        subtitle={vehicle.plateNumber}
        showBack
        rightAction={<Badge status={vehicle.status} size="sm" />}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Vehicle Header Card */}
        <View
          style={[
            styles.headerCard,
            { backgroundColor: theme.cardBackground, borderColor: theme.border },
          ]}
        >
          <View style={[styles.iconWrap, { backgroundColor: theme.backgroundElement }]}>
            <Ionicons name="car-sport" size={24} color={theme.accent} />
          </View>
          <View style={styles.headerInfo}>
            <Text style={[styles.vehicleModel, { color: theme.text }]}>
              {vehicle.model}
            </Text>
            <Text style={[styles.vehiclePlate, { color: theme.textSecondary }]}>
              {vehicle.plateNumber}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleChangeDriver}
            style={[styles.primaryActionBtn, { backgroundColor: theme.primary }]}
          >
            <Ionicons name="person-circle-outline" size={18} color="#FFFFFF" />
            <Text style={styles.primaryActionText}>Change Driver</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleViewMaintenance}
            style={[
              styles.secondaryActionBtn,
              { backgroundColor: theme.cardBackground, borderColor: theme.border },
            ]}
          >
            <Ionicons name="build-outline" size={18} color={theme.text} />
            <Text style={[styles.secondaryActionText, { color: theme.text }]}>
              View Maintenance
            </Text>
          </TouchableOpacity>
        </View>

        {/* SPECS & METRICS Section */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.cardBackground, borderColor: theme.border },
          ]}
        >
          <View style={[styles.metricRow, { borderBottomColor: theme.borderLight }]}>
            <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
              Capacity
            </Text>
            <Text style={[styles.metricValue, { color: theme.text }]}>
              {vehicle.capacity} passengers
            </Text>
          </View>

          <View style={[styles.metricRow, { borderBottomColor: theme.borderLight }]}>
            <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
              Current Driver
            </Text>
            <Text style={[styles.metricValue, { color: theme.accent }]}>
              {vehicle.currentDriverName || 'None assigned'}
            </Text>
          </View>

          <View style={[styles.metricRow, { borderBottomColor: theme.borderLight }]}>
            <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
              Today's Trips
            </Text>
            <Text style={[styles.metricValue, { color: theme.text }]}>
              {vehicle.todayTrips} trips
            </Text>
          </View>

          <View style={styles.metricRow}>
            <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
              Distance
            </Text>
            <Text style={[styles.metricValue, { color: theme.text }]}>
              {vehicle.todayDistanceKm} km
            </Text>
          </View>
        </View>

        {/* DOCUMENTS Section */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.cardBackground, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            DOCUMENTS
          </Text>

          <View style={styles.docsList}>
            <View style={styles.docItem}>
              <View style={styles.docLeft}>
                <Ionicons
                  name={vehicle.documents.insurance ? 'checkmark-circle' : 'close-circle'}
                  size={18}
                  color={vehicle.documents.insurance ? theme.available : theme.danger}
                />
                <Text style={[styles.docName, { color: theme.text }]}>
                  Commercial Insurance
                </Text>
              </View>
              <Text style={[styles.docStatus, { color: theme.available }]}>
                Verified ✓
              </Text>
            </View>

            <View style={styles.docItem}>
              <View style={styles.docLeft}>
                <Ionicons
                  name={vehicle.documents.permit ? 'checkmark-circle' : 'close-circle'}
                  size={18}
                  color={vehicle.documents.permit ? theme.available : theme.danger}
                />
                <Text style={[styles.docName, { color: theme.text }]}>
                  All India Tourist / State Permit
                </Text>
              </View>
              <Text style={[styles.docStatus, { color: theme.available }]}>
                Active ✓
              </Text>
            </View>

            <View style={styles.docItem}>
              <View style={styles.docLeft}>
                <Ionicons
                  name={vehicle.documents.fitness ? 'checkmark-circle' : 'alert-circle'}
                  size={18}
                  color={vehicle.documents.fitness ? theme.available : theme.warning}
                />
                <Text style={[styles.docName, { color: theme.text }]}>
                  RTO Fitness Certificate
                </Text>
              </View>
              <Text
                style={[
                  styles.docStatus,
                  {
                    color: vehicle.documents.fitness ? theme.available : theme.warning,
                  },
                ]}
              >
                {vehicle.documents.fitness ? 'Valid ✓' : 'Due for inspection'}
              </Text>
            </View>
          </View>
        </View>

        {/* MAINTENANCE Section */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.cardBackground, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            MAINTENANCE
          </Text>
          <View style={styles.serviceRow}>
            <View>
              <Text style={[styles.serviceTitle, { color: theme.text }]}>
                Next service
              </Text>
              <Text style={[styles.serviceSubtitle, { color: theme.textSecondary }]}>
                Regular oil & brake inspection
              </Text>
            </View>
            <Text style={[styles.serviceKm, { color: theme.text }]}>
              {vehicle.nextServiceKm.toLocaleString()} km
            </Text>
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
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  headerInfo: {
    flex: 1,
  },
  vehicleModel: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.weights.bold,
  },
  vehiclePlate: {
    fontSize: Typography.fontSizes.sm,
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
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  metricLabel: {
    fontSize: Typography.fontSizes.sm,
  },
  metricValue: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  docsList: {
    gap: Spacing.sm,
  },
  docItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  docLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  docName: {
    fontSize: Typography.fontSizes.sm,
  },
  docStatus: {
    fontSize: Typography.fontSizes.xs + 1,
    fontWeight: Typography.weights.semibold,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  serviceTitle: {
    fontSize: Typography.fontSizes.sm + 1,
    fontWeight: Typography.weights.semibold,
  },
  serviceSubtitle: {
    fontSize: Typography.fontSizes.xs,
    marginTop: 2,
  },
  serviceKm: {
    fontSize: Typography.fontSizes.base,
    fontWeight: Typography.weights.bold,
  },
});
