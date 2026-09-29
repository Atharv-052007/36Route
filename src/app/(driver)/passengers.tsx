import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { AppSafeAreaView } from '@/components/ui/AppSafeAreaView';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { Typography, BorderRadius, Shadows, Spacing } from '../../constants/theme';
import { EmptyState } from '../../components/ui/AppStates';
import { Header } from '@/components/ui/Header';

type BoardingTab = 'all' | 'boarded' | 'no-show';

const MOCK_PASSENGERS = [
  { id: '1', name: 'Aarav Sharma', seat: 'A1', stop: 'Central Colony', boarded: true },
  { id: '2', name: 'Meera Patel', seat: 'A2', stop: 'Green Park', boarded: true },
  { id: '3', name: 'Rohan Verma', seat: 'A3', stop: 'Lake View', boarded: false },
  { id: '4', name: 'Sara Khan', seat: 'A4', stop: 'Old Town', boarded: true },
];

export default function DriverPassengersScreen() {
  const { themeColors } = useApp();
  const [activeTab, setActiveTab] = useState<BoardingTab>('all');
  const [passengers, setPassengers] = useState(MOCK_PASSENGERS);

  const display =
    activeTab === 'all'
      ? passengers
      : activeTab === 'boarded'
        ? passengers.filter((p) => p.boarded)
        : passengers.filter((p) => !p.boarded);

  const toggleBoarded = (id: string) => {
    setPassengers((prev) => prev.map((p) => (p.id === id ? { ...p, boarded: !p.boarded } : p)));
  };

  const boardedCount = passengers.filter((p) => p.boarded).length;

  return (
    <AppSafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <Header
        title="Passengers"
        showBack
        subtitle={`${boardedCount}/${passengers.length} boarded`}
      />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: themeColors.cardBackground }, Shadows.small]}>
            <Ionicons name="people" size={20} color={themeColors.secondary} />
            <Text style={[styles.summaryNum, { color: themeColors.text }]}>{passengers.length}</Text>
            <Text style={[styles.summaryLabel, { color: themeColors.textMuted }]}>Total</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: themeColors.cardBackground }, Shadows.small]}>
            <Ionicons name="checkmark-circle" size={20} color={themeColors.accent} />
            <Text style={[styles.summaryNum, { color: themeColors.text }]}>{boardedCount}</Text>
            <Text style={[styles.summaryLabel, { color: themeColors.textMuted }]}>Boarded</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: themeColors.cardBackground }, Shadows.small]}>
            <Ionicons name="alert-circle" size={20} color={themeColors.warning} />
            <Text style={[styles.summaryNum, { color: themeColors.text }]}>{passengers.length - boardedCount}</Text>
            <Text style={[styles.summaryLabel, { color: themeColors.textMuted }]}>Pending</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabBar}>
          {(['all', 'boarded', 'no-show'] as BoardingTab[]).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[styles.tab, isActive && { backgroundColor: themeColors.secondary }]}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabText, { color: isActive ? '#FFF' : themeColors.textSecondary }]}>
                  {tab === 'all' ? 'All' : tab === 'boarded' ? 'Boarded' : 'Pending'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Passenger List */}
        {display.length === 0 ? (
          <EmptyState title="No Passengers" description="No passengers in this category." icon="people-outline" />
        ) : (
          display.map((p) => (
            <TouchableOpacity
              key={p.id}
              onPress={() => toggleBoarded(p.id)}
              style={[
                styles.passCard,
                { backgroundColor: themeColors.cardBackground },
                Shadows.small,
                p.boarded && { borderColor: themeColors.accent, borderWidth: 1.5 },
              ]}
              activeOpacity={0.7}
            >
              <View style={[styles.avatar, { backgroundColor: p.boarded ? themeColors.accentLight : themeColors.backgroundElement }]}>
                <Text style={[styles.avatarText, { color: p.boarded ? themeColors.accent : themeColors.textMuted }]}>
                  {p.name.charAt(0)}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.passName, { color: themeColors.text }]}>{p.name}</Text>
                <View style={styles.passMeta}>
                  <Ionicons name="person-outline" size={12} color={themeColors.textMuted} />
                  <Text style={[styles.passMetaText, { color: themeColors.textSecondary }]}>Seat {p.seat}</Text>
                  <View style={[styles.dot, { backgroundColor: themeColors.textMuted }]} />
                  <Ionicons name="location-outline" size={12} color={themeColors.textMuted} />
                  <Text style={[styles.passMetaText, { color: themeColors.textSecondary }]}>{p.stop}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.checkBtn, { backgroundColor: p.boarded ? themeColors.accent : themeColors.backgroundElement }]}
                onPress={() => toggleBoarded(p.id)}
              >
                <Ionicons name={p.boarded ? 'checkmark' : 'add'} size={18} color={p.boarded ? '#FFF' : themeColors.textMuted} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: Spacing.base, paddingBottom: 40 },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    padding: 14,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    gap: 6,
  },
  summaryNum: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.weights.bold as any,
  },
  summaryLabel: { fontSize: Typography.fontSizes.xs },
  tabBar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  tabText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold as any,
  },
  passCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    marginBottom: 10,
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.bold as any,
  },
  passName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.semibold as any,
  },
  passMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 3,
  },
  passMetaText: { fontSize: Typography.fontSizes.xs },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
  checkBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
