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
import { Typography, BorderRadius, Shadows } from '../../constants/theme';
import { StatusBadge } from '../../components/ui/AppStates';
import Animated, { FadeInUp, FadeInDown, SlideInRight } from 'react-native-reanimated';

const INSPECTIONS = [
  { label: 'Engine Oil', ok: true },
  { label: 'Brakes', ok: true },
  { label: 'Tyres', ok: true },
  { label: 'Lights', ok: true },
  { label: 'Fuel Level', ok: true },
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
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <Text style={[styles.headerTitle, { color: themeColors.text }]}>Vehicle</Text>
        </Animated.View>

        {/* Vehicle Details */}
        <Animated.View entering={FadeInUp.duration(400).springify()} style={[styles.card, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }, Shadows.small]}>
          <View style={[styles.vehicleHero, { backgroundColor: themeColors.secondaryLight }]}>
            <Ionicons name="bus" size={40} color={themeColors.secondary} />
          </View>
          <Text style={[styles.vehicleModel, { color: themeColors.text }]}>
            {vehicle?.model || 'Not assigned'}
          </Text>
          <Text style={[styles.vehicleNumber, { color: themeColors.textSecondary }]}>
            {vehicle?.vehicleNumber || '—'}
          </Text>
          {vehicle && (
            <View style={styles.badgeWrap}>
              <StatusBadge status={vehicle.status} size="sm" />
            </View>
          )}

          <View style={[styles.detailGrid, { borderTopColor: themeColors.borderLight, borderTopWidth: 1 }]}>
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: themeColors.textMuted }]}>Type</Text>
              <Text style={[styles.detailValue, { color: themeColors.text }]}>{vehicle?.vehicleType || '—'}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: themeColors.textMuted }]}>Capacity</Text>
              <Text style={[styles.detailValue, { color: themeColors.text }]}>{vehicle?.capacity || '—'} seats</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: themeColors.textMuted }]}>Insurance</Text>
              <Text style={[styles.detailValue, { color: themeColors.text }]}>{vehicle?.insuranceExpiry || '—'}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: themeColors.textMuted }]}>Fitness</Text>
              <Text style={[styles.detailValue, { color: themeColors.text }]}>{vehicle?.fitnessCertificate || '—'}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Vehicle Inspection */}
        <Animated.View entering={FadeInUp.delay(150).duration(400)}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Pre-Trip Inspection</Text>
          <View style={[styles.card, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
            {INSPECTIONS.map((item, index) => (
              <View key={item.label} style={[styles.checkRow, index > 0 && { borderTopColor: themeColors.borderLight, borderTopWidth: 1 }]}>
                <Ionicons name={item.ok ? 'checkmark-circle' : 'close-circle'} size={20} color={item.ok ? themeColors.accent : themeColors.danger} />
                <Text style={[styles.checkLabel, { color: themeColors.text }]}>{item.label}</Text>
                <Text style={[styles.checkStatus, { color: item.ok ? themeColors.accent : themeColors.danger }]}>
                  {item.ok ? 'OK' : 'Needs attention'}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Maintenance Issues */}
        <Animated.View entering={FadeInUp.delay(250).duration(400)}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Maintenance Issues</Text>
          {ISSUES.length === 0 ? (
            <View style={[styles.card, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
              <Text style={[styles.noIssueText, { color: themeColors.textMuted }]}>No reported issues. Vehicle is in good condition.</Text>
            </View>
          ) : (
            ISSUES.map((issue) => (
              <Animated.View key={issue.label} entering={SlideInRight.duration(300)}>
                <View style={[styles.issueRow, { backgroundColor: themeColors.warningLight, borderColor: themeColors.warning }]}>
                  <Ionicons name={issue.icon as any} size={20} color={themeColors.warning} />
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
              </Animated.View>
            ))
          )}
        </Animated.View>

        {/* Report Button */}
        <Animated.View entering={FadeInUp.delay(350).duration(400)}>
          <TouchableOpacity style={[styles.reportBtn, { backgroundColor: themeColors.secondary }]}>
            <Ionicons name="add-circle-outline" size={18} color="#FFF" />
            <Text style={styles.reportText}>Report Issue</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 18, paddingBottom: 40 },
  header: { marginBottom: 16 },
  headerTitle: { fontSize: Typography.fontSizes.xl, fontWeight: Typography.weights.bold as any },
  card: { borderRadius: BorderRadius.md, borderWidth: 1, padding: 16, marginBottom: 16 },
  vehicleHero: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },
  vehicleModel: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.weights.bold as any,
    textAlign: 'center',
  },
  vehicleNumber: { fontSize: Typography.fontSizes.sm, textAlign: 'center', marginTop: 2 },
  badgeWrap: { alignItems: 'center', marginTop: 10, marginBottom: 16 },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 16,
  },
  detailItem: { width: '50%', marginBottom: 12 },
  detailLabel: { fontSize: Typography.fontSizes.xs },
  detailValue: { fontSize: Typography.fontSizes.md, fontWeight: Typography.weights.semibold as any, marginTop: 2 },
  sectionTitle: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold as any,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 4,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 10,
  },
  checkLabel: { flex: 1, fontSize: Typography.fontSizes.md },
  checkStatus: { fontSize: Typography.fontSizes.sm, fontWeight: Typography.weights.semibold as any },
  noIssueText: { fontSize: Typography.fontSizes.sm },
  issueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: 10,
    gap: 12,
  },
  issueLabel: { fontSize: Typography.fontSizes.md, fontWeight: Typography.weights.semibold as any },
  issueSeverity: { fontSize: Typography.fontSizes.xs, marginTop: 2, textTransform: 'capitalize' },
  reportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: BorderRadius.md,
    gap: 8,
  },
  reportText: { color: '#FFF', fontSize: Typography.fontSizes.md, fontWeight: Typography.weights.semibold as any },
});
