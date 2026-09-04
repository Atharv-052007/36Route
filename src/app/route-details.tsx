import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { Header } from '@/components/ui/Header';
import { RouteTimeline } from '@/components/ui/Timeline';

export default function RouteDetailsScreen() {
  const { routes, selectedRouteId, isDarkMode } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const route = routes.find((r) => r.id === selectedRouteId) || routes[0];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.cardBackground}
      />

      <Header
        title={route.name}
        subtitle={`${route.stopsCount} stops • ${route.distanceKm} km`}
        showBack
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Route Overview Card */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.cardBackground, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            ROUTE OVERVIEW
          </Text>
          <View style={styles.metricsRow}>
            <View style={styles.metricCol}>
              <Text style={[styles.metricVal, { color: theme.text }]}>
                {route.stopsCount}
              </Text>
              <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
                Stops
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <View style={styles.metricCol}>
              <Text style={[styles.metricVal, { color: theme.text }]}>
                {route.distanceKm} km
              </Text>
              <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
                Distance
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <View style={styles.metricCol}>
              <Text style={[styles.metricVal, { color: theme.text }]}>
                {route.typicalPassengers}
              </Text>
              <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
                Avg. Riders
              </Text>
            </View>
          </View>
        </View>

        {/* STOP SEQUENCE Section */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.cardBackground, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            STOP SEQUENCE
          </Text>
          <RouteTimeline stops={route.stops} style={{ marginTop: Spacing.sm }} />
        </View>

        {/* SCHEDULED TRIPS ON THIS ROUTE */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.cardBackground, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            DAILY SCHEDULES
          </Text>
          <View style={styles.scheduleRow}>
            <Text style={[styles.scheduleTime, { color: theme.text }]}>07:30</Text>
            <Text style={[styles.scheduleDetail, { color: theme.textSecondary }]}>
              Shift 1 Pickup • 12 booked
            </Text>
          </View>
          <View style={[styles.scheduleRow, { borderTopWidth: 1, borderTopColor: theme.borderLight }]}>
            <Text style={[styles.scheduleTime, { color: theme.text }]}>09:00</Text>
            <Text style={[styles.scheduleDetail, { color: theme.textSecondary }]}>
              Shift 2 Pickup • 11 booked
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
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: Spacing.xs,
  },
  metricCol: {
    alignItems: 'center',
    flex: 1,
  },
  metricVal: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.weights.bold,
  },
  metricLabel: {
    fontSize: Typography.fontSizes.xs,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 24,
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  scheduleTime: {
    fontSize: Typography.fontSizes.base,
    fontWeight: Typography.weights.bold,
  },
  scheduleDetail: {
    fontSize: Typography.fontSizes.xs + 1,
  },
});
