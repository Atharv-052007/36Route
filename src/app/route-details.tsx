import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Typography, BorderRadius, Spacing, Shadows } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { Header } from '@/components/ui/Header';
import { Badge } from '@/components/ui/Badge';

export default function RouteDetailsScreen() {
  const router = useRouter();
  const { routes, isDarkMode } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;
  const route = routes[0];

  if (!route) {
    return (
      <View style={[styles.safe, { backgroundColor: theme.background }]}>
        <Header title="Route Details" showBack />
        <View style={styles.emptyState}>
          <Ionicons name="map-outline" size={48} color={theme.textMuted} />
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No route data</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.safe, { backgroundColor: theme.background }]}>
      <Header
        title={route.name}
        showBack
        rightAction={<Badge status={route.status} size="md" />}
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Card */}
        <View style={[styles.heroCard, { backgroundColor: theme.cardBackground }, Shadows.medium]}>
          <View style={styles.heroTop}>
            <View style={styles.heroIcon}>
              <Ionicons name="git-branch-outline" size={24} color={theme.primary} />
            </View>
            <Badge status={route.status} size="md" />
          </View>
          <Text style={[styles.routeName, { color: theme.text }]}>{route.name}</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: theme.cardBackground }, Shadows.small]}>
            <Ionicons name="map-outline" size={20} color={theme.primary} />
            <Text style={[styles.statValue, { color: theme.text }]}>{route.distance}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>km</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: theme.cardBackground }, Shadows.small]}>
            <Ionicons name="time-outline" size={20} color={theme.accent} />
            <Text style={[styles.statValue, { color: theme.text }]}>{route.estimatedTime}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>min</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: theme.cardBackground }, Shadows.small]}>
            <Ionicons name="people-outline" size={20} color={theme.secondary} />
            <Text style={[styles.statValue, { color: theme.text }]}>
              {route.occupiedSeats}/{route.capacity}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>seats</Text>
          </View>
        </View>

        {/* Stops Timeline */}
        <View style={[styles.stopsCard, { backgroundColor: theme.cardBackground }, Shadows.small]}>
          <View style={styles.stopsHeader}>
            <Ionicons name="location-outline" size={16} color={theme.primary} />
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>STOPS</Text>
            <View style={[styles.stopCountBadge, { backgroundColor: theme.primaryLight }]}>
              <Text style={[styles.stopCountText, { color: theme.primary }]}>
                {route.stops.length}
              </Text>
            </View>
          </View>

          <View style={styles.stopsList}>
            {route.stops.map((stop: any, index: number) => {
              const isFirst = index === 0;
              const isLast = index === route.stops.length - 1;

              return (
                <View key={stop.id} style={styles.stopRow}>
                  {/* Timeline Indicator */}
                  <View style={styles.stopIndicator}>
                    <View
                      style={[
                        styles.stopDot,
                        {
                          backgroundColor: isFirst
                            ? theme.accent
                            : isLast
                            ? theme.primary
                            : theme.textMuted,
                          width: isFirst || isLast ? 12 : 8,
                          height: isFirst || isLast ? 12 : 8,
                          borderRadius: isFirst || isLast ? 6 : 4,
                        },
                      ]}
                    />
                    {!isLast && (
                      <View style={[styles.stopLine, { backgroundColor: theme.border }]} />
                    )}
                  </View>

                  {/* Stop Content */}
                  <View style={[styles.stopContent, isLast && styles.stopContentLast]}>
                    <View style={styles.stopTop}>
                      <Text style={[styles.stopName, { color: theme.text }]}>{stop.name}</Text>
                      {isFirst && (
                        <View style={[styles.stopTag, { backgroundColor: theme.accentLight }]}>
                          <Text style={[styles.stopTagText, { color: theme.accent }]}>START</Text>
                        </View>
                      )}
                      {isLast && (
                        <View style={[styles.stopTag, { backgroundColor: theme.primaryLight }]}>
                          <Text style={[styles.stopTagText, { color: theme.primary }]}>END</Text>
                        </View>
                      )}
                    </View>

                    <Text style={[styles.stopAddress, { color: theme.textSecondary }]}>
                      {stop.address}
                    </Text>

                    <View style={styles.stopMeta}>
                      <View style={styles.stopMetaItem}>
                        <Ionicons name="time-outline" size={12} color={theme.textMuted} />
                        <Text style={[styles.stopMetaText, { color: theme.textMuted }]}>
                          {stop.expectedArrivalTime}
                        </Text>
                      </View>
                      <View style={styles.stopMetaItem}>
                        <Ionicons name="people-outline" size={12} color={theme.textMuted} />
                        <Text style={[styles.stopMetaText, { color: theme.textMuted }]}>
                          {stop.passengerCount} pax
                        </Text>
                      </View>
                      <View style={[styles.stopTypeBadge, { backgroundColor: theme.backgroundElement }]}>
                        <Text style={[styles.stopTypeText, { color: theme.textSecondary }]}>
                          {stop.type}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
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
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  emptyText: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.medium,
  },
  heroCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.1)',
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  heroIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeName: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.weights.bold,
    letterSpacing: -0.3,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.06)',
    gap: 4,
  },
  statValue: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.weights.bold,
  },
  statLabel: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.medium,
    letterSpacing: 0.3,
  },
  stopsCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.06)',
  },
  stopsHeader: {
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
  stopCountBadge: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopCountText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.bold,
  },
  stopsList: {},
  stopRow: {
    flexDirection: 'row',
  },
  stopIndicator: {
    width: 24,
    alignItems: 'center',
    paddingTop: 3,
  },
  stopDot: {
    zIndex: 2,
  },
  stopLine: {
    width: 2,
    flex: 1,
    marginVertical: 4,
    borderRadius: 1,
    minHeight: 24,
  },
  stopContent: {
    flex: 1,
    paddingBottom: Spacing.md,
    paddingLeft: Spacing.sm,
  },
  stopContentLast: {
    paddingBottom: 0,
  },
  stopTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  stopName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.semibold,
    flex: 1,
  },
  stopTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
    marginLeft: Spacing.sm,
  },
  stopTagText: {
    fontSize: Typography.fontSizes.xs - 1,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.5,
  },
  stopAddress: {
    fontSize: Typography.fontSizes.sm,
    marginBottom: Spacing.xs,
  },
  stopMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  stopMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stopMetaText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.medium,
  },
  stopTypeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  stopTypeText: {
    fontSize: Typography.fontSizes.xs - 1,
    fontWeight: Typography.weights.medium,
    textTransform: 'capitalize',
  },
});
