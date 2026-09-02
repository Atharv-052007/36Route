import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { Typography, BorderRadius, Shadows } from '@/constants/theme';
import { StatusBadge } from '@/components/ui/AppStates';

export default function RouteDetailsScreen() {
  const router = useRouter();
  const { routes, themeColors } = useApp();
  const route = routes[0];

  if (!route) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: themeColors.background }]}>
        <Text style={{ textAlign: 'center', marginTop: 40, color: themeColors.textSecondary }}>No route data</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backBtn, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}
          >
            <Ionicons name="arrow-back" size={20} color={themeColors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: themeColors.text }]}>{route.name}</Text>
          <StatusBadge status={route.status} size="sm" />
        </View>

        {/* Route Info */}
        <View style={[styles.infoCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }, Shadows.small]}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="map-outline" size={16} color={themeColors.textMuted} />
              <Text style={[styles.infoLabel, { color: themeColors.textSecondary }]}>Distance</Text>
              <Text style={[styles.infoValue, { color: themeColors.text }]}>{route.distance} km</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={16} color={themeColors.textMuted} />
              <Text style={[styles.infoLabel, { color: themeColors.textSecondary }]}>Duration</Text>
              <Text style={[styles.infoValue, { color: themeColors.text }]}>{route.estimatedTime} min</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="people-outline" size={16} color={themeColors.textMuted} />
              <Text style={[styles.infoLabel, { color: themeColors.textSecondary }]}>Seats</Text>
              <Text style={[styles.infoValue, { color: themeColors.text }]}>{route.occupiedSeats}/{route.capacity}</Text>
            </View>
          </View>
        </View>

        {/* Stops Timeline */}
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Stops</Text>
        <View style={[styles.stopsCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }, Shadows.small]}>
          {route.stops.map((stop, index) => (
            <View key={stop.id} style={styles.stopRow}>
              <View style={styles.stopLeft}>
                <View style={[
                  styles.stopDot,
                  {
                    backgroundColor: index === 0
                      ? themeColors.accent
                      : index === route.stops.length - 1
                      ? themeColors.secondary
                      : themeColors.textMuted,
                  },
                ]} />
                {index < route.stops.length - 1 && (
                  <View style={[styles.stopLine, { backgroundColor: themeColors.border }]} />
                )}
              </View>
              <View style={styles.stopContent}>
                <Text style={[styles.stopName, { color: themeColors.text }]}>{stop.name}</Text>
                <Text style={[styles.stopAddress, { color: themeColors.textSecondary }]}>{stop.address}</Text>
                <View style={styles.stopMeta}>
                  <Text style={[styles.stopTime, { color: themeColors.textMuted }]}>{stop.expectedArrivalTime}</Text>
                  <Text style={[styles.stopPassengers, { color: themeColors.textMuted }]}>
                    {stop.passengerCount} passengers • {stop.type}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 18, paddingBottom: 40 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20, borderWidth: 1,
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.fontSizes.lg, fontWeight: Typography.weights.bold as any, flex: 1, marginLeft: 12,
  },
  infoCard: {
    borderRadius: BorderRadius.md, borderWidth: 1, padding: 16, marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row', justifyContent: 'space-around',
  },
  infoItem: { alignItems: 'center', gap: 4 },
  infoLabel: { fontSize: Typography.fontSizes.xs },
  infoValue: { fontSize: Typography.fontSizes.lg, fontWeight: Typography.weights.bold as any },
  sectionTitle: {
    fontSize: Typography.fontSizes.md, fontWeight: Typography.weights.bold as any, marginBottom: 10,
  },
  stopsCard: {
    borderRadius: BorderRadius.md, borderWidth: 1, padding: 16,
  },
  stopRow: {
    flexDirection: 'row',
  },
  stopLeft: {
    width: 24, alignItems: 'center',
  },
  stopDot: {
    width: 12, height: 12, borderRadius: 6,
  },
  stopLine: {
    width: 2, flex: 1, marginVertical: 4, borderRadius: 1,
  },
  stopContent: {
    flex: 1, marginLeft: 12, paddingBottom: 20,
  },
  stopName: {
    fontSize: Typography.fontSizes.md, fontWeight: Typography.weights.semibold as any, marginBottom: 2,
  },
  stopAddress: { fontSize: Typography.fontSizes.sm, marginBottom: 4 },
  stopMeta: { flexDirection: 'row', gap: 12 },
  stopTime: { fontSize: Typography.fontSizes.xs },
  stopPassengers: { fontSize: Typography.fontSizes.xs },
});
