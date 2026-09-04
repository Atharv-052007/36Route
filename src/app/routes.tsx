import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { Header } from '@/components/ui/Header';
import { SupervisorRoute } from '@/types';

export default function RoutesScreen() {
  const router = useRouter();
  const { routes, setSelectedRouteId, isDarkMode } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const [searchQuery, setSearchQuery] = useState('');

  const filteredRoutes = useMemo(() => {
    return routes.filter((r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [routes, searchQuery]);

  const handleViewRoute = (route: SupervisorRoute) => {
    setSelectedRouteId(route.id);
    router.push('/route-details');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.cardBackground}
      />

      <Header title="Routes" showBack />

      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: theme.cardBackground,
            borderBottomColor: theme.border,
          },
        ]}
      >
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: theme.backgroundElement,
              borderColor: theme.border,
            },
          ]}
        >
          <Ionicons name="search" size={16} color={theme.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search route name, stop..."
            placeholderTextColor={theme.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={16} color={theme.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredRoutes.map((r) => (
          <View
            key={r.id}
            style={[
              styles.routeCard,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.border,
              },
            ]}
          >
            <View style={styles.cardHeader}>
              <Text style={[styles.routeName, { color: theme.text }]}>
                {r.name}
              </Text>
            </View>

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="location-outline" size={14} color={theme.textSecondary} />
                <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                  {r.stopsCount} stops
                </Text>
              </View>

              <Text style={[styles.metaDot, { color: theme.textMuted }]}>•</Text>

              <View style={styles.metaItem}>
                <Ionicons name="speedometer-outline" size={14} color={theme.textSecondary} />
                <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                  {r.distanceKm} km
                </Text>
              </View>

              <Text style={[styles.metaDot, { color: theme.textMuted }]}>•</Text>

              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={14} color={theme.textSecondary} />
                <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                  ~{r.estimatedMinutes} mins
                </Text>
              </View>
            </View>

            <View style={styles.cardFooter}>
              <Text style={[styles.passengersText, { color: theme.textSecondary }]}>
                Typical passengers: {r.typicalPassengers}
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleViewRoute(r)}
                style={[
                  styles.viewRouteBtn,
                  {
                    backgroundColor: theme.primary,
                  },
                ]}
              >
                <Text style={styles.viewRouteBtnText}>View Route</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  searchContainer: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.fontSizes.sm,
    paddingVertical: 0,
  },
  listContent: {
    padding: Spacing.base,
    paddingBottom: Spacing.xxl,
  },
  routeCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  cardHeader: {
    marginBottom: 6,
  },
  routeName: {
    fontSize: Typography.fontSizes.base,
    fontWeight: Typography.weights.bold,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: Typography.fontSizes.xs + 1,
  },
  metaDot: {
    marginHorizontal: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.1)',
  },
  passengersText: {
    fontSize: Typography.fontSizes.sm,
  },
  viewRouteBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: BorderRadius.sm,
  },
  viewRouteBtnText: {
    color: '#FFFFFF',
    fontSize: Typography.fontSizes.xs + 1,
    fontWeight: Typography.weights.semibold,
  },
});
