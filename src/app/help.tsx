import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { Header } from '@/components/ui/Header';

const PROTOCOLS = [
  {
    q: 'How should I handle a driver rejection or no-response?',
    a: 'When a driver declines or does not respond within 3 minutes, 36Route auto-recommends the next ranked driver. Use the direct "Call" fallback button if high-priority shift departure is within 15 minutes.',
  },
  {
    q: 'What is the SOP for an on-route vehicle breakdown?',
    a: '1. Contact the driver to verify passenger safety.\n2. In the Trips tab, locate the ongoing trip and tap "Change Vehicle" or "Reassign".\n3. The system will dispatch the nearest available standby vehicle to the current GPS coordinates.',
  },
  {
    q: 'How are passenger no-shows recorded?',
    a: 'If an employee is not present at the pickup waypoint within the 3-minute grace window, the driver marks "No-show". This appears in the supervisor Overview under "Needs Attention" for roster audit.',
  },
  {
    q: 'Who authorizes emergency route deviations?',
    a: 'Supervisors have operational override authority. To modify stops on an active route, open the Trip Details screen, tap Route, and edit waypoint sequences.',
  },
];

export default function HelpScreen() {
  const router = useRouter();
  const { isDarkMode } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.cardBackground}
      />

      <Header title="Operations Protocols" subtitle="Standard Operating Procedures (SOP)" showBack />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Support Banner */}
        <View style={[styles.banner, { backgroundColor: theme.primary }]}>
          <Ionicons name="shield-checkmark" size={24} color="#FFF" />
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Central Operations Control</Text>
            <Text style={styles.bannerSub}>24/7 Operations Desk • 1800-36-ROUTE</Text>
          </View>
        </View>

        {/* FAQs / Protocols */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          DISPATCH & EMERGENCY PROTOCOLS
        </Text>
        {PROTOCOLS.map((item, i) => (
          <TouchableOpacity
            key={i}
            activeOpacity={0.7}
            style={[
              styles.faq,
              { backgroundColor: theme.cardBackground, borderColor: theme.border },
            ]}
            onPress={() => setExpanded(expanded === i ? null : i)}
          >
            <View style={styles.faqRow}>
              <Text style={[styles.faqQ, { color: theme.text }]}>{item.q}</Text>
              <Ionicons
                name={expanded === i ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={theme.textMuted}
              />
            </View>
            {expanded === i && (
              <Text style={[styles.faqA, { color: theme.textSecondary }]}>
                {item.a}
              </Text>
            )}
          </TouchableOpacity>
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
  container: {
    padding: Spacing.base,
    paddingBottom: Spacing.xxl,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
    marginBottom: Spacing.lg,
    ...Shadows.subtle,
  },
  bannerTitle: {
    color: '#FFF',
    fontSize: Typography.fontSizes.base,
    fontWeight: Typography.weights.bold,
  },
  bannerSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: Typography.fontSizes.xs,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.8,
    marginBottom: Spacing.md,
  },
  faq: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.base,
    marginBottom: Spacing.sm,
    ...Shadows.subtle,
  },
  faqRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQ: {
    fontSize: Typography.fontSizes.sm + 1,
    fontWeight: Typography.weights.semibold,
    flex: 1,
    marginRight: Spacing.sm,
  },
  faqA: {
    fontSize: Typography.fontSizes.sm,
    marginTop: Spacing.sm,
    lineHeight: 20,
  },
});
