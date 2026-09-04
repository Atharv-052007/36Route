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
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { Header } from '@/components/ui/Header';
import { StatCard } from '@/components/ui/StatCard';

type ReportTab = 'Drivers' | 'Vehicles' | 'Routes';

export default function ReportsScreen() {
  const { kpis, isDarkMode } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const [activeTab, setActiveTab] = useState<ReportTab>('Drivers');

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.cardBackground}
      />

      <Header title="Reports & KPIs" subtitle="Today's Operational Summary" showBack />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Core Operational KPIs Grid */}
        <View style={styles.kpiGrid}>
          <View style={styles.gridRow}>
            <StatCard label="Today's Trips" value={kpis.totalTripsToday} />
            <StatCard
              label="Completion Rate"
              value={`${kpis.completionRate}%`}
              highlightColor={theme.available}
            />
          </View>

          <View style={styles.gridRow}>
            <StatCard label="Average Occupancy" value={`${kpis.averageOccupancy}%`} />
            <StatCard
              label="Vehicle Utilization"
              value={`${kpis.vehicleUtilization}%`}
              highlightColor={theme.accent}
            />
          </View>

          <View style={styles.gridRow}>
            <StatCard
              label="On-Time Performance"
              value={`${kpis.onTimePerformance}%`}
              highlightColor={theme.available}
            />
            <StatCard label="Avg. Cost / km" value={`₹${kpis.averageCostPerKm}`} />
          </View>
        </View>

        {/* Breakdown Tabs */}
        <View
          style={[
            styles.tabsContainer,
            { backgroundColor: theme.backgroundElement, borderColor: theme.border },
          ]}
        >
          {(['Drivers', 'Vehicles', 'Routes'] as ReportTab[]).map((tab) => {
            const isSelected = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[
                  styles.tabBtn,
                  isSelected && {
                    backgroundColor: theme.cardBackground,
                    ...Shadows.subtle,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.tabBtnText,
                    {
                      color: isSelected ? theme.text : theme.textSecondary,
                      fontWeight: isSelected ? '600' : '400',
                    },
                  ]}
                >
                  {tab === 'Drivers'
                    ? 'Driver Performance'
                    : tab === 'Vehicles'
                    ? 'Vehicle Utilization'
                    : 'Route Efficiency'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Tab Breakdown Content */}
        {activeTab === 'Drivers' && (
          <View
            style={[
              styles.card,
              { backgroundColor: theme.cardBackground, borderColor: theme.border },
            ]}
          >
            <Text style={[styles.cardTitle, { color: theme.textSecondary }]}>
              DRIVER ON-TIME & ACCEPTANCE
            </Text>

            {[
              { name: 'Raj Patil', onTime: 96, accept: 94, trips: 4 },
              { name: 'Sameer Joshi', onTime: 98, accept: 96, trips: 3 },
              { name: 'Ganesh Shinde', onTime: 95, accept: 92, trips: 3 },
              { name: 'Amit Sharma', onTime: 92, accept: 90, trips: 5 },
              { name: 'Dinesh Kadam', onTime: 88, accept: 85, trips: 2 },
            ].map((d, i) => (
              <View
                key={i}
                style={[
                  styles.barItem,
                  i > 0 && { borderTopWidth: 1, borderTopColor: theme.borderLight },
                ]}
              >
                <View style={styles.barItemHeader}>
                  <Text style={[styles.driverName, { color: theme.text }]}>
                    {d.name}
                  </Text>
                  <Text style={[styles.driverTrips, { color: theme.textSecondary }]}>
                    {d.trips} trips today
                  </Text>
                </View>

                {/* Progress bar */}
                <View style={styles.barWrap}>
                  <View
                    style={[
                      styles.barTrack,
                      { backgroundColor: theme.backgroundElement },
                    ]}
                  >
                    <View
                      style={[
                        styles.barFill,
                        {
                          width: `${d.onTime}%`,
                          backgroundColor:
                            d.onTime >= 95 ? theme.available : theme.accent,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.barValueText, { color: theme.text }]}>
                    {d.onTime}% on-time
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'Vehicles' && (
          <View
            style={[
              styles.card,
              { backgroundColor: theme.cardBackground, borderColor: theme.border },
            ]}
          >
            <Text style={[styles.cardTitle, { color: theme.textSecondary }]}>
              FLEET ACTIVE HOURS & KILOMETERS
            </Text>

            {[
              { model: 'Tata Winger', plate: 'MH-12-CD-5678', km: 240, util: 92 },
              { model: 'Toyota Innova', plate: 'MH-12-AB-1234', km: 184, util: 85 },
              { model: 'Force Traveller', plate: 'MH-12-GH-3456', km: 160, util: 78 },
              { model: 'Maruti Ertiga', plate: 'MH-12-EF-9012', km: 110, util: 72 },
            ].map((v, i) => (
              <View
                key={i}
                style={[
                  styles.barItem,
                  i > 0 && { borderTopWidth: 1, borderTopColor: theme.borderLight },
                ]}
              >
                <View style={styles.barItemHeader}>
                  <Text style={[styles.driverName, { color: theme.text }]}>
                    {v.model} ({v.plate})
                  </Text>
                  <Text style={[styles.driverTrips, { color: theme.textSecondary }]}>
                    {v.km} km logged
                  </Text>
                </View>

                <View style={styles.barWrap}>
                  <View
                    style={[
                      styles.barTrack,
                      { backgroundColor: theme.backgroundElement },
                    ]}
                  >
                    <View
                      style={[
                        styles.barFill,
                        { width: `${v.util}%`, backgroundColor: theme.accent },
                      ]}
                    />
                  </View>
                  <Text style={[styles.barValueText, { color: theme.text }]}>
                    {v.util}% utilization
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'Routes' && (
          <View
            style={[
              styles.card,
              { backgroundColor: theme.cardBackground, borderColor: theme.border },
            ]}
          >
            <Text style={[styles.cardTitle, { color: theme.textSecondary }]}>
              ROUTE OCCUPANCY & PUNCTUALITY
            </Text>

            {[
              { name: 'Kothrud → Hinjewadi', occupancy: 86, onTime: 94 },
              { name: 'Hadapsar → Kharadi', occupancy: 82, onTime: 92 },
              { name: 'Magarpatta → Viman Nagar', occupancy: 88, onTime: 90 },
              { name: 'Wakad → Baner', occupancy: 80, onTime: 96 },
            ].map((r, i) => (
              <View
                key={i}
                style={[
                  styles.barItem,
                  i > 0 && { borderTopWidth: 1, borderTopColor: theme.borderLight },
                ]}
              >
                <View style={styles.barItemHeader}>
                  <Text style={[styles.driverName, { color: theme.text }]}>
                    {r.name}
                  </Text>
                  <Text style={[styles.driverTrips, { color: theme.textSecondary }]}>
                    {r.occupancy}% occupancy
                  </Text>
                </View>

                <View style={styles.barWrap}>
                  <View
                    style={[
                      styles.barTrack,
                      { backgroundColor: theme.backgroundElement },
                    ]}
                  >
                    <View
                      style={[
                        styles.barFill,
                        { width: `${r.onTime}%`, backgroundColor: theme.available },
                      ]}
                    />
                  </View>
                  <Text style={[styles.barValueText, { color: theme.text }]}>
                    {r.onTime}% on-time
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
  kpiGrid: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  gridRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    padding: 3,
    marginBottom: Spacing.md,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: BorderRadius.xs,
  },
  tabBtnText: {
    fontSize: Typography.fontSizes.xs,
    textAlign: 'center',
  },
  card: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  cardTitle: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.8,
    marginBottom: Spacing.md,
  },
  barItem: {
    paddingVertical: Spacing.sm,
  },
  barItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  driverName: {
    fontSize: Typography.fontSizes.sm + 1,
    fontWeight: Typography.weights.semibold,
  },
  driverTrips: {
    fontSize: Typography.fontSizes.xs,
  },
  barWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  barTrack: {
    flex: 1,
    height: 8,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  barValueText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.semibold,
    width: 80,
    textAlign: 'right',
  },
});
