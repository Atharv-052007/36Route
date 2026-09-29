import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { AppSafeAreaView } from '@/components/ui/AppSafeAreaView';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { Typography, BorderRadius, Spacing, Shadows } from '@/constants/theme';
import { ConfirmationModal } from '@/components/ui/AppStates';

type AdminMode = 'admin' | 'driver' | 'user' | 'superadmin';

const MODES: { key: AdminMode; label: string; subtitle: string; icon: string; active: boolean }[] = [
  { key: 'admin', label: 'Admin Mode', subtitle: 'Supervisor operations & dispatch', icon: 'shield-checkmark-outline', active: true },
  { key: 'driver', label: 'Driver Mode', subtitle: 'Driver cockpit, trips & passengers', icon: 'car-outline', active: false },
  { key: 'user', label: 'User Mode', subtitle: 'Passenger dashboard & ride booking', icon: 'person-outline', active: false },
  { key: 'superadmin', label: 'Super Admin Mode', subtitle: 'Full system administration', icon: 'flash-outline', active: false },
];

export default function AdminProfileScreen() {
  const router = useRouter();
  const { user, isDarkMode, toggleDarkMode, logout, themeColors } = useApp();
  const [showLogout, setShowLogout] = React.useState(false);

  const switchMode = (mode: AdminMode) => {
    if (mode === 'driver') {
      router.replace('/(driver)' as any);
    } else if (mode === 'user') {
      router.replace('/(tabs)' as any);
    } else {
      router.replace('/(admin)' as any);
    }
  };

  const handleLogout = () => {
    setShowLogout(false);
    logout();
    router.replace('/login');
  };

  return (
    <AppSafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }, Shadows.card]}>
          <View style={[styles.avatar, { backgroundColor: themeColors.primary, borderWidth: 3, borderColor: themeColors.primaryLight }]}>
            <Text style={styles.avatarText}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </Text>
          </View>
          <Text style={[styles.userName, { color: themeColors.text }]}>
            {user?.name || 'Admin'}
          </Text>
          <Text style={[styles.userRole, { color: themeColors.secondary }]}>
            {user?.role || 'Operations Lead'}
          </Text>
          <View style={[styles.statusPill, { backgroundColor: themeColors.accentLight }]}>
            <Ionicons name="ellipse" size={10} color={themeColors.accent} />
            <Text style={[styles.statusText, { color: themeColors.accent }]}>On Duty</Text>
          </View>

          <View style={[styles.detailGrid, { borderTopColor: themeColors.borderLight }]}>
            <View style={styles.detailItem}>
              <Ionicons name="mail-outline" size={14} color={themeColors.textMuted} />
              <Text style={[styles.detailValue, { color: themeColors.textSecondary }]}>{user?.email || 'admin@36route.com'}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="call-outline" size={14} color={themeColors.textMuted} />
              <Text style={[styles.detailValue, { color: themeColors.textSecondary }]}>{user?.phone || '+91 98220 00000'}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="location-outline" size={14} color={themeColors.textMuted} />
              <Text style={[styles.detailValue, { color: themeColors.textSecondary }]}>{user?.hub || 'Pune Operations Hub'}</Text>
            </View>
          </View>
        </View>

        {/* Switch Role */}
        <Text style={[styles.sectionTitle, { color: themeColors.textMuted }]}>SWITCH ROLE</Text>
        <View style={[styles.menuCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }, Shadows.subtle]}>
          {MODES.map((mode, index) => (
            <TouchableOpacity
              key={mode.key}
              activeOpacity={0.7}
              onPress={() => switchMode(mode.key)}
              style={[
                styles.menuItem,
                index < MODES.length - 1 && { borderBottomColor: themeColors.borderLight },
              ]}
            >
              <View style={[styles.iconWrap, { backgroundColor: mode.active ? themeColors.accentLight : themeColors.backgroundElement }]}>
                <Ionicons name={mode.icon as any} size={18} color={mode.active ? themeColors.secondary : themeColors.textSecondary} />
              </View>
              <View style={styles.menuTextWrap}>
                <Text style={[styles.menuTitle, { color: themeColors.text }]}>{mode.label}</Text>
                <Text style={[styles.menuSubtitle, { color: themeColors.textMuted }]}>{mode.subtitle}</Text>
              </View>
              {mode.active ? (
                <Text style={[styles.activeLabel, { color: themeColors.secondary }]}>Active</Text>
              ) : (
                <Ionicons name="chevron-forward" size={16} color={themeColors.textMuted} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Account */}
        <Text style={[styles.sectionTitle, { color: themeColors.textMuted }]}>ACCOUNT</Text>
        <View style={[styles.menuCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }, Shadows.subtle]}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={toggleDarkMode}
            style={[styles.menuItem, { borderBottomColor: themeColors.borderLight }]}
          >
            <View style={[styles.iconWrap, { backgroundColor: themeColors.backgroundElement }]}>
              <Ionicons name={isDarkMode ? 'sunny-outline' : 'moon-outline'} size={18} color={themeColors.textSecondary} />
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={[styles.menuTitle, { color: themeColors.text }]}>Dark Mode</Text>
              <Text style={[styles.menuSubtitle, { color: themeColors.textMuted }]}>
                {isDarkMode ? 'Turn off dim palette' : 'Turn on dim palette'}
              </Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: themeColors.border, true: themeColors.accentLight }}
              thumbColor={isDarkMode ? themeColors.accent : themeColors.textMuted}
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push('/settings')}
            style={[styles.menuItem, { borderBottomColor: themeColors.borderLight }]}
          >
            <View style={[styles.iconWrap, { backgroundColor: themeColors.backgroundElement }]}>
              <Ionicons name="settings-outline" size={18} color={themeColors.textSecondary} />
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={[styles.menuTitle, { color: themeColors.text }]}>Settings</Text>
              <Text style={[styles.menuSubtitle, { color: themeColors.textMuted }]}>Supervisor preferences & thresholds</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={themeColors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push('/help')}
            style={styles.menuItem}
          >
            <View style={[styles.iconWrap, { backgroundColor: themeColors.backgroundElement }]}>
              <Ionicons name="help-circle-outline" size={18} color={themeColors.textSecondary} />
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={[styles.menuTitle, { color: themeColors.text }]}>Help & Support</Text>
              <Text style={[styles.menuSubtitle, { color: themeColors.textMuted }]}>Operation manuals & escalations</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={themeColors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Sign Out */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setShowLogout(true)}
          style={[styles.signOutBtn, { backgroundColor: themeColors.dangerLight, borderColor: themeColors.dangerBorder }]}
        >
          <Ionicons name="log-out-outline" size={20} color={themeColors.danger} />
          <Text style={[styles.signOutText, { color: themeColors.danger }]}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={[styles.version, { color: themeColors.textMuted }]}>Admin Mode · 36Route v1.0.0</Text>
      </ScrollView>

      <ConfirmationModal
        visible={showLogout}
        title="Sign Out"
        message="Are you sure you want to sign out of Admin Mode?"
        confirmText="Sign Out"
        onConfirm={handleLogout}
        onCancel={() => setShowLogout(false)}
        variant="danger"
      />
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: Spacing.base, paddingBottom: Spacing.xxl },
  profileCard: {
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: Typography.fontSizes.hero,
    fontWeight: Typography.weights.bold,
  },
  userName: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.weights.bold,
    letterSpacing: -0.3,
  },
  userRole: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold,
    marginTop: 2,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    gap: 6,
    marginTop: Spacing.sm,
  },
  statusText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.semibold,
  },
  detailGrid: {
    alignSelf: 'stretch',
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    gap: Spacing.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    justifyContent: 'center',
  },
  detailValue: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.medium,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
    marginTop: Spacing.xs,
  },
  menuCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTextWrap: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  menuTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.semibold,
  },
  menuSubtitle: {
    fontSize: Typography.fontSizes.xs,
    marginTop: 2,
  },
  activeLabel: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.bold,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  signOutText: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.semibold,
  },
  version: {
    textAlign: 'center',
    fontSize: Typography.fontSizes.xs,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xs,
  },
});
