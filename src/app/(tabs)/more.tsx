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

export default function MoreScreen() {
  const router = useRouter();
  const { user, logout, isDarkMode, toggleDarkMode } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const menuItems = [
    {
      id: 'vehicles',
      title: 'Vehicles',
      subtitle: 'Fleet status, capacity & maintenance',
      icon: 'car-sport-outline',
      onPress: () => router.push('/vehicles'),
    },
    {
      id: 'routes',
      title: 'Routes',
      subtitle: 'Waypoint stops & scheduled routes',
      icon: 'git-branch-outline',
      onPress: () => router.push('/routes'),
    },
    {
      id: 'reports',
      title: 'Reports',
      subtitle: 'Operational KPIs, utilization & metrics',
      icon: 'bar-chart-outline',
      onPress: () => router.push('/reports'),
    },
    {
      id: 'settings',
      title: 'Settings',
      subtitle: 'Supervisor preferences & alert thresholds',
      icon: 'settings-outline',
      onPress: () => router.push('/settings'),
    },
    {
      id: 'help',
      title: 'Help & Operations Protocol',
      subtitle: 'Dispatch manuals & emergency escalations',
      icon: 'help-circle-outline',
      onPress: () => router.push('/help'),
    },
    {
      id: 'about',
      title: 'About 36Route',
      subtitle: 'Version 1.0.0 (Build 42) • Pune Hub',
      icon: 'information-circle-outline',
      onPress: () => {},
    },
  ];

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
        <Text style={[styles.headerTitle, { color: theme.text }]}>More</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Supervisor Profile Card */}
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
          <View style={styles.profileInfo}>
            <Text style={[styles.userName, { color: theme.text }]}>
              {user?.name || 'Govind'}
            </Text>
            <Text style={[styles.userRole, { color: theme.accent }]}>
              {user?.role || 'Operations Lead'}
            </Text>
            <Text style={[styles.userHub, { color: theme.textSecondary }]}>
              {user?.hub || 'Pune Operations Hub'}
            </Text>
          </View>
        </View>

        {/* Quick Theme Toggle Row */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={toggleDarkMode}
          style={[
            styles.themeToggleCard,
            {
              backgroundColor: theme.cardBackground,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={styles.menuLeft}>
            <View
              style={[
                styles.iconWrap,
                { backgroundColor: theme.backgroundElement },
              ]}
            >
              <Ionicons
                name={isDarkMode ? 'sunny-outline' : 'moon-outline'}
                size={18}
                color={theme.text}
              />
            </View>
            <View>
              <Text style={[styles.menuTitle, { color: theme.text }]}>
                {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              </Text>
              <Text style={[styles.menuSubtitle, { color: theme.textSecondary }]}>
                {isDarkMode ? 'Clean daylight palette' : 'Calm low-light operational mode'}
              </Text>
            </View>
          </View>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={theme.textMuted}
          />
        </TouchableOpacity>

        {/* Navigation List */}
        <View
          style={[
            styles.menuList,
            {
              backgroundColor: theme.cardBackground,
              borderColor: theme.border,
            },
          ]}
        >
          {menuItems.map((item, index) => {
            const isLast = index === menuItems.length - 1;
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.7}
                onPress={item.onPress}
                style={[
                  styles.menuItem,
                  !isLast && {
                    borderBottomWidth: 1,
                    borderBottomColor: theme.border,
                  },
                ]}
              >
                <View style={styles.menuLeft}>
                  <View
                    style={[
                      styles.iconWrap,
                      { backgroundColor: theme.backgroundElement },
                    ]}
                  >
                    <Ionicons
                      name={item.icon as any}
                      size={18}
                      color={theme.text}
                    />
                  </View>
                  <View style={styles.menuTextWrap}>
                    <Text style={[styles.menuTitle, { color: theme.text }]}>
                      {item.title}
                    </Text>
                    <Text
                      style={[styles.menuSubtitle, { color: theme.textSecondary }]}
                    >
                      {item.subtitle}
                    </Text>
                  </View>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={theme.textMuted}
                />
              </TouchableOpacity>
            );
          })}
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.weights.bold,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: Typography.fontSizes.base,
    fontWeight: Typography.weights.bold,
  },
  userRole: {
    fontSize: Typography.fontSizes.xs + 1,
    fontWeight: Typography.weights.semibold,
    marginTop: 1,
  },
  userHub: {
    fontSize: Typography.fontSizes.xs,
    marginTop: 2,
  },
  themeToggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  menuList: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
    ...Shadows.subtle,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.md,
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
  },
  menuTitle: {
    fontSize: Typography.fontSizes.sm + 1,
    fontWeight: Typography.weights.semibold,
  },
  menuSubtitle: {
    fontSize: Typography.fontSizes.xs,
    marginTop: 2,
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
});
