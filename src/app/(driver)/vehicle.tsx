import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { AppSafeAreaView } from '@/components/ui/AppSafeAreaView';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../../context/AppContext';
import { Typography, BorderRadius, Shadows, Spacing } from '../../constants/theme';
import { StatusBadge } from '../../components/ui/AppStates';
import { Header } from '@/components/ui/Header';

const INSPECTIONS = [
  { label: 'Engine Oil', icon: 'water-outline', ok: true },
  { label: 'Brakes', icon: 'stop-circle-outline', ok: true },
  { label: 'Tyres', icon: 'ellipse-outline', ok: true },
  { label: 'Lights', icon: 'bulb-outline', ok: true },
  { label: 'Fuel Level', icon: 'speedometer-outline', ok: true },
];

const ISSUES = [
  { label: 'AC not cooling', severity: 'medium', icon: 'snow-outline' },
];

export default function DriverVehicleScreen() {
  const router = useRouter();
  const { activeRide, themeColors } = useApp();
  const vehicle = activeRide?.vehicle;

  return (
    <AppSafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <Header title="Vehicle" showBack />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Vehicle Info Card */}
        <View style={[styles.vehicleCard, { backgroundColor: themeColors.cardBackground }, Shadows.card]}>
          <View style={[styles.vehicleHero, { backgroundColor: themeColors.secondaryLight }]}>
            <Ionicons name="bus" size={36} color={themeColors.secondary} />
          </View>
          <Text style={[styles.vehicleModel, { color: themeColors.text }]}>
            {vehicle?.model || 'Not assigned'}
          </Text>
          <Text style={[styles.vehicleNumber, { color: themeColors.textSecondary }]}>
            {vehicle?.vehicleNumber || '—'}
          </Text>
          {vehicle && (
            <View style={{ marginTop: 10 }}>
              <StatusBadge status={vehicle.status} size="md" />
            </View>
          )}

          <View style={[styles.detailGrid, { borderTopColor: themeColors.borderLight }]}>
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: themeColors.textMuted }]}>Type</Text>
              <Text style={[styles.detailValue, { color: themeColors.text }]}>{vehicle?.vehicleType || '—'}</Text>
            </View>
            <View style={[styles.detailItem, { borderLeftColor: themeColors.borderLight, borderLeftWidth: 1, paddingLeft: 16 }]}>
              <Text style={[styles.detailLabel, { color: themeColors.textMuted }]}>Capacity</Text>
              <Text style={[styles.detailValue, { color: themeColors.text }]}>{vehicle?.capacity || '—'} seats</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: themeColors.textMuted }]}>Insurance</Text>
              <Text style={[styles.detailValue, { color: themeColors.text }]}>{vehicle?.insuranceExpiry || '—'}</Text>
            </View>
            <View style={[styles.detailItem, { borderLeftColor: themeColors.borderLight, borderLeftWidth: 1, paddingLeft: 16 }]}>
              <Text style={[styles.detailLabel, { color: themeColors.textMuted }]}>Fitness</Text>
              <Text style={[styles.detailValue, { color: themeColors.text }]}>{vehicle?.fitnessCertificate || '—'}</Text>
            </View>
          </View>
        </View>

        {/* Pre-Trip Inspection */}
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Pre-Trip Inspection</Text>
        <View style={[styles.inspectionCard, { backgroundColor: themeColors.cardBackground }, Shadows.card]}>
          {INSPECTIONS.map((item, index) => (
            <View
              key={item.label}
              style={[styles.checkRow, index > 0 && { borderTopColor: themeColors.borderLight, borderTopWidth: 1 }]}
            >
              <View style={[styles.checkIconWrap, { backgroundColor: item.ok ? themeColors.accentLight : themeColors.dangerLight }]}>
                <Ionicons name={item.ok ? 'checkmark' : 'close'} size={14} color={item.ok ? themeColors.accent : themeColors.danger} />
              </View>
              <Ionicons name={item.icon as any} size={18} color={themeColors.textMuted} />
              <Text style={[styles.checkLabel, { color: themeColors.text }]}>{item.label}</Text>
              <Text style={[styles.checkStatus, { color: item.ok ? themeColors.accent : themeColors.danger }]}>
                {item.ok ? 'OK' : 'Issue'}
              </Text>
            </View>
          ))}
        </View>

        {/* Maintenance Issues */}
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Maintenance Issues</Text>
        {ISSUES.length === 0 ? (
          <View style={[styles.noIssueCard, { backgroundColor: themeColors.cardBackground }, Shadows.small]}>
            <Ionicons name="checkmark-circle" size={24} color={themeColors.accent} />
            <Text style={[styles.noIssueText, { color: themeColors.textSecondary }]}>No issues reported. Vehicle is in good condition.</Text>
          </View>
        ) : (
          ISSUES.map((issue) => (
            <View key={issue.label} style={[styles.issueCard, { backgroundColor: themeColors.warningLight, borderColor: themeColors.warning }]}>
              <View style={[styles.issueIconWrap, { backgroundColor: themeColors.warning }]}>
                <Ionicons name={issue.icon as any} size={18} color="#FFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.issueLabel, { color: themeColors.text }]}>{issue.label}</Text>
                <Text style={[styles.issueSeverity, { color: themeColors.warning }]}>
                  {issue.severity} severity
                </Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/sos')}>
                <Ionicons name="create-outline" size={18} color={themeColors.warning} />
              </TouchableOpacity>
            </View>
          ))
        )}

        {/* Report Button */}
        <TouchableOpacity style={[styles.reportBtn, { backgroundColor: themeColors.secondary }]} activeOpacity={0.8}>
          <Ionicons name="add-circle-outline" size={18} color="#FFF" />
          <Text style={styles.reportText}>Report New Issue</Text>
        </TouchableOpacity>
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: Spacing.base, paddingBottom: 40 },
  vehicleCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  vehicleHero: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  vehicleModel: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.weights.bold as any,
    textAlign: 'center',
  },
  vehicleNumber: {
    fontSize: Typography.fontSizes.sm,
    textAlign: 'center',
    marginTop: 3,
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    paddingTop: 16,
    marginTop: 16,
    borderTopWidth: 1,
  },
  detailItem: {
    width: '50%',
    marginBottom: 14,
  },
  detailLabel: { fontSize: Typography.fontSizes.xs },
  detailValue: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.semibold as any,
    marginTop: 3,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.bold as any,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  inspectionCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    padding: 4,
    marginBottom: 20,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    gap: 10,
  },
  checkIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkLabel: { flex: 1, fontSize: Typography.fontSizes.md },
  checkStatus: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold as any,
  },
  noIssueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    gap: 12,
    marginBottom: 20,
  },
  noIssueText: { fontSize: Typography.fontSizes.sm, flex: 1 },
  issueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: 10,
    gap: 12,
  },
  issueIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  issueLabel: { fontSize: Typography.fontSizes.md, fontWeight: Typography.weights.semibold as any },
  issueSeverity: { fontSize: Typography.fontSizes.xs, marginTop: 2, textTransform: 'capitalize' },
  reportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: BorderRadius.lg,
    gap: 8,
  },
  reportText: { color: '#FFF', fontSize: Typography.fontSizes.md, fontWeight: Typography.weights.semibold as any },
});
