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
import { Typography, BorderRadius } from '@/constants/theme';
import { AppInput } from '@/components/ui/AppInput';
import { AnimatedAppButton } from '@/components/ui/AnimatedAppButton';
import Animated, {
  FadeInUp,
  FadeInDown,
  SlideInRight,
  FadeIn,
} from 'react-native-reanimated';

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
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <TouchableOpacity
            onPress={() => router.dismissTo('/(tabs)')}
            style={[styles.backBtn, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}
          >
            <Ionicons name="arrow-back" size={20} color={themeColors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: themeColors.text }]}>Edit Profile</Text>
          <View style={{ width: 40 }} />
        </Animated.View>

        {/* Personal Info */}
        <Animated.View entering={FadeInUp.delay(150).duration(400)}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Personal & Work Info</Text>
          <View style={[styles.formCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
            <AppInput label="Full Name" value={name} onChangeText={setName} leftIcon={<Ionicons name="person-outline" size={18} color={themeColors.textMuted} />} />
            <AppInput label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" leftIcon={<Ionicons name="call-outline" size={18} color={themeColors.textMuted} />} />
            <AppInput label="Default Pickup" value={pickup} onChangeText={setPickup} leftIcon={<Ionicons name="location-outline" size={18} color={themeColors.accent} />} />
            <AppInput label="Default Drop" value={drop} onChangeText={setDrop} leftIcon={<Ionicons name="location" size={18} color={themeColors.secondary} />} />
          </View>
        </Animated.View>

        {/* Emergency Contact */}
        <Animated.View entering={SlideInRight.delay(300).duration(400).springify()}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Emergency Contact</Text>
          <View style={[styles.formCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
            <AppInput label="Contact Name" value={emergencyName} onChangeText={setEmergencyName} leftIcon={<Ionicons name="person-outline" size={18} color={themeColors.danger} />} />
            <AppInput label="Contact Phone" value={emergencyPhone} onChangeText={setEmergencyPhone} keyboardType="phone-pad" leftIcon={<Ionicons name="call-outline" size={18} color={themeColors.danger} />} />
          </View>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(450).duration(400)}>
          <AnimatedAppButton title="Save Changes" onPress={handleSave} loading={loading} size="lg" />
        </Animated.View>
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 18, paddingBottom: 40 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20, borderWidth: 1,
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.fontSizes.lg, fontWeight: Typography.weights.bold as any,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.sm, fontWeight: Typography.weights.semibold as any,
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, marginTop: 8,
  },
  formCard: {
    borderRadius: BorderRadius.md, borderWidth: 1, padding: 16, marginBottom: 16,
  },
});
