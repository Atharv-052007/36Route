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
import { Typography, BorderRadius } from '../../constants/theme';
import { EmptyState, StatusBadge } from '../../components/ui/AppStates';

export default function DriverRoutesScreen() {
  const router = useRouter();
  const { routes, themeColors } = useApp();

  return (
    <AppSafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: themeColors.text }]}>Assigned Routes</Text>
        </View>

        {routes.length === 0 ? (
          <View>
            <EmptyState title="No Routes Assigned" description="Assigned routes will appear here." icon="map-outline" />
          </View>
        ) : (
          routes.map((route, index) => (
            <View key={route.id}>
              <TouchableOpacity
                onPress={() => router.push('/route-details')}
                style={[styles.routeCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}
                activeOpacity={0.7}
              >
                <View style={[styles.routeIcon, { backgroundColor: themeColors.secondaryLight }]}>
                  <Ionicons name="map" size={22} color={themeColors.secondary} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.routeNameRow}>
                    <Text style={[styles.routeName, { color: themeColors.text }]}>{route.name}</Text>
                  </View>
                  <Text style={[styles.routePoints, { color: themeColors.textSecondary }]}>
                    {route.startingPoint} → {route.destination}
                  </Text>
                  <View style={styles.routeMetaRow}>
                    <Text style={[styles.routeMeta, { color: themeColors.textMuted }]}>{route.distance} km</Text>
                    <Text style={[styles.routeMeta, { color: themeColors.textMuted }]}>•</Text>
                    <Text style={[styles.routeMeta, { color: themeColors.textMuted }]}>{route.stops.length} stops</Text>
                    <Text style={[styles.routeMeta, { color: themeColors.textMuted }]}>•</Text>
                    <Text style={[styles.routeMeta, { color: themeColors.textSecondary }]}>
                      {route.occupiedSeats}/{route.capacity}
                    </Text>
                  </View>
                </View>
                <StatusBadge status={route.status} size="sm" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 18, paddingBottom: 40 },
  header: { marginBottom: 16 },
  headerTitle: { fontSize: Typography.fontSizes.xl, fontWeight: Typography.weights.bold as any },
  routeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: 10,
    gap: 12,
  },
  routeIcon: {
    width: 46,
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  routeNameRow: { flexDirection: 'row', alignItems: 'center' },
  routeName: { fontSize: Typography.fontSizes.md, fontWeight: Typography.weights.semibold as any },
  routePoints: { fontSize: Typography.fontSizes.sm, marginTop: 2 },
  routeMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  routeMeta: { fontSize: Typography.fontSizes.xs },
});
