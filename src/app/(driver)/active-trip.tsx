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
import { StatusBadge, EmptyState } from '../../components/ui/AppStates';
import { LocationCard } from '../../components/ui/RideCards';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

export default function DriverActiveTripScreen() {
  const router = useRouter();
  const { activeRide, themeColors } = useApp();

  if (!activeRide) {
    return (
      <AppSafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: themeColors.background }]}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
            <Text style={[styles.headerTitle, { color: themeColors.text }]}>Active Trip</Text>
          </Animated.View>
          <EmptyState
            title="No Active Trip"
            description="Start a trip from your dashboard when a route is assigned."
            actionTitle="Go to Dashboard"
            onAction={() => router.push('/(driver)' as any)}
            icon="navigate-outline"
          />
        </ScrollView>
      </AppSafeAreaView>
    );
  }

  return (
    <AppSafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <Text style={[styles.headerTitle, { color: themeColors.text }]}>Active Trip</Text>
          <StatusBadge status={activeRide.status} size="md" />
        </Animated.View>

        {/* Trip Summary */}
        <Animated.View entering={FadeInUp.duration(400).springify()} style={[styles.summaryCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }, Shadows.small]}>
          <View style={styles.routeRow}>
            <View style={[styles.routeIcon, { backgroundColor: themeColors.secondaryLight }]}>
              <Ionicons name="bus" size={22} color={themeColors.secondary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.routeName, { color: themeColors.text }]}>
                {activeRide.route?.name || 'Route 36'}
              </Text>
              <Text style={[styles.routePoints, { color: themeColors.textSecondary }]}>
                {activeRide.pickup.name} → {activeRide.drop.name}
              </Text>
            </View>
          </View>
          <View style={styles.metaRow}>
            <View style={styles.meta}>
              <Ionicons name="car-sport-outline" size={14} color={themeColors.textMuted} />
              <Text style={[styles.metaText, { color: themeColors.textSecondary }]}>
                {activeRide.vehicle?.model} • {activeRide.vehicle?.vehicleNumber}
              </Text>
            </View>
            <View style={styles.meta}>
              <Ionicons name="time-outline" size={14} color={themeColors.secondary} />
              <Text style={[styles.metaText, { color: themeColors.secondary, fontWeight: Typography.weights.semibold as any }]}>
                ETA: {activeRide.eta}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Route */}
        <Animated.View entering={FadeInUp.delay(150).duration(400)}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Route</Text>
          <View style={[styles.card, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
            <LocationCard pickup={activeRide.pickup} drop={activeRide.drop} />
          </View>
        </Animated.View>

        {/* Stops */}
        <Animated.View entering={FadeInUp.delay(250).duration(400)}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Stops</Text>
          <View style={[styles.card, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
            {activeRide.route?.stops && activeRide.route.stops.length > 0 ? (
              activeRide.route.stops.map((stop, index) => (
                <View key={stop.id} style={[styles.stopRow, index > 0 && { borderTopColor: themeColors.borderLight, borderTopWidth: 1 }]}>
                  <View style={[styles.stopDot, { backgroundColor: themeColors.secondary }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.stopName, { color: themeColors.text }]}>{stop.name}</Text>
                    <Text style={[styles.stopTime, { color: themeColors.textSecondary }]}>
                      {stop.expectedArrivalTime} • {stop.passengerCount} passengers
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={[styles.emptyStops, { color: themeColors.textMuted }]}>No stops available for this trip.</Text>
            )}
          </View>
        </Animated.View>

        {/* Navigation */}
        <Animated.View entering={FadeInUp.delay(350).duration(400)}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Navigation</Text>
          <View style={[styles.navCard, { backgroundColor: themeColors.secondary }, Shadows.medium]}>
            <View style={styles.navRow}>
              <Ionicons name="navigate" size={26} color="#FFF" />
              <View style={{ flex: 1 }}>
                <Text style={styles.navTitle}>Start Live Navigation</Text>
                <Text style={styles.navSub}>Get turn-by-turn directions to the first stop</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#FFF" />
            </View>
          </View>
        </Animated.View>

        {/* Actions */}
        <Animated.View entering={FadeInUp.delay(450).duration(400)} style={styles.actionRow}>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: themeColors.accentLight }]}>
            <Ionicons name="play-circle-outline" size={18} color={themeColors.accent} />
            <Text style={[styles.actionText, { color: themeColors.accent }]}>Start Trip</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: themeColors.dangerLight }]}
          >
            <Ionicons name="checkmark-done-outline" size={18} color={themeColors.danger} />
            <Text style={[styles.actionText, { color: themeColors.danger }]}>End Trip</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 18, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: { fontSize: Typography.fontSizes.xl, fontWeight: Typography.weights.bold as any },
  summaryCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  routeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  routeIcon: {
    width: 46,
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  routeName: { fontSize: Typography.fontSizes.md, fontWeight: Typography.weights.semibold as any, marginBottom: 2 },
  routePoints: { fontSize: Typography.fontSizes.sm },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#E5E8E3' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: Typography.fontSizes.sm },
  sectionTitle: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold as any,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 4,
  },
  card: { borderRadius: BorderRadius.md, borderWidth: 1, padding: 16, marginBottom: 16 },
  stopRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 },
  stopDot: { width: 10, height: 10, borderRadius: 5 },
  stopName: { fontSize: Typography.fontSizes.md, fontWeight: Typography.weights.semibold as any },
  stopTime: { fontSize: Typography.fontSizes.xs, marginTop: 2 },
  emptyStops: { fontSize: Typography.fontSizes.sm },
  navCard: {
    borderRadius: BorderRadius.lg,
    padding: 18,
    marginBottom: 16,
  },
  navRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  navTitle: { color: '#FFF', fontSize: Typography.fontSizes.md, fontWeight: Typography.weights.bold as any },
  navSub: { color: 'rgba(255,255,255,0.85)', fontSize: Typography.fontSizes.xs, marginTop: 2 },
  actionRow: { flexDirection: 'row', gap: 10 },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    gap: 6,
  },
  actionText: { fontSize: Typography.fontSizes.sm, fontWeight: Typography.weights.semibold as any },
});
