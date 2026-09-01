import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../context/AppContext';
import { Typography, Shadows } from '../constants/theme';
import { AppInput } from '../components/ui/AppInput';
import { AppButton } from '../components/ui/AppButton';

export default function EditProfileScreen() {
  const router = useRouter();
  const { employee, themeColors } = useApp();

  const [name, setName] = useState(employee?.name || '');
  const [phone, setPhone] = useState(employee?.phone || '');
  const [pickup, setPickup] = useState(employee?.defaultPickup || '');
  const [drop, setDrop] = useState(employee?.defaultDrop || '');
  const [emergencyName, setEmergencyName] = useState(employee?.emergencyContact.name || '');
  const [emergencyPhone, setEmergencyPhone] = useState(employee?.emergencyContact.phone || '');
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Profile Saved', 'Your employee commuting profile has been updated.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }, 600);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={themeColors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: themeColors.text }]}>Edit Profile</Text>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border },
            Shadows.medium,
          ]}
        >
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Personal & Work Info
          </Text>

          <AppInput
            label="Full Name"
            value={name}
            onChangeText={setName}
            leftIcon={<Ionicons name="person-outline" size={20} color={themeColors.primary} />}
          />

          <AppInput
            label="Mobile Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            leftIcon={<Ionicons name="call-outline" size={20} color={themeColors.primary} />}
          />

          <AppInput
            label="Default Home Pickup Address"
            value={pickup}
            onChangeText={setPickup}
            multiline
            leftIcon={<Ionicons name="home-outline" size={20} color={themeColors.primary} />}
          />

          <AppInput
            label="Default Office Location"
            value={drop}
            onChangeText={setDrop}
            multiline
            leftIcon={<Ionicons name="business-outline" size={20} color={themeColors.primary} />}
          />

          <View style={[styles.divider, { borderTopColor: themeColors.border }]} />

          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Emergency Contact</Text>

          <AppInput
            label="Emergency Contact Name"
            value={emergencyName}
            onChangeText={setEmergencyName}
            leftIcon={<Ionicons name="people-outline" size={20} color={themeColors.danger} />}
          />

          <AppInput
            label="Emergency Contact Phone"
            value={emergencyPhone}
            onChangeText={setEmergencyPhone}
            keyboardType="phone-pad"
            leftIcon={<Ionicons name="call-outline" size={20} color={themeColors.danger} />}
          />

          <AppButton
            title="Save Profile Updates"
            onPress={handleSave}
            loading={loading}
            size="lg"
            style={{ marginTop: 12 }}
          />
        </View>
      </ScrollView>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backBtn: {
    marginRight: 12,
  },
  title: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.weights.bold as any,
  },
  card: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.bold as any,
    marginBottom: 14,
  },
  divider: {
    borderTopWidth: 1,
    marginVertical: 14,
  },
});
