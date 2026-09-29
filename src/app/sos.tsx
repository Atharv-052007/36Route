import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { AppSafeAreaView } from '@/components/ui/AppSafeAreaView';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { Typography, BorderRadius, Shadows, Spacing } from '@/constants/theme';
import { ConfirmationModal } from '@/components/ui/AppStates';
import { Header } from '@/components/ui/Header';
import { Badge } from '@/components/ui/Badge';

export default function SOSScreen() {
  const router = useRouter();
  const { employee, activeRide, themeColors } = useApp();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [sosActive, setSosActive] = useState(false);

  const triggerSOS = () => {
    setSosActive(true);
    setConfirmVisible(false);
    Alert.alert('SOS Activated', 'Emergency services have been notified. Stay calm.');
  };

  return (
    <AppSafeAreaView style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <Header title="Emergency SOS" showBack live={sosActive} />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero SOS Button */}
        <View style={styles.heroSection}>
          <View style={[styles.sosOuterRing, { borderColor: sosActive ? themeColors.danger : `${themeColors.danger}30` }]}>
            <View style={[styles.sosMiddleRing, { backgroundColor: `${themeColors.danger}10` }]}>
              <TouchableOpacity
                onPress={() => sosActive ? null : setConfirmVisible(true)}
                style={[styles.sosButton, { backgroundColor: themeColors.danger }, sosActive && styles.sosButtonActive]}
                activeOpacity={0.8}
              >
                <Ionicons name={sosActive ? 'shield-checkmark' : 'alert'} size={48} color="#FFF" />
                <Text style={styles.sosLabel}>{sosActive ? 'SOS ACTIVE' : 'SOS'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={[styles.heroTitle, { color: themeColors.text }]}>Emergency SOS</Text>
          <Text style={[styles.heroSubtitle, { color: themeColors.textSecondary }]}>
            {sosActive
              ? 'Emergency broadcast active. Help is on the way.'
              : 'Press and hold to alert emergency services'}
          </Text>

          {sosActive && (
            <TouchableOpacity
              style={[styles.cancelBtn, { backgroundColor: themeColors.backgroundElement }]}
              onPress={() => setSosActive(false)}
            >
              <Ionicons name="close-circle" size={18} color={themeColors.danger} />
              <Text style={[styles.cancelText, { color: themeColors.danger }]}>Cancel Emergency</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Live Trip Info */}
        {activeRide && (
          <View style={[styles.card, { backgroundColor: themeColors.cardBackground }, Shadows.card]}>
            <View style={styles.cardHeader}>
              <Ionicons name="information-circle" size={18} color={themeColors.secondary} />
              <Text style={[styles.cardTitle, { color: themeColors.text }]}>Live Trip Info</Text>
              <Badge status="On Trip" size="sm" />
            </View>
            <View style={[styles.infoRow, { borderTopColor: themeColors.borderLight }]}>
              <Ionicons name="car-sport" size={16} color={themeColors.textMuted} />
              <Text style={[styles.infoText, { color: themeColors.textSecondary }]}>
                {activeRide.vehicle?.model} • {activeRide.vehicle?.vehicleNumber}
              </Text>
            </View>
            <View style={[styles.infoRow, { borderTopColor: themeColors.borderLight }]}>
              <Ionicons name="person" size={16} color={themeColors.textMuted} />
              <Text style={[styles.infoText, { color: themeColors.textSecondary }]}>
                {activeRide.driver?.name} • {activeRide.driver?.phone}
              </Text>
            </View>
            <View style={[styles.infoRow, { borderTopColor: themeColors.borderLight }]}>
              <Ionicons name="location" size={16} color={themeColors.textMuted} />
              <Text style={[styles.infoText, { color: themeColors.textSecondary }]}>
                {activeRide.pickup.name}
              </Text>
            </View>
          </View>
        )}

        {/* Emergency Contacts */}
        <View style={[styles.card, { backgroundColor: themeColors.cardBackground }, Shadows.card]}>
          <View style={styles.cardHeader}>
            <Ionicons name="call" size={18} color={themeColors.danger} />
            <Text style={[styles.cardTitle, { color: themeColors.text }]}>Emergency Contacts</Text>
          </View>

          <TouchableOpacity
            style={[styles.contactItem, { borderTopColor: themeColors.borderLight }]}
            onPress={() => Alert.alert('Calling', `Calling ${employee?.emergencyContact.name}...`)}
          >
            <View style={[styles.contactAvatar, { backgroundColor: themeColors.dangerLight }]}>
              <Text style={[styles.contactInitial, { color: themeColors.danger }]}>
                {employee?.emergencyContact.name?.charAt(0) || 'E'}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.contactName, { color: themeColors.text }]}>{employee?.emergencyContact.name}</Text>
              <Text style={[styles.contactRel, { color: themeColors.textSecondary }]}>{employee?.emergencyContact.relationship}</Text>
            </View>
            <View style={[styles.callBtn, { backgroundColor: themeColors.accentLight }]}>
              <Ionicons name="call" size={16} color={themeColors.accent} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.contactItem, { borderTopColor: themeColors.borderLight }]}
            onPress={() => Alert.alert('Calling', 'Calling Transport Control...')}
          >
            <View style={[styles.contactAvatar, { backgroundColor: themeColors.secondaryLight }]}>
              <Ionicons name="bus" size={18} color={themeColors.secondary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.contactName, { color: themeColors.text }]}>Transport Control</Text>
              <Text style={[styles.contactRel, { color: themeColors.textSecondary }]}>24/7 Helpline</Text>
            </View>
            <View style={[styles.callBtn, { backgroundColor: themeColors.accentLight }]}>
              <Ionicons name="call" size={16} color={themeColors.accent} />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ConfirmationModal
        visible={confirmVisible}
        title="Trigger SOS?"
        message="This will alert transport control and emergency contacts immediately. Only use in real emergencies."
        confirmText="Yes, Trigger SOS"
        onConfirm={triggerSOS}
        onCancel={() => setConfirmVisible(false)}
        variant="danger"
      />
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: Spacing.base, paddingBottom: 40 },
  heroSection: { alignItems: 'center', paddingVertical: 24 },
  sosOuterRing: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  sosMiddleRing: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  sosButtonActive: {
    shadowOpacity: 0.6,
    shadowRadius: 24,
  },
  sosLabel: {
    color: '#FFF',
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.weights.bold as any,
    marginTop: 4,
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.weights.bold as any,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: Typography.fontSizes.sm,
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 20,
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: BorderRadius.full,
    gap: 8,
    marginTop: 16,
  },
  cancelText: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.semibold as any,
  },
  card: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    padding: Spacing.base,
    marginBottom: Spacing.base,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.bold as any,
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  infoText: { fontSize: Typography.fontSizes.sm, flex: 1 },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    gap: 12,
  },
  contactAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactInitial: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.weights.bold as any,
  },
  contactName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.semibold as any,
  },
  contactRel: { fontSize: Typography.fontSizes.xs, marginTop: 2 },
  callBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
