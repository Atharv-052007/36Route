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
import { useApp } from '../../context/AppContext';
import { Typography, BorderRadius, Spacing, Shadows } from '../../constants/theme';

const MenuItemRow = ({
  icon,
  label,
  color,
  onPress,
}: {
  icon: string;
  label: string;
  color?: string;
  onPress: () => void;
}) => {
  const { themeColors } = useApp();
  return (
    <TouchableOpacity
      style={[styles.menuItem, { borderBottomColor: themeColors.borderLight }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons name={icon as any} size={20} color={color || themeColors.textSecondary} />
      <Text style={[styles.menuLabel, { color: color || themeColors.text }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color={themeColors.textMuted} />
    </TouchableOpacity>
  );
};

export default function DriverProfileScreen() {
  const router = useRouter();
  const { employee, isDarkMode, toggleDarkMode, themeColors } = useApp();

  const switchMode = (mode: 'driver' | 'admin' | 'user' | 'superadmin') => {
    if (mode === 'user') {
      router.dismissAll();
      router.replace('/(tabs)' as any);
    } else if (mode === 'driver') {
      router.replace('/(driver)' as any);
    } else if (mode === 'admin') {
      router.push('/(admin)' as any);
    }
  };

  return (
    <AppSafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }, Shadows.card]}>
          <View style={[styles.avatar, { backgroundColor: themeColors.secondary, borderWidth: 3, borderColor: themeColors.secondaryLight }]}>
            <Text style={styles.avatarText}>{employee?.name?.charAt(0) || 'D'}</Text>
          </View>
          <Text style={[styles.name, { color: themeColors.text }]}>{employee?.name || 'Driver'}</Text>
          <Text style={[styles.role, { color: themeColors.secondary }]}>Driver</Text>
          {employee?.department && (
            <View style={[styles.deptBadge, { backgroundColor: themeColors.secondaryLight }]}>
              <Text style={[styles.deptText, { color: themeColors.secondary }]}>{employee.department}</Text>
            </View>
          )}
          {employee?.employeeId && (
            <View style={[styles.idBadge, { backgroundColor: themeColors.backgroundElement }]}>
              <Text style={[styles.idText, { color: themeColors.textMuted }]}>{employee.employeeId}</Text>
            </View>
          )}
          <View style={[styles.statusPill, { backgroundColor: themeColors.accentLight }]}>
            <Ionicons name="ellipse" size={10} color={themeColors.accent} />
            <Text style={[styles.statusText, { color: themeColors.accent }]}>On Duty</Text>
          </View>
        </View>

        {/* Switch Role */}
        <Text style={[styles.sectionTitle, { color: themeColors.textMuted }]}>SWITCH ROLE</Text>
        <View style={[styles.menuCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }, Shadows.subtle]}>
          <MenuItemRow icon="car-outline" label="Driver Mode" color={themeColors.secondary} onPress={() => switchMode('driver')} />
          <MenuItemRow icon="shield-checkmark-outline" label="Admin Mode" onPress={() => switchMode('admin')} />
          <MenuItemRow icon="person-outline" label="User Mode" onPress={() => switchMode('user')} />
          <MenuItemRow icon="flash-outline" label="Super Admin Mode" color={themeColors.danger} onPress={() => switchMode('superadmin')} />
        </View>

        {/* Driver Account */}
        <Text style={[styles.sectionTitle, { color: themeColors.textMuted }]}>DRIVER ACCOUNT</Text>
        <View style={[styles.menuCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }, Shadows.subtle]}>
          <MenuItemRow icon="calendar-outline" label="My Trips" onPress={() => router.push('/(driver)/trips')} />
          <View style={[styles.menuItem, { borderBottomColor: themeColors.borderLight }]}>
            <Ionicons name="moon-outline" size={20} color={themeColors.textSecondary} />
            <Text style={[styles.menuLabel, { color: themeColors.text }]}>Dark Mode</Text>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: themeColors.border, true: themeColors.secondaryLight }}
              thumbColor={isDarkMode ? themeColors.secondary : themeColors.textMuted}
            />
          </View>
          <MenuItemRow icon="settings-outline" label="Settings" onPress={() => router.push('/help')} />
          <MenuItemRow icon="alert-circle-outline" label="Emergency SOS" color={themeColors.danger} onPress={() => router.push('/sos')} />
        </View>

        {/* Exit Driver Mode */}
        <TouchableOpacity
          style={[styles.signOutBtn, { backgroundColor: themeColors.dangerLight, borderColor: themeColors.dangerBorder }]}
          onPress={() => switchMode('user')}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back-circle-outline" size={20} color={themeColors.danger} />
          <Text style={[styles.signOutText, { color: themeColors.danger }]}>Exit Driver Mode</Text>
        </TouchableOpacity>

        <Text style={[styles.version, { color: themeColors.textMuted }]}>Driver Mode · 36Route v1.0.0</Text>
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: Spacing.base, paddingBottom: Spacing.xxl },
  profileCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: {
    color: '#FFF',
    fontSize: Typography.fontSizes.hero,
    fontWeight: Typography.weights.bold,
  },
  name: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.weights.bold,
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  role: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold,
    marginBottom: Spacing.sm,
  },
  deptBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.sm,
  },
  deptText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.semibold,
  },
  idBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.sm,
  },
  idText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.semibold,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    gap: 6,
  },
  statusText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.semibold,
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
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    gap: Spacing.md,
  },
  menuLabel: {
    flex: 1,
    fontSize: Typography.fontSizes.md,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  signOutText: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.semibold,
  },
  version: {
    textAlign: 'center',
    fontSize: Typography.fontSizes.xs,
    marginTop: Spacing.xl,
    marginBottom: Spacing.xs,
  },
});
