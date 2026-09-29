import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { Header } from '@/components/ui/Header';
import { StatCard } from '@/components/ui/StatCard';

type ReportTab = 'Drivers' | 'Vehicles' | 'Routes';

const TAB_CONFIG: { key: ReportTab; label: string; icon: string }[] = [
  { key: 'Drivers', label: 'Drivers', icon: 'people-outline' },
  { key: 'Vehicles', label: 'Vehicles', icon: 'car-outline' },
  { key: 'Routes', label: 'Routes', icon: 'map-outline' },
];

const DRIVER_DATA = [
  { name: 'Raj Patil', onTime: 96, accept: 94, trips: 4 },
  { name: 'Sameer Joshi', onTime: 98, accept: 96, trips: 3 },
  { name: 'Ganesh Shinde', onTime: 95, accept: 92, trips: 3 },
  { name: 'Amit Sharma', onTime: 92, accept: 90, trips: 5 },
  { name: 'Dinesh Kadam', onTime: 88, accept: 85, trips: 2 },
];

const VEHICLE_DATA = [
  { model: 'Tata Winger', plate: 'MH-12-CD-5678', km: 240, util: 92 },
  { model: 'Toyota Innova', plate: 'MH-12-AB-1234', km: 184, util: 85 },
  { model: 'Force Traveller', plate: 'MH-12-GH-3456', km: 160, util: 78 },
  { model: 'Maruti Ertiga', plate: 'MH-12-EF-9012', km: 110, util: 72 },
];

const ROUTE_DATA = [
  { name: 'Kothrud → Hinjewadi', occupancy: 86, onTime: 94 },
  { name: 'Hadapsar → Kharadi', occupancy: 82, onTime: 92 },
  { name: 'Magarpatta → Viman Nagar', occupancy: 88, onTime: 90 },
  { name: 'Wakad → Baner', occupancy: 80, onTime: 96 },
];

export default function ReportsScreen() {
  const { kpis, isDarkMode, themeColors } = useApp();

  const [activeTab, setActiveTab] = useState<ReportTab>('Drivers');

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={themeColors.cardBackground}
      />

      <Header title="Reports & KPIs" subtitle="Today's Operational Summary" showBack />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* KPI Stats Grid */}
        <View style={styles.kpiSection}>
          <View style={styles.kpiRow}>
            <StatCard
              label="Today's Trips"
              value={kpis.totalTripsToday}
              icon="bus"
              trend="up"
              trendValue="+12%"
            />
            <StatCard
              label="Completion Rate"
              value={`${kpis.completionRate}%`}
              icon="checkmark-circle"
              highlightColor={themeColors.available}
              trend="up"
              trendValue="+3%"
            />
          </View>
          <View style={styles.kpiRow}>
            <StatCard
              label="Avg Occupancy"
              value={`${kpis.averageOccupancy}%`}
              icon="people"
            />
            <StatCard
              label="Vehicle Util."
              value={`${kpis.vehicleUtilization}%`}
              icon="car"
              highlightColor={themeColors.accent}
              trend="up"
              trendValue="+5%"
            />
          </View>
          <View style={styles.kpiRow}>
            <StatCard
              label="On-Time Perf."
              value={`${kpis.onTimePerformance}%`}
              icon="time"
              highlightColor={themeColors.available}
            />
            <StatCard
              label="Avg Cost/km"
              value={`₹${kpis.averageCostPerKm}`}
              icon="cash"
            />
          </View>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          {TAB_CONFIG.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                activeOpacity={0.7}
                onPress={() => setActiveTab(tab.key)}
                style={[
                  styles.tabItem,
                  {
                    backgroundColor: isActive ? themeColors.primary : 'transparent',
                  },
                ]}
              >
                <Ionicons
                  name={tab.icon as any}
                  size={16}
                  color={isActive ? '#FFFFFF' : themeColors.textSecondary}
                />
                <Text
                  style={[
                    styles.tabText,
                    {
                      color: isActive ? '#FFFFFF' : themeColors.textSecondary,
                      fontWeight: isActive ? '600' : '400',
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Tab Content */}
        {activeTab === 'Drivers' && (
          <View
            style={[
              styles.contentCard,
              { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border },
            ]}
          >
            <View style={styles.contentCardHeader}>
              <View style={styles.contentCardTitleRow}>
                <Ionicons name="people-outline" size={18} color={themeColors.primary} />
                <Text style={[styles.contentCardTitle, { color: themeColors.text }]}>
                  Driver Performance
                </Text>
              </View>
              <Text style={[styles.contentCardCount, { color: themeColors.textMuted }]}>
                {DRIVER_DATA.length} drivers
              </Text>
            </View>

            {DRIVER_DATA.map((d, i) => (
              <View
                key={i}
                style={[
                  styles.dataRow,
                  i > 0 && { borderTopWidth: 1, borderTopColor: themeColors.borderLight },
                ]}
              >
                <View style={styles.dataRowHeader}>
                  <View style={styles.dataRowLeft}>
                    <View
                      style={[
                        styles.dataAvatar,
                        { backgroundColor: d.onTime >= 95 ? themeColors.availableLight : themeColors.primaryLight },
                      ]}
                    >
                      <Text
                        style={[
                          styles.dataAvatarText,
                          { color: d.onTime >= 95 ? themeColors.available : themeColors.primary },
                        ]}
                      >
                        {d.name.charAt(0)}
                      </Text>
                    </View>
                    <View>
                      <Text style={[styles.dataName, { color: themeColors.text }]}>
                        {d.name}
                      </Text>
                      <Text style={[styles.dataSub, { color: themeColors.textSecondary }]}>
                        {d.trips} trips today
                      </Text>
                    </View>
                  </View>
                  <View style={styles.dataBadge}>
                    <Ionicons
                      name={d.onTime >= 95 ? 'checkmark-circle' : 'alert-circle'}
                      size={14}
                      color={d.onTime >= 95 ? themeColors.available : themeColors.warning}
                    />
                    <Text
                      style={[
                        styles.dataBadgeText,
                        { color: d.onTime >= 95 ? themeColors.available : themeColors.warning },
                      ]}
                    >
                      {d.onTime}%
                    </Text>
                  </View>
                </View>

                <View style={styles.progressWrap}>
                  <View style={[styles.progressTrack, { backgroundColor: themeColors.backgroundElement }]}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${d.onTime}%`,
                          backgroundColor: d.onTime >= 95 ? themeColors.available : themeColors.accent,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.progressLabel, { color: themeColors.textMuted }]}>
                    on-time
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'Vehicles' && (
          <View
            style={[
              styles.contentCard,
              { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border },
            ]}
          >
            <View style={styles.contentCardHeader}>
              <View style={styles.contentCardTitleRow}>
                <Ionicons name="car-outline" size={18} color={themeColors.primary} />
                <Text style={[styles.contentCardTitle, { color: themeColors.text }]}>
                  Fleet Utilization
                </Text>
              </View>
              <Text style={[styles.contentCardCount, { color: themeColors.textMuted }]}>
                {VEHICLE_DATA.length} vehicles
              </Text>
            </View>

            {VEHICLE_DATA.map((v, i) => (
              <View
                key={i}
                style={[
                  styles.dataRow,
                  i > 0 && { borderTopWidth: 1, borderTopColor: themeColors.borderLight },
                ]}
              >
                <View style={styles.dataRowHeader}>
                  <View style={styles.dataRowLeft}>
                    <View
                      style={[
                        styles.dataAvatar,
                        { backgroundColor: themeColors.secondaryLight },
                      ]}
                    >
                      <Ionicons name="car" size={16} color={themeColors.secondary} />
                    </View>
                    <View>
                      <Text style={[styles.dataName, { color: themeColors.text }]}>
                        {v.model}
                      </Text>
                      <Text style={[styles.dataSub, { color: themeColors.textSecondary }]}>
                        {v.plate} • {v.km} km
                      </Text>
                    </View>
                  </View>
                  <View style={styles.dataBadge}>
                    <Text
                      style={[
                        styles.dataBadgeText,
                        {
                          color: v.util >= 85 ? themeColors.available : themeColors.warning,
                        },
                      ]}
                    >
                      {v.util}%
                    </Text>
                  </View>
                </View>

                <View style={styles.progressWrap}>
                  <View style={[styles.progressTrack, { backgroundColor: themeColors.backgroundElement }]}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${v.util}%`,
                          backgroundColor: v.util >= 85 ? themeColors.primary : themeColors.warning,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.progressLabel, { color: themeColors.textMuted }]}>
                    utilization
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'Routes' && (
          <View
            style={[
              styles.contentCard,
              { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border },
            ]}
          >
            <View style={styles.contentCardHeader}>
              <View style={styles.contentCardTitleRow}>
                <Ionicons name="map-outline" size={18} color={themeColors.primary} />
                <Text style={[styles.contentCardTitle, { color: themeColors.text }]}>
                  Route Efficiency
                </Text>
              </View>
              <Text style={[styles.contentCardCount, { color: themeColors.textMuted }]}>
                {ROUTE_DATA.length} routes
              </Text>
            </View>

            {ROUTE_DATA.map((r, i) => (
              <View
                key={i}
                style={[
                  styles.dataRow,
                  i > 0 && { borderTopWidth: 1, borderTopColor: themeColors.borderLight },
                ]}
              >
                <View style={styles.dataRowHeader}>
                  <View style={styles.dataRowLeft}>
                    <View
                      style={[
                        styles.dataAvatar,
                        { backgroundColor: themeColors.accentLight },
                      ]}
                    >
                      <Ionicons name="map" size={16} color={themeColors.accent} />
                    </View>
                    <View>
                      <Text style={[styles.dataName, { color: themeColors.text }]}>
                        {r.name}
                      </Text>
                      <Text style={[styles.dataSub, { color: themeColors.textSecondary }]}>
                        {r.occupancy}% occupancy
                      </Text>
                    </View>
                  </View>
                  <View style={styles.dataBadge}>
                    <Ionicons name="checkmark-circle" size={14} color={themeColors.available} />
                    <Text style={[styles.dataBadgeText, { color: themeColors.available }]}>
                      {r.onTime}%
                    </Text>
                  </View>
                </View>

                <View style={styles.progressWrap}>
                  <View style={[styles.progressTrack, { backgroundColor: themeColors.backgroundElement }]}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${r.onTime}%`,
                          backgroundColor: themeColors.available,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.progressLabel, { color: themeColors.textMuted }]}>
                    on-time
                  </Text>
                </View>
              </View>
            ))}
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
  scrollContent: {
    padding: Spacing.base,
    paddingBottom: Spacing.xxl,
  },
  // KPI
  kpiSection: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  // Tabs
  tabContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.md,
  },
  tabText: {
    fontSize: Typography.fontSizes.sm,
  },
  // Content card
  contentCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    ...Shadows.card,
  },
  contentCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  contentCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  contentCardTitle: {
    fontSize: Typography.fontSizes.base,
    fontWeight: Typography.weights.bold,
  },
  contentCardCount: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.medium,
  },
  // Data rows
  dataRow: {
    paddingVertical: Spacing.sm + 4,
  },
  dataRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  dataRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
    flex: 1,
  },
  dataAvatar: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataAvatarText: {
    fontSize: Typography.fontSizes.base,
    fontWeight: Typography.weights.bold,
  },
  dataName: {
    fontSize: Typography.fontSizes.sm + 1,
    fontWeight: Typography.weights.semibold,
  },
  dataSub: {
    fontSize: Typography.fontSizes.xs,
    marginTop: 1,
  },
  dataBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dataBadgeText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.bold,
  },
  // Progress
  progressWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  progressLabel: {
    fontSize: Typography.fontSizes.xs - 1,
    fontWeight: Typography.weights.medium,
    width: 60,
    textAlign: 'right',
  },
});
