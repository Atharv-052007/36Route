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
import { ConfirmationModal } from '../../components/ui/AppStates';

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

export default function ProfileScreen() {
  const router = useRouter();
  const { employee, isDarkMode, toggleDarkMode, logout, themeColors } = useApp();
  const [showLogout, setShowLogout] = React.useState(false);

  const handleLogout = async () => {
    setShowLogout(false);
    await logout();
    router.replace('/login');
  };

  return (
    <AppSafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }, Shadows.card]}>
          <View style={[styles.avatar, { backgroundColor: themeColors.primary, borderWidth: 3, borderColor: themeColors.primaryLight }]}>
            <Text style={styles.avatarText}>{employee?.name?.charAt(0) || 'U'}</Text>
          </View>
          <Text style={[styles.name, { color: themeColors.text }]}>{employee?.name || 'User'}</Text>
          <Text style={[styles.role, { color: themeColors.textSecondary }]}>{employee?.department || 'Employee'}</Text>
          {employee?.employeeId && (
            <View style={[styles.idBadge, { backgroundColor: themeColors.backgroundElement }]}>
              <Text style={[styles.idText, { color: themeColors.textMuted }]}>{employee.employeeId}</Text>
            </View>
          )}
          <View style={[styles.contactRow, { borderTopColor: themeColors.borderLight }]}>
            <Ionicons name="mail-outline" size={14} color={themeColors.textMuted} />
            <Text style={[styles.contactText, { color: themeColors.textSecondary }]}>{employee?.email}</Text>
          </View>
          <View style={styles.contactRow}>
            <Ionicons name="call-outline" size={14} color={themeColors.textMuted} />
            <Text style={[styles.contactText, { color: themeColors.textSecondary }]}>{employee?.phone}</Text>
          </View>
        </View>

        {/* Preferences */}
        <Text style={[styles.sectionTitle, { color: themeColors.textMuted }]}>PREFERENCES</Text>
        <View style={[styles.menuCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }, Shadows.subtle]}>
          <View style={[styles.menuItem, { borderBottomColor: themeColors.borderLight }]}>
            <Ionicons name={isDarkMode ? 'sunny-outline' : 'moon-outline'} size={20} color={themeColors.textSecondary} />
            <Text style={[styles.menuLabel, { color: themeColors.text }]}>Dark Mode</Text>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: themeColors.border, true: themeColors.secondaryLight }}
              thumbColor={isDarkMode ? themeColors.secondary : themeColors.textMuted}
            />
          </View>
        </View>

        {/* Mode Selection */}
        <Text style={[styles.sectionTitle, { color: themeColors.textMuted }]}>MODE</Text>
        <View style={[styles.menuCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }, Shadows.subtle]}>
          <MenuItemRow icon="car-outline" label="Driver Mode" onPress={() => router.push('/(driver)' as any)} />
          <MenuItemRow icon="shield-checkmark-outline" label="Admin Mode" onPress={() => router.push('/(admin)' as any)} />
          <MenuItemRow icon="person-outline" label="User Mode" color={themeColors.secondary} onPress={() => {}} />
          <MenuItemRow icon="flash-outline" label="Super Admin Mode" color={themeColors.danger} onPress={() => {}} />
        </View>

        {/* Account & Support */}
        <Text style={[styles.sectionTitle, { color: themeColors.textMuted }]}>ACCOUNT</Text>
        <View style={[styles.menuCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }, Shadows.subtle]}>
          <MenuItemRow icon="person-outline" label="Edit Profile" onPress={() => router.push('/edit-profile')} />
          <MenuItemRow icon="help-buoy-outline" label="Help & Support" onPress={() => router.push('/help')} />
          <MenuItemRow icon="alert-circle-outline" label="Emergency SOS Contacts" color={themeColors.danger} onPress={() => router.push('/sos')} />
        </View>

        {/* Sign Out */}
        <TouchableOpacity
          style={[styles.signOutBtn, { backgroundColor: themeColors.dangerLight, borderColor: themeColors.dangerBorder }]}
          onPress={() => setShowLogout(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={20} color={themeColors.danger} />
          <Text style={[styles.signOutText, { color: themeColors.danger }]}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={[styles.version, { color: themeColors.textMuted }]}>36Route v1.0.0</Text>
      </ScrollView>

      <ConfirmationModal
        visible={showLogout}
        title="Sign Out"
        message="Are you sure you want to sign out?"
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
    fontWeight: Typography.weights.medium,
    marginBottom: Spacing.sm,
  },
  idBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.md,
  },
  idText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.semibold,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: Spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E2E8F0',
  },
  contactText: { fontSize: Typography.fontSizes.sm },
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
