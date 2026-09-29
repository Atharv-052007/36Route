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
import { EmptyState, StatusBadge } from '../../components/ui/AppStates';
import { Header } from '@/components/ui/Header';
import { Badge } from '@/components/ui/Badge';

export default function DriverRoutesScreen() {
  const router = useRouter();
  const { routes, themeColors } = useApp();

  const totalSeats = routes.reduce((sum, r) => sum + r.capacity, 0);
  const totalOccupied = routes.reduce((sum, r) => sum + r.occupiedSeats, 0);

  return (
    <AppSafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <Header
        title="Assigned Routes"
        showBack
        subtitle={`${routes.length} routes assigned`}
      />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Summary Bar */}
        {routes.length > 0 && (
          <View style={[styles.summaryBar, { backgroundColor: themeColors.cardBackground }, Shadows.small]}>
            <View style={styles.summaryItem}>
              <Ionicons name="map" size={16} color={themeColors.secondary} />
              <Text style={[styles.summaryText, { color: themeColors.text }]}>{routes.length} routes</Text>
            </View>
            <View style={[styles.summaryDivider, { backgroundColor: themeColors.border }]} />
            <View style={styles.summaryItem}>
              <Ionicons name="people" size={16} color={themeColors.accent} />
              <Text style={[styles.summaryText, { color: themeColors.text }]}>{totalOccupied}/{totalSeats} seats</Text>
            </View>
          </View>
        )}

        {/* Routes List */}
        {routes.length === 0 ? (
          <EmptyState title="No Routes Assigned" description="Assigned routes will appear here." icon="map-outline" />
        ) : (
          routes.map((route) => {
            const capacityPercent = Math.round((route.occupiedSeats / route.capacity) * 100);
            return (
              <TouchableOpacity
                key={route.id}
                onPress={() => router.push('/route-details')}
                style={[styles.routeCard, { backgroundColor: themeColors.cardBackground }, Shadows.card]}
                activeOpacity={0.7}
              >
                {/* Route Header */}
                <View style={styles.routeHeader}>
                  <View style={[styles.routeIconWrap, { backgroundColor: themeColors.secondaryLight }]}>
                    <Ionicons name="map" size={22} color={themeColors.secondary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.routeName, { color: themeColors.text }]}>{route.name}</Text>
                    <Text style={[styles.routePoints, { color: themeColors.textSecondary }]}>
                      {route.startingPoint} → {route.destination}
                    </Text>
                  </View>
                  <StatusBadge status={route.status} size="sm" />
                </View>

                {/* Route Visual */}
                <View style={[styles.routeVisual, { borderTopColor: themeColors.borderLight }]}>
                  <View style={styles.routeDots}>
                    <View style={[styles.routeDot, { backgroundColor: themeColors.accent }]} />
                    <View style={[styles.routeLine, { backgroundColor: themeColors.border }]} />
                    <View style={[styles.routeDot, { backgroundColor: themeColors.danger }]} />
                  </View>
                  <View style={styles.routeLabels}>
                    <Text style={[styles.routeLabel, { color: themeColors.text }]}>{route.startingPoint}</Text>
                    <Text style={[styles.routeLabel, { color: themeColors.text }]}>{route.destination}</Text>
                  </View>
                </View>

                {/* Route Stats */}
                <View style={[styles.routeStats, { borderTopColor: themeColors.borderLight }]}>
                  <View style={styles.statItem}>
                    <Ionicons name="navigate-outline" size={14} color={themeColors.textMuted} />
                    <Text style={[styles.statText, { color: themeColors.textSecondary }]}>{route.distance} km</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="location-outline" size={14} color={themeColors.textMuted} />
                    <Text style={[styles.statText, { color: themeColors.textSecondary }]}>{route.stops.length} stops</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="people-outline" size={14} color={themeColors.textMuted} />
                    <Text style={[styles.statText, { color: themeColors.textSecondary }]}>
                      {route.occupiedSeats}/{route.capacity}
                    </Text>
                  </View>
                  <View style={[styles.capacityBar, { backgroundColor: themeColors.backgroundElement }]}>
                    <View style={[styles.capacityFill, { width: `${capacityPercent}%`, backgroundColor: capacityPercent > 80 ? themeColors.warning : themeColors.accent }]} />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: Spacing.base, paddingBottom: 40 },
  summaryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    gap: 16,
    marginBottom: 18,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  summaryText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold as any,
  },
  summaryDivider: {
    width: 1,
    height: 16,
  },
  routeCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    padding: 16,
    marginBottom: 12,
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  routeIconWrap: {
    width: 46,
    height: 46,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  routeName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.semibold as any,
  },
  routePoints: { fontSize: Typography.fontSizes.sm, marginTop: 2 },
  routeVisual: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  routeDots: {
    alignItems: 'center',
    marginRight: 12,
  },
  routeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  routeLine: {
    width: 2,
    height: 20,
  },
  routeLabels: {
    flex: 1,
    justifyContent: 'space-between',
    gap: 22,
  },
  routeLabel: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.medium as any,
  },
  routeStats: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: { fontSize: Typography.fontSizes.xs },
  capacityBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    minWidth: 60,
  },
  capacityFill: {
    height: '100%',
    borderRadius: 2,
  },
});
