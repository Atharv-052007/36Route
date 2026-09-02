import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../../context/AppContext';
import { Typography, BorderRadius, Shadows } from '../../constants/theme';
import { ConfirmationModal } from '../../components/ui/AppStates';

export default function ProfileScreen() {
  const router = useRouter();
  const { employee, isDarkMode, toggleDarkMode, logout, themeColors } = useApp();
  const [showLogout, setShowLogout] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const MenuItem = ({ icon, label, color, onPress }: { icon: string; label: string; color?: string; onPress: () => void }) => (
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

  return (
    <SafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }, Shadows.small]}>
          <View style={[styles.avatar, { backgroundColor: themeColors.secondary }]}>
            <Text style={styles.avatarText}>{employee?.name?.charAt(0) || 'U'}</Text>
          </View>
          <Text style={[styles.name, { color: themeColors.text }]}>{employee?.name}</Text>
          <Text style={[styles.empId, { color: themeColors.textSecondary }]}>{employee?.employeeId}</Text>
          {employee?.department && (
            <View style={[styles.deptBadge, { backgroundColor: themeColors.secondaryLight }]}>
              <Text style={[styles.deptText, { color: themeColors.secondary }]}>{employee.department}</Text>
            </View>
          )}
          <View style={styles.contactRow}>
            <Ionicons name="mail-outline" size={14} color={themeColors.textMuted} />
            <Text style={[styles.contactText, { color: themeColors.textSecondary }]}>{employee?.email}</Text>
          </View>
          <View style={styles.contactRow}>
            <Ionicons name="call-outline" size={14} color={themeColors.textMuted} />
            <Text style={[styles.contactText, { color: themeColors.textSecondary }]}>{employee?.phone}</Text>
          </View>
        </View>

        {/* Preferences */}
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Preferences</Text>
        <View style={[styles.menuCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
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
        </View>

        {/* Account & Support */}
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Account & Support</Text>
        <View style={[styles.menuCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
          <MenuItem icon="person-outline" label="Edit Profile" onPress={() => router.push('/edit-profile')} />
          <MenuItem icon="help-buoy-outline" label="Help & Support" onPress={() => router.push('/help')} />
          <MenuItem icon="alert-circle-outline" label="Emergency SOS Contacts" color={themeColors.danger} onPress={() => router.push('/sos')} />
        </View>

        {/* Sign Out */}
        <TouchableOpacity
          style={[styles.signOutBtn, { backgroundColor: themeColors.dangerLight }]}
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
    </SafeAreaView>
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
    marginBottom: 12,
  },
  deptText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.semibold as any,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  contactText: { fontSize: Typography.fontSizes.sm },
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
