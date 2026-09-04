import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { Header } from '@/components/ui/Header';

export default function SettingsScreen() {
  const { user, isDarkMode, toggleDarkMode } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const [autoRecommend, setAutoRecommend] = useState(true);
  const [driverNoShowAlerts, setDriverNoShowAlerts] = useState(true);
  const [voiceDispatchFallback, setVoiceDispatchFallback] = useState(true);
  const [highContrastMode, setHighContrastMode] = useState(false);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.cardBackground}
      />

      <Header title="Settings" subtitle="Supervisor & Terminal Preferences" showBack />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hub Configuration */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.cardBackground, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            DISPATCH HUB
          </Text>
          <View style={styles.settingRow}>
            <View>
              <Text style={[styles.settingLabel, { color: theme.text }]}>
                Assigned Hub
              </Text>
              <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>
                {user?.hub || 'Pune Operations Hub'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => Alert.alert('Hub Selection', 'Hub configuration is locked by organization policy.')}
            >
              <Text style={[styles.linkText, { color: theme.accent }]}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Dispatch Automation */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.cardBackground, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            DISPATCH AUTOMATION
          </Text>

          <View style={[styles.settingRow, { borderBottomWidth: 1, borderBottomColor: theme.borderLight }]}>
            <View style={styles.settingTextWrap}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>
                Auto-recommend Nearest Driver
              </Text>
              <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>
                Match vehicles and routes using distance and workload
              </Text>
            </View>
            <Switch
              value={autoRecommend}
              onValueChange={setAutoRecommend}
              trackColor={{ false: '#CBD5E1', true: theme.accent }}
            />
          </View>

          <View style={[styles.settingRow, { borderBottomWidth: 1, borderBottomColor: theme.borderLight }]}>
            <View style={styles.settingTextWrap}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>
                Driver No-Show Threshold Alerts
              </Text>
              <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>
                Trigger alert if driver does not accept within 3 minutes
              </Text>
            </View>
            <Switch
              value={driverNoShowAlerts}
              onValueChange={setDriverNoShowAlerts}
              trackColor={{ false: '#CBD5E1', true: theme.accent }}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingTextWrap}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>
                Direct Calling Fallback Prompt
              </Text>
              <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>
                Prompt direct phone call when digital dispatch declines
              </Text>
            </View>
            <Switch
              value={voiceDispatchFallback}
              onValueChange={setVoiceDispatchFallback}
              trackColor={{ false: '#CBD5E1', true: theme.accent }}
            />
          </View>
        </View>

        {/* Display & Accessibility */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.cardBackground, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            DISPLAY & APPEARANCE
          </Text>

          <View style={[styles.settingRow, { borderBottomWidth: 1, borderBottomColor: theme.borderLight }]}>
            <View style={styles.settingTextWrap}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>
                Dark Operational Mode
              </Text>
              <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>
                Low-glare high-contrast theme for night shift operations
              </Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#CBD5E1', true: theme.accent }}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingTextWrap}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>
                High Legibility Font Scaling
              </Text>
              <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>
                Enhance badge and status contrast
              </Text>
            </View>
            <Switch
              value={highContrastMode}
              onValueChange={setHighContrastMode}
              trackColor={{ false: '#CBD5E1', true: theme.accent }}
            />
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
    marginBottom: Spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  settingTextWrap: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  settingLabel: {
    fontSize: Typography.fontSizes.sm + 1,
    fontWeight: Typography.weights.semibold,
  },
  settingDesc: {
    fontSize: Typography.fontSizes.xs,
    marginTop: 2,
    lineHeight: 16,
  },
  linkText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold,
  },
});
