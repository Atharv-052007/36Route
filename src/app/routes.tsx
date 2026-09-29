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
  const { routes, setSelectedRouteId, isDarkMode, themeColors } = useApp();

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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={themeColors.cardBackground}
      />

      <Header title="Routes" subtitle={`${routes.length} active routes`} showBack />

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: themeColors.cardBackground }]}>
        <View
          style={[
            styles.searchBar,
            { backgroundColor: themeColors.backgroundElement, borderColor: themeColors.border },
          ]}
        >
          <Ionicons name="search" size={18} color={themeColors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: themeColors.text }]}
            placeholder="Search route name, stop..."
            placeholderTextColor={themeColors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={themeColors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Results count */}
        <View style={styles.resultsRow}>
          <Text style={[styles.resultsText, { color: themeColors.textMuted }]}>
            {filteredRoutes.length} route{filteredRoutes.length !== 1 ? 's' : ''} found
          </Text>
        </View>

        {filteredRoutes.map((r) => (
          <TouchableOpacity
            key={r.id}
            activeOpacity={0.7}
            onPress={() => handleViewRoute(r)}
            style={[
              styles.routeCard,
              { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border },
            ]}
          >
            <View style={styles.cardTop}>
              <View style={styles.cardTopLeft}>
                <View
                  style={[
                    styles.routeIcon,
                    { backgroundColor: themeColors.primaryLight },
                  ]}
                >
                  <Ionicons name="git-network-outline" size={18} color={themeColors.primary} />
                </View>
                <View style={styles.routeTitleCol}>
                  <Text style={[styles.routeName, { color: themeColors.text }]}>
                    {r.name}
                  </Text>
                  <Text style={[styles.routePassengers, { color: themeColors.textSecondary }]}>
                    {r.typicalPassengers} typical passengers
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.statusPill,
                  {
                    backgroundColor: themeColors.availableLight,
                    borderColor: themeColors.availableBorder,
                  },
                ]}
              >
                <View style={[styles.statusDot, { backgroundColor: themeColors.available }]} />
                <Text style={[styles.statusText, { color: themeColors.available }]}>Active</Text>
              </View>
            </View>

            <View style={[styles.cardDivider, { backgroundColor: themeColors.borderLight }]} />

            <View style={styles.cardMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="navigate-outline" size={14} color={themeColors.textMuted} />
                <Text style={[styles.metaText, { color: themeColors.textSecondary }]}>
                  {r.stopsCount} stops
                </Text>
              </View>
              <View style={[styles.metaDot, { backgroundColor: themeColors.textMuted }]} />
              <View style={styles.metaItem}>
                <Ionicons name="speedometer-outline" size={14} color={themeColors.textMuted} />
                <Text style={[styles.metaText, { color: themeColors.textSecondary }]}>
                  {r.distanceKm} km
                </Text>
              </View>
              <View style={[styles.metaDot, { backgroundColor: themeColors.textMuted }]} />
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={14} color={themeColors.textMuted} />
                <Text style={[styles.metaText, { color: themeColors.textSecondary }]}>
                  ~{r.estimatedMinutes} mins
                </Text>
              </View>
            </View>

            <View style={styles.cardAction}>
              <Text style={[styles.viewText, { color: themeColors.primary }]}>View Details</Text>
              <Ionicons name="arrow-forward" size={16} color={themeColors.primary} />
            </View>
          </TouchableOpacity>
        ))}

        {filteredRoutes.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color={themeColors.textMuted} />
            <Text style={[styles.emptyTitle, { color: themeColors.text }]}>No routes found</Text>
            <Text style={[styles.emptyDesc, { color: themeColors.textSecondary }]}>
              Try a different search term
            </Text>
          </View>
        )}
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
    paddingVertical: Spacing.sm + 2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.fontSizes.sm + 1,
    paddingVertical: 0,
  },
  listContent: {
    padding: Spacing.base,
    paddingBottom: Spacing.xxl,
  },
  resultsRow: {
    marginBottom: Spacing.sm + 4,
  },
  resultsText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.medium,
  },
  routeCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.sm + 4,
    ...Shadows.card,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTopLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
    flex: 1,
  },
  routeIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeTitleCol: {
    flex: 1,
  },
  routeName: {
    fontSize: Typography.fontSizes.base,
    fontWeight: Typography.weights.bold,
    letterSpacing: -0.2,
  },
  routePassengers: {
    fontSize: Typography.fontSizes.xs,
    marginTop: 2,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: Typography.fontSizes.xs - 1,
    fontWeight: Typography.weights.semibold,
  },
  cardDivider: {
    height: 1,
    marginVertical: Spacing.sm + 4,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm + 4,
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
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
  cardAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.08)',
  },
  viewText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    gap: Spacing.sm,
  },
  emptyTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.weights.bold,
  },
  emptyDesc: {
    fontSize: Typography.fontSizes.sm,
  },
});
