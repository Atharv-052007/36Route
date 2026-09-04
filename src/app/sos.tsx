import React, { useState, useEffect } from 'react';
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
import { Typography, BorderRadius, Shadows } from '@/constants/theme';
import { ConfirmationModal } from '@/components/ui/AppStates';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  FadeInUp,
  FadeIn,
  SlideInRight,
} from 'react-native-reanimated';

export default function SOSScreen() {
  const router = useRouter();
  const { employee, activeRide, themeColors } = useApp();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [sosActive, setSosActive] = useState(false);

  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.4);
  const innerPulseScale = useSharedValue(1);

  useEffect(() => {
    if (!sosActive) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.8, { duration: 1200 }),
          withTiming(1, { duration: 1200 })
        ),
        -1,
        false
      );
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0, { duration: 1200 }),
          withTiming(0.4, { duration: 1200 })
        ),
        -1,
        false
      );
      innerPulseScale.value = withRepeat(
        withSequence(
          withTiming(1.08, { duration: 800 }),
          withTiming(1, { duration: 800 })
        ),
        -1,
        false
      );
    } else {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(2, { duration: 600 }),
          withTiming(1, { duration: 600 })
        ),
        -1,
        false
      );
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0, { duration: 600 }),
          withTiming(0.6, { duration: 600 })
        ),
        -1,
        false
      );
      innerPulseScale.value = withSpring(1.05);
    }
  }, [sosActive]);

  const pulseAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  const innerAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: innerPulseScale.value }],
  }));

  const triggerSOS = () => {
    setSosActive(true);
    setConfirmVisible(false);
    Alert.alert('SOS Activated', 'Emergency services have been notified. Stay calm.');
  };

  return (
    <AppSafeAreaView style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
          <TouchableOpacity
            onPress={() => router.dismissTo('/(tabs)')}
            style={[styles.backBtn, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}
          >
            <Ionicons name="arrow-back" size={20} color={themeColors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: themeColors.text }]}>Emergency SOS</Text>
          <View style={{ width: 40 }} />
        </Animated.View>

        {/* SOS Button with Pulse Animation */}
        <Animated.View entering={FadeInUp.delay(200).duration(600)} style={styles.sosContainer}>
          {/* Outer Pulse Ring */}
          <View style={styles.sosOuter}>
            <Animated.View
              style={[
                styles.pulseRing,
                { backgroundColor: sosActive ? '#D9534F' : '#D9534F' },
                pulseAnimStyle,
              ]}
            />
          </View>

          {/* Main SOS Button */}
          <Animated.View style={innerAnimStyle}>
            <TouchableOpacity
              onPress={() => sosActive ? null : setConfirmVisible(true)}
              style={[styles.sosBtn, sosActive && styles.sosBtnActive]}
              activeOpacity={0.8}
            >
              <Ionicons name="alert" size={48} color="#FFF" />
              <Text style={styles.sosBtnText}>{sosActive ? 'SOS ACTIVE' : 'SOS'}</Text>
            </TouchableOpacity>
          </Animated.View>

          {sosActive && (
            <Animated.View entering={FadeInUp.duration(400)}>
              <Text style={[styles.sosStatus, { color: themeColors.danger }]}>
                Emergency broadcast active. Help is on the way.
              </Text>
            </Animated.View>
          )}
        </Animated.View>

        {/* Live Trip Info */}
        {activeRide && (
          <Animated.View entering={SlideInRight.delay(300).duration(400).springify()} style={[styles.tripInfo, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }, Shadows.small]}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Live Trip Info</Text>
            <View style={styles.tripRow}>
              <Ionicons name="car-sport" size={16} color={themeColors.textMuted} />
              <Text style={[styles.tripText, { color: themeColors.textSecondary }]}>
                {activeRide.vehicle?.model} • {activeRide.vehicle?.vehicleNumber}
              </Text>
            </View>
            <View style={styles.tripRow}>
              <Ionicons name="person" size={16} color={themeColors.textMuted} />
              <Text style={[styles.tripText, { color: themeColors.textSecondary }]}>
                {activeRide.driver?.name} • {activeRide.driver?.phone}
              </Text>
            </View>
            <View style={styles.tripRow}>
              <Ionicons name="location" size={16} color={themeColors.textMuted} />
              <Text style={[styles.tripText, { color: themeColors.textSecondary }]}>
                {activeRide.pickup.name}
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Emergency Contacts */}
        <Animated.View entering={SlideInRight.delay(400).duration(400).springify()} style={[styles.contactsCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }, Shadows.small]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Emergency Contacts</Text>

          <TouchableOpacity
            style={[styles.contactItem, { borderBottomColor: themeColors.borderLight }]}
            onPress={() => Alert.alert('Calling', `Calling ${employee?.emergencyContact.name}...`)}
          >
            <View style={[styles.contactIcon, { backgroundColor: themeColors.dangerLight }]}>
              <Ionicons name="person" size={18} color={themeColors.danger} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.contactName, { color: themeColors.text }]}>{employee?.emergencyContact.name}</Text>
              <Text style={[styles.contactRel, { color: themeColors.textSecondary }]}>{employee?.emergencyContact.relationship}</Text>
            </View>
            <Ionicons name="call" size={20} color={themeColors.accent} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => Alert.alert('Calling', 'Calling Transport Control...')}
          >
            <View style={[styles.contactIcon, { backgroundColor: themeColors.secondaryLight }]}>
              <Ionicons name="bus" size={18} color={themeColors.secondary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.contactName, { color: themeColors.text }]}>Transport Control</Text>
              <Text style={[styles.contactRel, { color: themeColors.textSecondary }]}>24/7 Helpline</Text>
            </View>
            <Ionicons name="call" size={20} color={themeColors.accent} />
          </TouchableOpacity>
        </Animated.View>

        {sosActive && (
          <Animated.View entering={FadeInUp.duration(400)}>
            <TouchableOpacity
              style={[styles.cancelBtn, { backgroundColor: themeColors.backgroundElement }]}
              onPress={() => setSosActive(false)}
            >
              <Text style={[styles.cancelText, { color: themeColors.textSecondary }]}>Cancel Emergency</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
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
  container: { padding: 18, paddingBottom: 40 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20, borderWidth: 1,
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.fontSizes.lg, fontWeight: Typography.weights.bold as any,
  },
  sosContainer: { alignItems: 'center', marginBottom: 24, position: 'relative', height: 200, justifyContent: 'center' },
  sosOuter: {
    position: 'absolute',
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  sosBtn: {
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: '#D9534F',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#D9534F', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 16, elevation: 8,
  },
  sosBtnActive: {
    shadowOpacity: 0.6, shadowRadius: 24,
    backgroundColor: '#D9534F',
  },
  sosBtnText: {
    color: '#FFF', fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.weights.bold as any, marginTop: 4,
  },
  sosStatus: {
    fontSize: Typography.fontSizes.sm, marginTop: 12, textAlign: 'center',
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.md, fontWeight: Typography.weights.bold as any, marginBottom: 12,
  },
  tripInfo: {
    borderRadius: BorderRadius.md, borderWidth: 1, padding: 16, marginBottom: 16,
  },
  tripRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8,
  },
  tripText: { fontSize: Typography.fontSizes.sm },
  contactsCard: {
    borderRadius: BorderRadius.md, borderWidth: 1, padding: 16, marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 12,
    borderBottomWidth: 1, gap: 12,
  },
  contactIcon: {
    width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center',
  },
  contactName: {
    fontSize: Typography.fontSizes.md, fontWeight: Typography.weights.semibold as any,
  },
  contactRel: { fontSize: Typography.fontSizes.xs },
  cancelBtn: {
    padding: 14, borderRadius: BorderRadius.md, alignItems: 'center',
  },
  cancelText: {
    fontSize: Typography.fontSizes.md, fontWeight: Typography.weights.semibold as any,
  },
});
