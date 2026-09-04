import React from 'react';
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
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

type AdminMode = 'admin' | 'driver' | 'user' | 'superadmin';

const MODES: { key: AdminMode; label: string; subtitle: string; icon: string; active: boolean }[] = [
  { key: 'admin', label: 'Admin Mode', subtitle: 'Supervisor operations & dispatch', icon: 'shield-checkmark-outline', active: true },
  { key: 'driver', label: 'Driver Mode', subtitle: 'Driver cockpit, trips & passengers', icon: 'car-outline', active: false },
  { key: 'user', label: 'User Mode', subtitle: 'Passenger dashboard & ride booking', icon: 'person-outline', active: false },
  { key: 'superadmin', label: 'Super Admin Mode', subtitle: 'Full system administration', icon: 'flash-outline', active: false },
];

export default function AdminProfileScreen() {
  const router = useRouter();
  const { user, isDarkMode, toggleDarkMode, logout } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const switchMode = (mode: AdminMode) => {
    if (mode === 'driver') {
      router.replace('/(driver)' as any);
    } else if (mode === 'user') {
      router.replace('/(tabs)' as any);
    } else {
      router.replace('/(admin)' as any);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.cardBackground}
      />

      {/* Screen Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.cardBackground,
            borderBottomColor: theme.border,
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: theme.text }]}>Profile</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View
          style={[
            styles.profileCard,
            {
              backgroundColor: theme.cardBackground,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
            <Text style={styles.avatarText}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'G'}
            </Text>
          </View>
          <Text style={[styles.userName, { color: theme.text }]}>
            {user?.name || 'Govind'}
          </Text>
          <Text style={[styles.userRole, { color: theme.accent }]}>
            {user?.role || 'Operations Lead'}
          </Text>
          <View style={[styles.statusPill, { backgroundColor: theme.availableLight }]}>
            <Ionicons name="ellipse" size={10} color={theme.available} />
            <Text style={[styles.statusText, { color: theme.available }]}>On Duty</Text>
          </View>

          <View
            style={[
              styles.detailGrid,
              { borderTopColor: theme.border },
            ]}
          >
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: theme.textMuted }]}>Email</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>{user?.email || 'govind@36route.com'}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: theme.textMuted }]}>Phone</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>{user?.phone || '+91 98220 00000'}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: theme.textMuted }]}>Hub</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>{user?.hub || 'Pune Operations Hub'}</Text>
            </View>
          </View>
        </View>

        {/* Switch Role - Mode Selection */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          SWITCH ROLE
        </Text>
        <View
          style={[
            styles.menuList,
            {
              backgroundColor: theme.cardBackground,
              borderColor: theme.border,
            },
          ]}
        >
          {MODES.map((mode, index) => {
            const isLast = index === MODES.length - 1;
            return (
              <TouchableOpacity
                key={mode.key}
                activeOpacity={0.7}
                onPress={() => switchMode(mode.key)}
                style={[
                  styles.menuItem,
                  !isLast && {
                    borderBottomWidth: 1,
                    borderBottomColor: theme.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.iconWrap,
                    {
                      backgroundColor: mode.active
                        ? theme.accentLight
                        : theme.backgroundElement,
                    },
                  ]}
                >
                  <Ionicons
                    name={mode.icon as any}
                    size={18}
                    color={mode.active ? theme.accent : theme.text}
                  />
                </View>
                <View style={[styles.menuTextWrap, mode.active && styles.menuActiveWrap]}>
                  <Text style={[styles.menuTitle, { color: theme.text }]}>
                    {mode.label}
                  </Text>
                  <Text style={[styles.menuSubtitle, { color: theme.textSecondary }]}>
                    {mode.subtitle}
                  </Text>
                </View>
                {mode.active ? (
                  <Text style={[styles.activeLabel, { color: theme.accent }]}>Active</Text>
                ) : (
                  <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Account Options */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          ACCOUNT
        </Text>
        <View
          style={[
            styles.menuList,
            {
              backgroundColor: theme.cardBackground,
              borderColor: theme.border,
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={toggleDarkMode}
            style={[
              styles.menuItem,
              {
                borderBottomWidth: 1,
                borderBottomColor: theme.border,
              },
            ]}
          >
            <View
              style={[styles.iconWrap, { backgroundColor: theme.backgroundElement }]}
            >
              <Ionicons
                name={isDarkMode ? 'sunny-outline' : 'moon-outline'}
                size={18}
                color={theme.text}
              />
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={[styles.menuTitle, { color: theme.text }]}>Dark Mode</Text>
              <Text style={[styles.menuSubtitle, { color: theme.textSecondary }]}>
                {isDarkMode ? 'Turn off dim palette' : 'Turn on dim palette'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push('/settings')}
            style={[
              styles.menuItem,
              {
                borderBottomWidth: 1,
                borderBottomColor: theme.border,
              },
            ]}
          >
            <View
              style={[styles.iconWrap, { backgroundColor: theme.backgroundElement }]}
            >
              <Ionicons name="settings-outline" size={18} color={theme.text} />
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={[styles.menuTitle, { color: theme.text }]}>Settings</Text>
              <Text style={[styles.menuSubtitle, { color: theme.textSecondary }]}>
                Supervisor preferences & thresholds
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push('/help')}
            style={styles.menuItem}
          >
            <View
              style={[styles.iconWrap, { backgroundColor: theme.backgroundElement }]}
            >
              <Ionicons name="help-circle-outline" size={18} color={theme.text} />
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={[styles.menuTitle, { color: theme.text }]}>Help & Support</Text>
              <Text style={[styles.menuSubtitle, { color: theme.textSecondary }]}>
                Operation manuals & escalations
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            logout();
            router.replace('/login');
          }}
          style={[
            styles.logoutBtn,
            {
              backgroundColor: theme.cardBackground,
              borderColor: theme.dangerBorder,
            },
          ]}
        >
          <Ionicons name="log-out-outline" size={18} color={theme.danger} />
          <Text style={[styles.logoutText, { color: theme.danger }]}>
            Sign Out
          </Text>
        </TouchableOpacity>

        <Text style={[styles.version, { color: theme.textMuted }]}>
          Admin Mode • 36Route v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.weights.bold,
    letterSpacing: -0.3,
  },
  scrollContent: {
    padding: Spacing.base,
    paddingBottom: Spacing.xxl,
  },
  profileCard: {
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: Typography.fontSizes.xxl,
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
    borderTopWidth: 1,
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    alignItems: 'center',
  },
  detailItem: {
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  detailLabel: {
    fontSize: Typography.fontSizes.xs,
  },
  detailValue: {
    fontSize: Typography.fontSizes.sm + 1,
    fontWeight: Typography.weights.semibold,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
    marginTop: Spacing.xs,
  },
  menuList: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
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
  menuActiveWrap: {
    opacity: 1,
  },
  menuTitle: {
    fontSize: Typography.fontSizes.sm + 1,
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
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 8,
  },
  logoutText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  version: {
    textAlign: 'center',
    fontSize: Typography.fontSizes.xs,
    marginTop: Spacing.lg,
  },
});
