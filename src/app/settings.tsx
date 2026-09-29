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
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { Header } from '@/components/ui/Header';

interface SettingItemProps {
  icon: string;
  label: string;
  description: string;
  value?: boolean;
  onValueChange?: (v: boolean) => void;
  onPress?: () => void;
  trailing?: React.ReactNode;
  showDivider?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  label,
  description,
  value,
  onValueChange,
  onPress,
  trailing,
  showDivider = true,
}) => {
  const { themeColors } = useApp();

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
      disabled={!onPress && onValueChange === undefined}
      style={[
        styles.settingItem,
        showDivider && { borderBottomWidth: 1, borderBottomColor: themeColors.borderLight },
      ]}
    >
      <View style={[styles.settingIcon, { backgroundColor: themeColors.primaryLight }]}>
        <Ionicons name={icon as any} size={18} color={themeColors.primary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingLabel, { color: themeColors.text }]}>{label}</Text>
        <Text style={[styles.settingDesc, { color: themeColors.textSecondary }]}>
          {description}
        </Text>
      </View>
      {trailing ||
        (onValueChange && (
          <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: themeColors.border, true: themeColors.accent }}
            thumbColor="#FFFFFF"
          />
        ))}
    </TouchableOpacity>
  );
};

interface SettingGroupProps {
  title: string;
  icon: string;
  children: React.ReactNode;
}

const SettingGroup: React.FC<SettingGroupProps> = ({ title, icon, children }) => {
  const { themeColors } = useApp();

  return (
    <View
      style={[
        styles.settingGroup,
        { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border },
      ]}
    >
      <View style={styles.groupHeader}>
        <Ionicons name={icon as any} size={16} color={themeColors.textMuted} />
        <Text style={[styles.groupTitle, { color: themeColors.textMuted }]}>{title}</Text>
      </View>
      {children}
    </View>
  );
};

export default function SettingsScreen() {
  const { user, isDarkMode, toggleDarkMode, themeColors } = useApp();

  const [autoRecommend, setAutoRecommend] = useState(true);
  const [driverNoShowAlerts, setDriverNoShowAlerts] = useState(true);
  const [voiceDispatchFallback, setVoiceDispatchFallback] = useState(true);
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={themeColors.cardBackground}
      />

      <Header title="Settings" subtitle="Preferences & Configuration" showBack />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Dispatch Hub */}
        <SettingGroup title="DISPATCH HUB" icon="business-outline">
          <SettingItem
            icon="location-outline"
            label="Assigned Hub"
            description={user?.hub || 'Pune Operations Hub'}
            trailing={
              <TouchableOpacity
                onPress={() =>
                  Alert.alert('Hub Selection', 'Hub configuration is locked by organization policy.')
                }
                style={[styles.changeBtn, { backgroundColor: themeColors.primaryLight }]}
              >
                <Text style={[styles.changeBtnText, { color: themeColors.primary }]}>Change</Text>
              </TouchableOpacity>
            }
          />
        </SettingGroup>

        {/* Dispatch Automation */}
        <SettingGroup title="DISPATCH AUTOMATION" icon="flash-outline">
          <SettingItem
            icon="flash-outline"
            label="Auto-recommend Nearest Driver"
            description="Match vehicles and routes using distance and workload"
            value={autoRecommend}
            onValueChange={setAutoRecommend}
          />
          <SettingItem
            icon="alert-circle-outline"
            label="Driver No-Show Alerts"
            description="Trigger alert if driver does not accept within 3 minutes"
            value={driverNoShowAlerts}
            onValueChange={setDriverNoShowAlerts}
          />
          <SettingItem
            icon="call-outline"
            label="Direct Calling Fallback"
            description="Prompt direct phone call when digital dispatch declines"
            value={voiceDispatchFallback}
            onValueChange={setVoiceDispatchFallback}
            showDivider={false}
          />
        </SettingGroup>

        {/* Display & Accessibility */}
        <SettingGroup title="DISPLAY & APPEARANCE" icon="color-palette-outline">
          <SettingItem
            icon="moon-outline"
            label="Dark Mode"
            description="Low-glare high-contrast theme for night shift operations"
            value={isDarkMode}
            onValueChange={toggleDarkMode}
          />
          <SettingItem
            icon="text-outline"
            label="High Legibility Font Scaling"
            description="Enhance badge and status contrast"
            value={highContrastMode}
            onValueChange={setHighContrastMode}
            showDivider={false}
          />
        </SettingGroup>

        {/* Notifications */}
        <SettingGroup title="NOTIFICATIONS" icon="notifications-outline">
          <SettingItem
            icon="notifications-outline"
            label="Push Notifications"
            description="Receive alerts for trip updates and assignments"
            value={notifications}
            onValueChange={setNotifications}
            showDivider={false}
          />
        </SettingGroup>

        {/* About */}
        <SettingGroup title="ABOUT" icon="information-circle-outline">
          <SettingItem
            icon="information-circle-outline"
            label="App Version"
            description="36Route v2.1.0"
            trailing={
              <Ionicons name="chevron-forward" size={16} color={themeColors.textMuted} />
            }
            showDivider={false}
          />
        </SettingGroup>
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
    gap: Spacing.md,
  },
  settingGroup: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    ...Shadows.card,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  groupTitle: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    gap: Spacing.md - 4,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingContent: {
    flex: 1,
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
  changeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
  },
  changeBtnText: {
    fontSize: Typography.fontSizes.xs + 1,
    fontWeight: Typography.weights.semibold,
  },
});
