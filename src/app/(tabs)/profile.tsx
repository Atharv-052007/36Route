import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../../context/AppContext';
import { Typography, Shadows } from '../../constants/theme';
import { AppButton } from '../../components/ui/AppButton';
import { ConfirmationModal } from '../../components/ui/AppStates';

export default function ProfileScreen() {
  const router = useRouter();
  const { employee, logout, isDarkMode, toggleDarkMode, themeColors } = useApp();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = async () => {
    setShowLogoutModal(false);
    await logout();
    router.replace('/login');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Profile Card Header */}
        <View
          style={[
            styles.profileCard,
            { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border },
            Shadows.medium,
          ]}
        >
          <Image
            source={{ uri: employee?.avatarUrl || 'https://via.placeholder.com/150' }}
            style={styles.avatar}
          />
          <Text style={[styles.name, { color: themeColors.text }]}>{employee?.name}</Text>
          <Text style={[styles.empId, { color: themeColors.primary }]}>
            {employee?.employeeId}
          </Text>

          <View style={[styles.deptPill, { backgroundColor: themeColors.primaryLight }]}>
            <Ionicons name="briefcase-outline" size={14} color={themeColors.primary} />
            <Text style={[styles.deptText, { color: themeColors.primary }]}>
              {employee?.department}
            </Text>
          </View>

          <View style={[styles.infoDivider, { borderTopColor: themeColors.border }]} />

          {/* Details list */}
          <View style={styles.detailRow}>
            <Ionicons name="mail-outline" size={18} color={themeColors.textSecondary} />
            <Text style={[styles.detailText, { color: themeColors.text }]}>
              {employee?.email}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="call-outline" size={18} color={themeColors.textSecondary} />
            <Text style={[styles.detailText, { color: themeColors.text }]}>
              {employee?.phone}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="business-outline" size={18} color={themeColors.textSecondary} />
            <Text style={[styles.detailText, { color: themeColors.text }]} numberOfLines={1}>
              {employee?.officeLocation}
            </Text>
          </View>
        </View>

        {/* Preferences Section */}
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>App Preferences</Text>
        <View
          style={[
            styles.menuCard,
            { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border },
          ]}
        >
          <View style={[styles.menuItem, { borderBottomColor: themeColors.border }]}>
            <View style={styles.menuLeft}>
              <Ionicons name="moon-outline" size={20} color={themeColors.primary} />
              <Text style={[styles.menuLabel, { color: themeColors.text }]}>Dark Mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#CBD5E1', true: themeColors.primary }}
            />
          </View>

          <View style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="notifications-outline" size={20} color={themeColors.primary} />
              <Text style={[styles.menuLabel, { color: themeColors.text }]}>
                Commute Notifications
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#CBD5E1', true: themeColors.primary }}
            />
          </View>
        </View>

        {/* Actions & Support Menu */}
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Account & Support</Text>
        <View
          style={[
            styles.menuCard,
            { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border },
          ]}
        >
          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: themeColors.border }]}
            onPress={() => router.push('/edit-profile')}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="person-outline" size={20} color={themeColors.primary} />
              <Text style={[styles.menuLabel, { color: themeColors.text }]}>Edit Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={themeColors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: themeColors.border }]}
            onPress={() => router.push('/help')}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="help-circle-outline" size={20} color={themeColors.primary} />
              <Text style={[styles.menuLabel, { color: themeColors.text }]}>Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={themeColors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/sos')}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="shield-checkmark-outline" size={20} color={themeColors.danger} />
              <Text style={[styles.menuLabel, { color: themeColors.danger }]}>
                Emergency SOS Contacts
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={themeColors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <AppButton
          title="Sign Out of 36Route"
          onPress={() => setShowLogoutModal(true)}
          variant="outline"
          textStyle={{ color: themeColors.danger }}
          style={{ borderColor: themeColors.dangerLight, marginTop: 24 }}
        />

        <Text style={[styles.versionText, { color: themeColors.textMuted }]}>
          36Route v1.0.0 (Expo React Native Engine)
        </Text>
      </ScrollView>

      {/* Logout Modal */}
      <ConfirmationModal
        visible={showLogoutModal}
        title="Sign Out"
        message="Are you sure you want to sign out of 36Route?"
        confirmText="Sign Out"
        cancelText="Cancel"
        isDanger
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    padding: 18,
    paddingBottom: 40,
  },
  profileCard: {
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  name: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.weights.bold as any,
  },
  empId: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.bold as any,
    marginTop: 2,
  },
  deptPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  deptText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.semibold as any,
    marginLeft: 6,
  },
  infoDivider: {
    width: '100%',
    borderTopWidth: 1,
    marginVertical: 14,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 4,
  },
  detailText: {
    fontSize: Typography.fontSizes.sm,
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.bold as any,
    marginBottom: 10,
    marginLeft: 4,
  },
  menuCard: {
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 18,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderBottomWidth: 1,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.medium as any,
    marginLeft: 12,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 11,
    marginTop: 16,
  },
});
