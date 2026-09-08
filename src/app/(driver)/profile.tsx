import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { AppSafeAreaView } from '@/components/ui/AppSafeAreaView';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../../context/AppContext';
import { Typography, BorderRadius, Shadows } from '../../constants/theme';

const MenuItem = ({ icon, label, color, onPress, index }: { icon: string; label: string; color?: string; onPress: () => void; index: number }) => {
  const { themeColors } = useApp();
  return (
    <View>
      <TouchableOpacity
        style={[styles.menuItem, { borderBottomColor: themeColors.borderLight }]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Ionicons name={icon as any} size={20} color={color || themeColors.textSecondary} />
        <Text style={[styles.menuLabel, { color: color || themeColors.text }]}>{label}</Text>
        <Ionicons name="chevron-forward" size={16} color={themeColors.textMuted} />
      </TouchableOpacity>
    </View>
  );
};

export default function DriverProfileScreen() {
  const router = useRouter();
  const { employee, themeColors } = useApp();

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
        <View style={[styles.profileCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }, Shadows.small]}>
          <View style={[styles.avatar, { backgroundColor: themeColors.secondary }]}>
            <Text style={styles.avatarText}>{employee?.name?.charAt(0) || 'D'}</Text>
          </View>
          <Text style={[styles.name, { color: themeColors.text }]}>{employee?.name || 'Driver'}</Text>
          <Text style={[styles.empId, { color: themeColors.textSecondary }]}>{employee?.employeeId || 'DRV-001'}</Text>
          {employee?.department && (
            <View style={[styles.deptBadge, { backgroundColor: themeColors.secondaryLight }]}>
              <Text style={[styles.deptText, { color: themeColors.secondary }]}>{employee.department}</Text>
            </View>
          )}
          <View style={[styles.statusPill, { backgroundColor: themeColors.accentLight }]}>
            <Ionicons name="ellipse" size={10} color={themeColors.accent} />
            <Text style={[styles.statusText, { color: themeColors.accent }]}>On Duty</Text>
          </View>
        </View>

        {/* Switch Role - Mode Selection */}
        <View>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Switch Role</Text>
          <View style={[styles.menuCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
            <MenuItem icon="car-outline" label="Driver Mode" color={themeColors.secondary} onPress={() => switchMode('driver')} index={0} />
            <MenuItem icon="shield-checkmark-outline" label="Admin Mode" onPress={() => switchMode('admin')} index={1} />
            <MenuItem icon="person-outline" label="User Mode" color={themeColors.textSecondary} onPress={() => switchMode('user')} index={2} />
            <MenuItem icon="flash-outline" label="Super Admin Mode" color={themeColors.danger} onPress={() => switchMode('superadmin')} index={3} />
          </View>
        </View>

        {/* Driver Account */}
        <View>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Driver Account</Text>
          <View style={[styles.menuCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
            <MenuItem icon="calendar-outline" label="My Trips" onPress={() => router.push('/(driver)/trips')} index={0} />
            <MenuItem icon="settings-outline" label="Settings" onPress={() => router.push('/help')} index={1} />
            <MenuItem icon="alert-circle-outline" label="Emergency SOS" color={themeColors.danger} onPress={() => router.push('/sos')} index={2} />
          </View>
        </View>

        {/* Exit Driver Mode */}
        <View>
          <TouchableOpacity
            style={[styles.signOutBtn, { backgroundColor: themeColors.dangerLight }]}
            onPress={() => switchMode('user')}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back-circle-outline" size={20} color={themeColors.danger} />
            <Text style={[styles.signOutText, { color: themeColors.danger }]}>Exit Driver Mode</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.version, { color: themeColors.textMuted }]}>Driver Mode • 36Route v1.0.0</Text>
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 18, paddingBottom: 40 },
  profileCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#FFF',
    fontSize: Typography.fontSizes.xxl,
    fontWeight: Typography.weights.bold as any,
  },
  name: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.weights.bold as any,
    marginBottom: 4,
  },
  empId: { fontSize: Typography.fontSizes.sm, marginBottom: 8 },
  deptBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    marginBottom: 10,
  },
  deptText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.semibold as any,
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
    fontWeight: Typography.weights.semibold as any,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold as any,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 4,
  },
  menuCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: Typography.fontSizes.md,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: BorderRadius.md,
    gap: 8,
    marginTop: 8,
  },
  signOutText: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.semibold as any,
  },
  version: {
    textAlign: 'center',
    fontSize: Typography.fontSizes.xs,
    marginTop: 20,
  },
});
