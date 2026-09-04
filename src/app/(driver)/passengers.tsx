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
import { Typography, BorderRadius } from '../../constants/theme';
import { EmptyState } from '../../components/ui/AppStates';
import Animated, { FadeInUp, FadeInDown, FadeIn } from 'react-native-reanimated';

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

  return (
    <AppSafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <Text style={[styles.headerTitle, { color: themeColors.text }]}>Passengers</Text>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(100).duration(400)} style={[styles.tabs, { backgroundColor: themeColors.backgroundElement }]}>
          {(['all', 'boarded', 'no-show'] as BoardingTab[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && { backgroundColor: themeColors.secondary }]}
            >
              <Text style={[styles.tabText, { color: activeTab === tab ? '#FFF' : themeColors.textSecondary }]}>
                {tab === 'all' ? 'All' : tab === 'boarded' ? 'Boarded' : 'No-Shows'}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {display.length === 0 ? (
          <Animated.View entering={FadeIn.duration(400)}>
            <EmptyState title="No Passengers" description="No passengers in this category." icon="people-outline" />
          </Animated.View>
        ) : (
          display.map((p, index) => (
            <Animated.View key={p.id} entering={FadeInUp.delay(index * 80).duration(400).springify()}>
              <TouchableOpacity
                onPress={() => toggleBoarded(p.id)}
                style={[styles.passCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }, p.boarded && { borderColor: themeColors.accent }]}
                activeOpacity={0.7}
              >
                <View style={[styles.avatar, p.boarded ? { backgroundColor: themeColors.accentLight } : { backgroundColor: themeColors.backgroundElement }]}>
                  <Text style={[styles.avatarText, { color: p.boarded ? themeColors.accent : themeColors.textMuted }]}>
                    {p.name.charAt(0)}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.passName, { color: themeColors.text }]}>{p.name}</Text>
                  <Text style={[styles.passMeta, { color: themeColors.textSecondary }]}>
                    Seat {p.seat} • {p.stop}
                  </Text>
                </View>
                <View style={[styles.statusPill, { backgroundColor: p.boarded ? themeColors.accentLight : themeColors.warningLight }]}>
                  <Ionicons name={p.boarded ? 'checkmark-circle' : 'alert-circle-outline'} size={14} color={p.boarded ? themeColors.accent : themeColors.warning} />
                  <Text style={[styles.statusText, { color: p.boarded ? themeColors.accent : themeColors.warning }]}>
                    {p.boarded ? 'Boarded' : 'No-Show'}
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
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
  tabs: {
    flexDirection: 'row',
    borderRadius: BorderRadius.md,
    padding: 4,
    marginBottom: 14,
  },
  tab: { flex: 1, paddingVertical: 10, borderRadius: BorderRadius.sm, alignItems: 'center' },
  tabText: { fontSize: Typography.fontSizes.sm, fontWeight: Typography.weights.semibold as any },
  passCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: 10,
    gap: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontSize: Typography.fontSizes.md, fontWeight: Typography.weights.bold as any },
  passName: { fontSize: Typography.fontSizes.md, fontWeight: Typography.weights.semibold as any },
  passMeta: { fontSize: Typography.fontSizes.xs, marginTop: 2 },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  statusText: { fontSize: Typography.fontSizes.xs, fontWeight: Typography.weights.semibold as any },
});
