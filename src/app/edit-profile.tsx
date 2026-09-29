import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { AppSafeAreaView } from '@/components/ui/AppSafeAreaView';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { Typography, BorderRadius, Shadows, Spacing } from '@/constants/theme';
import { Header } from '@/components/ui/Header';
import { AppInput } from '@/components/ui/AppInput';
import { AnimatedAppButton } from '@/components/ui/AnimatedAppButton';

export default function EditProfileScreen() {
  const router = useRouter();
  const { employee, themeColors } = useApp();
  const [name, setName] = useState(employee?.name || '');
  const [phone, setPhone] = useState(employee?.phone || '');
  const [pickup, setPickup] = useState(employee?.defaultPickup || '');
  const [drop, setDrop] = useState(employee?.defaultDrop || '');
  const [emergencyName, setEmergencyName] = useState(employee?.emergencyContact?.name || '');
  const [emergencyPhone, setEmergencyPhone] = useState(employee?.emergencyContact?.phone || '');
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Saved', 'Profile updated successfully');
      router.dismissTo('/(tabs)');
    }, 600);
  };

  return (
    <AppSafeAreaView style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <Header title="Edit Profile" showBack />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={[styles.avatarRing, { borderColor: themeColors.secondary }]}>
            <View style={[styles.avatar, { backgroundColor: themeColors.secondaryLight }]}>
              <Text style={[styles.avatarInitial, { color: themeColors.secondary }]}>
                {name.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={[styles.editOverlay, { backgroundColor: themeColors.secondary }]}>
            <Ionicons name="camera" size={14} color="#FFF" />
          </TouchableOpacity>
          <Text style={[styles.avatarLabel, { color: themeColors.textSecondary }]}>Tap to change photo</Text>
        </View>

        {/* Personal Info */}
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Personal Info</Text>
        <View style={[styles.formCard, { backgroundColor: themeColors.cardBackground }, Shadows.card]}>
          <AppInput
            label="Full Name"
            value={name}
            onChangeText={setName}
            leftIcon={<Ionicons name="person-outline" size={18} color={themeColors.textMuted} />}
          />
          <AppInput
            label="Phone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            leftIcon={<Ionicons name="call-outline" size={18} color={themeColors.textMuted} />}
          />
        </View>

        {/* Default Locations */}
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Default Locations</Text>
        <View style={[styles.formCard, { backgroundColor: themeColors.cardBackground }, Shadows.card]}>
          <AppInput
            label="Default Pickup"
            value={pickup}
            onChangeText={setPickup}
            leftIcon={<Ionicons name="location-outline" size={18} color={themeColors.accent} />}
          />
          <AppInput
            label="Default Drop"
            value={drop}
            onChangeText={setDrop}
            leftIcon={<Ionicons name="location" size={18} color={themeColors.secondary} />}
          />
        </View>

        {/* Emergency Contact */}
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Emergency Contact</Text>
        <View style={[styles.formCard, { backgroundColor: themeColors.cardBackground }, Shadows.card]}>
          <AppInput
            label="Contact Name"
            value={emergencyName}
            onChangeText={setEmergencyName}
            leftIcon={<Ionicons name="person-outline" size={18} color={themeColors.danger} />}
          />
          <AppInput
            label="Contact Phone"
            value={emergencyPhone}
            onChangeText={setEmergencyPhone}
            keyboardType="phone-pad"
            leftIcon={<Ionicons name="call-outline" size={18} color={themeColors.danger} />}
          />
        </View>

        <View style={{ marginTop: 4 }}>
          <AnimatedAppButton title="Save Changes" onPress={handleSave} loading={loading} size="lg" />
        </View>
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: Spacing.base, paddingBottom: 40 },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 8,
  },
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    padding: 4,
    marginBottom: 8,
  },
  avatar: {
    flex: 1,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: Typography.fontSizes.hero,
    fontWeight: Typography.weights.bold as any,
  },
  editOverlay: {
    position: 'absolute',
    top: 20,
    right: '35%',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  avatarLabel: {
    fontSize: Typography.fontSizes.xs,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.bold as any,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 10,
    marginTop: 4,
  },
  formCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    padding: 16,
    marginBottom: 16,
  },
});
