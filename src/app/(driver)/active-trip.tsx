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
import { StatusBadge, EmptyState } from '../../components/ui/AppStates';
import { LocationCard } from '../../components/ui/RideCards';
import { Header } from '@/components/ui/Header';
import { Badge } from '@/components/ui/Badge';

export default function DriverActiveTripScreen() {
  const router = useRouter();
  const { activeRide, themeColors } = useApp();

  if (!activeRide) {
    return (
      <AppSafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: themeColors.background }]}>
        <Header title="Active Trip" showBack />
        <EmptyState
          title="No Active Trip"
          description="Start a trip from your dashboard when a route is assigned."
          actionTitle="Go to Dashboard"
          onAction={() => router.push('/(driver)' as any)}
          icon="navigate-outline"
        />
      </AppSafeAreaView>
    );
  }

  const currentStop = activeRide.route?.stops?.[0];

  return (
    <AppSafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <Header title="Active Trip" showBack live />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Route Overview */}
        <View style={[styles.heroCard, { backgroundColor: themeColors.cardBackground }, Shadows.card]}>
          <View style={styles.heroTop}>
            <View style={[styles.routeIconWrap, { backgroundColor: themeColors.secondaryLight }]}>
              <Ionicons name="bus" size={24} color={themeColors.secondary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.routeName, { color: themeColors.text }]}>
                {activeRide.route?.name || 'Route 36'}
              </Text>
              <Text style={[styles.routePoints, { color: themeColors.textSecondary }]}>
                {activeRide.pickup.name} → {activeRide.drop.name}
              </Text>
            </View>
            <Badge status={activeRide.status} size="md" />
          </View>

          {/* Route Visual */}
          <View style={[styles.routeVisual, { borderTopColor: themeColors.borderLight }]}>
            <View style={styles.routeDots}>
              <View style={[styles.routeDot, { backgroundColor: themeColors.accent }]} />
              <View style={[styles.routeLine, { backgroundColor: themeColors.border }]} />
              {currentStop && <View style={[styles.routeDotMid, { backgroundColor: themeColors.secondary }]} />}
              <View style={[styles.routeLine, { backgroundColor: themeColors.border }]} />
              <View style={[styles.routeDot, { backgroundColor: themeColors.danger }]} />
            </View>
            <View style={styles.routeLabels}>
              <Text style={[styles.routeLabel, { color: themeColors.text }]}>{activeRide.pickup.name}</Text>
              {currentStop && <Text style={[styles.routeMidLabel, { color: themeColors.textSecondary }]}>{currentStop.name}</Text>}
              <Text style={[styles.routeLabel, { color: themeColors.text }]}>{activeRide.drop.name}</Text>
            </View>
          </View>

          {/* Trip Meta */}
          <View style={[styles.metaGrid, { borderTopColor: themeColors.borderLight }]}>
            <View style={styles.metaItem}>
              <Ionicons name="car-sport-outline" size={16} color={themeColors.textMuted} />
              <Text style={[styles.metaText, { color: themeColors.textSecondary }]}>
                {activeRide.vehicle?.model || '—'}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={16} color={themeColors.secondary} />
              <Text style={[styles.metaLabel, { color: themeColors.secondary }]}>
                ETA: {activeRide.eta}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="people-outline" size={16} color={themeColors.textMuted} />
              <Text style={[styles.metaText, { color: themeColors.textSecondary }]}>
                {activeRide.coPassengersCount ?? 0} passengers
              </Text>
            </View>
          </View>
        </View>

        {/* Route Details */}
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Route</Text>
        <View style={[styles.card, { backgroundColor: themeColors.cardBackground }, Shadows.card]}>
          <LocationCard pickup={activeRide.pickup} drop={activeRide.drop} />
        </View>

        {/* Stops */}
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Stops</Text>
        <View style={[styles.card, { backgroundColor: themeColors.cardBackground }, Shadows.card]}>
          {activeRide.route?.stops && activeRide.route.stops.length > 0 ? (
            activeRide.route.stops.map((stop, index) => (
              <View key={stop.id} style={[styles.stopRow, index > 0 && { borderTopColor: themeColors.borderLight, borderTopWidth: 1 }]}>
                <View style={styles.stopIndicator}>
                  <View style={[styles.stopDot, { backgroundColor: themeColors.secondary }]} />
                  {index < activeRide.route!.stops.length - 1 && (
                    <View style={[styles.stopConnector, { backgroundColor: themeColors.border }]} />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.stopName, { color: themeColors.text }]}>{stop.name}</Text>
                  <Text style={[styles.stopMeta, { color: themeColors.textSecondary }]}>
                    {stop.expectedArrivalTime} • {stop.passengerCount} passengers
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={[styles.emptyText, { color: themeColors.textMuted }]}>No stops available.</Text>
          )}
        </View>

        {/* Navigation */}
        <TouchableOpacity style={[styles.navCard, { backgroundColor: themeColors.secondary }]} activeOpacity={0.8}>
          <Ionicons name="navigate" size={22} color="#FFF" />
          <View style={{ flex: 1 }}>
            <Text style={styles.navTitle}>Start Live Navigation</Text>
            <Text style={styles.navSub}>Turn-by-turn directions to the first stop</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#FFF" />
        </TouchableOpacity>

        {/* Actions */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: themeColors.accentLight }]} activeOpacity={0.7}>
            <Ionicons name="play-circle-outline" size={18} color={themeColors.accent} />
            <Text style={[styles.actionText, { color: themeColors.accent }]}>Start Trip</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: themeColors.dangerLight }]} activeOpacity={0.7}>
            <Ionicons name="checkmark-done-outline" size={18} color={themeColors.danger} />
            <Text style={[styles.actionText, { color: themeColors.danger }]}>End Trip</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: Spacing.base, paddingBottom: 40 },
  heroCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    padding: 18,
    marginBottom: 20,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  routeIconWrap: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  routeName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.bold as any,
    marginBottom: 2,
  },
  routePoints: { fontSize: Typography.fontSizes.sm },
  routeVisual: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    marginBottom: 16,
  },
  routeDots: {
    alignItems: 'center',
    marginRight: 14,
  },
  routeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  routeDotMid: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginVertical: 6,
  },
  routeLine: {
    width: 2,
    height: 24,
  },
  routeLabels: {
    flex: 1,
    justifyContent: 'space-between',
    gap: 18,
  },
  routeLabel: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold as any,
  },
  routeMidLabel: {
    fontSize: Typography.fontSizes.xs,
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingTop: 14,
    borderTopWidth: 1,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: { fontSize: Typography.fontSizes.sm },
  metaLabel: { fontSize: Typography.fontSizes.sm, fontWeight: Typography.weights.semibold as any },
  sectionTitle: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.bold as any,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  card: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    padding: 16,
    marginBottom: 20,
  },
  stopRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    gap: 12,
  },
  stopIndicator: {
    alignItems: 'center',
    width: 16,
  },
  stopDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  stopConnector: {
    width: 2,
    flex: 1,
    marginTop: 4,
    marginBottom: 4,
  },
  stopName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.semibold as any,
  },
  stopMeta: {
    fontSize: Typography.fontSizes.xs,
    marginTop: 3,
  },
  emptyText: { fontSize: Typography.fontSizes.sm },
  navCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: BorderRadius.lg,
    gap: 12,
    marginBottom: 20,
  },
  navTitle: { color: '#FFF', fontSize: Typography.fontSizes.md, fontWeight: Typography.weights.bold as any },
  navSub: { color: 'rgba(255,255,255,0.85)', fontSize: Typography.fontSizes.xs, marginTop: 2 },
  actionRow: { flexDirection: 'row', gap: 10 },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    gap: 6,
  },
  actionText: { fontSize: Typography.fontSizes.sm, fontWeight: Typography.weights.semibold as any },
});
