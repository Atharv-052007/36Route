import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../context/AppContext';
import { Typography, Shadows } from '../constants/theme';
import { AppButton } from '../components/ui/AppButton';
import { ConfirmationModal } from '../components/ui/AppStates';

export default function SOSScreen() {
  const router = useRouter();
  const { employee, activeRide, themeColors } = useApp();

  const [confirmSOS, setConfirmSOS] = useState(false);
  const [sosActive, setSosActive] = useState(false);

  const handleTriggerSOS = () => {
    setConfirmSOS(false);
    setSosActive(true);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={themeColors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: themeColors.danger }]}>Emergency & Security SOS</Text>
        </View>

        {/* SOS Trigger Hero Circle */}
        <View style={styles.heroContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.sosCircleBig,
              { backgroundColor: sosActive ? '#DC2626' : themeColors.danger },
              Shadows.large,
            ]}
            onPress={() => setConfirmSOS(true)}
          >
            <Ionicons name="alert-circle" size={64} color="#FFFFFF" />
            <Text style={styles.sosCircleText}>{sosActive ? 'SOS TRIGGERED' : 'PRESS FOR SOS'}</Text>
          </TouchableOpacity>
          <Text style={[styles.sosNoticeText, { color: themeColors.textSecondary }]}>
            {sosActive
              ? '🚨 Emergency broadcast is active! Corporate control room & emergency contacts notified with real-time GPS.'
              : 'Pressing the button will immediately broadcast your GPS coordinates to Corporate Transport Security, 24/7 Helpline, and your Emergency Contacts.'}
          </Text>
        </View>

        {/* Live Trip Information Box */}
        {activeRide && (
          <View
            style={[
              styles.infoCard,
              { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border },
              Shadows.small,
            ]}
          >
            <View style={styles.cardHeader}>
              <Ionicons name="bus-outline" size={20} color={themeColors.primary} />
              <Text style={[styles.cardTitle, { color: themeColors.text }]}>Active Ride Tracking Data</Text>
            </View>

            <View style={[styles.divider, { borderTopColor: themeColors.border }]} />

            <Text style={[styles.infoRowText, { color: themeColors.text }]}>
              Booking ID: <Text style={{ fontWeight: '700' }}>{activeRide.bookingId}</Text>
            </Text>
            {activeRide.driver && (
              <Text style={[styles.infoRowText, { color: themeColors.text }]}>
                Driver: {activeRide.driver.name} ({activeRide.driver.phone})
              </Text>
            )}
            {activeRide.vehicle && (
              <Text style={[styles.infoRowText, { color: themeColors.text }]}>
                Vehicle: {activeRide.vehicle.model} ({activeRide.vehicle.numberPlate})
              </Text>
            )}
            <Text style={[styles.infoRowText, { color: themeColors.text }]}>
              Current GPS: 12.875° N, 77.658° E (Electronic City Phase 1)
            </Text>
          </View>
        )}

        {/* Emergency Contacts Card */}
        <View
          style={[
            styles.infoCard,
            { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border },
            Shadows.small,
          ]}
        >
          <View style={styles.cardHeader}>
            <Ionicons name="people-outline" size={20} color={themeColors.primary} />
            <Text style={[styles.cardTitle, { color: themeColors.text }]}>Registered Emergency Contacts</Text>
          </View>

          <View style={[styles.divider, { borderTopColor: themeColors.border }]} />

          <View style={styles.contactRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.contactName, { color: themeColors.text }]}>
                {employee?.emergencyContact.name} ({employee?.emergencyContact.relationship})
              </Text>
              <Text style={[styles.contactPhone, { color: themeColors.textSecondary }]}>
                {employee?.emergencyContact.phone}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.callBtnSmall, { backgroundColor: themeColors.accentLight }]}
              onPress={() => Alert.alert('Calling Contact', `Dialing ${employee?.emergencyContact.phone}`)}
            >
              <Ionicons name="call-outline" size={18} color={themeColors.accent} />
            </TouchableOpacity>
          </View>

          <View style={styles.contactRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.contactName, { color: themeColors.text }]}>
                Corporate Transport Command Room
              </Text>
              <Text style={[styles.contactPhone, { color: themeColors.textSecondary }]}>
                +91 1800 36 3636 (Toll-Free 24/7)
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.callBtnSmall, { backgroundColor: themeColors.primaryLight }]}
              onPress={() => Alert.alert('Calling Command Room', 'Dialing 1800 36 3636')}
            >
              <Ionicons name="call-outline" size={18} color={themeColors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {sosActive && (
          <AppButton
            title="Cancel Emergency Broadcast"
            onPress={() => setSosActive(false)}
            variant="outline"
            size="lg"
            style={{ marginTop: 20 }}
          />
        )}
      </ScrollView>

      {/* Confirmation Modal */}
      <ConfirmationModal
        visible={confirmSOS}
        title="⚠️ Trigger Emergency SOS?"
        message="Are you sure you want to trigger emergency SOS? This will immediately alert Corporate Security, Control Desk, and send your location to emergency contacts."
        confirmText="TRIGGER SOS NOW"
        cancelText="Cancel"
        isDanger
        onConfirm={handleTriggerSOS}
        onCancel={() => setConfirmSOS(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    padding: 18,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backBtn: {
    marginRight: 12,
  },
  title: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.weights.bold as any,
  },
  heroContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  sosCircleBig: {
    width: 170,
    height: 170,
    borderRadius: 85,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  sosCircleText: {
    color: '#FFF',
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.bold as any,
    marginTop: 6,
    letterSpacing: 1,
  },
  sosNoticeText: {
    textAlign: 'center',
    fontSize: Typography.fontSizes.xs,
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  infoCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.bold as any,
    marginLeft: 8,
  },
  divider: {
    borderTopWidth: 1,
    marginVertical: 12,
  },
  infoRowText: {
    fontSize: Typography.fontSizes.sm,
    marginVertical: 4,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  contactName: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.bold as any,
  },
  contactPhone: {
    fontSize: Typography.fontSizes.xs,
    marginTop: 2,
  },
  callBtnSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
