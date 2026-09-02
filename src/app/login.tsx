import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { AppSafeAreaView } from '@/components/ui/AppSafeAreaView';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { Typography, BorderRadius } from '@/constants/theme';
import { AppInput } from '@/components/ui/AppInput';
import { AppButton } from '@/components/ui/AppButton';

export default function LoginScreen() {
  const router = useRouter();
  const { login, themeColors } = useApp();
  const [authMode, setAuthMode] = useState<'otp' | 'password'>('otp');
  const [identifier, setIdentifier] = useState('aayush.sharma@corptech.com');
  const [code, setCode] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!identifier.trim()) {
      setError('Please enter your email or employee ID');
      return;
    }
    if (!code.trim()) {
      setError(authMode === 'otp' ? 'Please enter the OTP' : 'Please enter your password');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(identifier, code);
      router.replace('/(tabs)');
    } catch (e: any) {
      setError(e.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppSafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: themeColors.primary }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.logoCircle, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
            <Ionicons name="bus" size={32} color="#FFFFFF" />
          </View>
          <Text style={styles.brand}>36Route</Text>
          <Text style={styles.tagline}>Your route. Your ride. Your safety.</Text>
        </View>

        {/* Login Card */}
        <View style={[styles.card, { backgroundColor: themeColors.cardBackground }]}>
          <Text style={[styles.cardTitle, { color: themeColors.text }]}>Welcome back</Text>
          <Text style={[styles.cardSubtitle, { color: themeColors.textSecondary }]}>
            Sign in to continue
          </Text>

          {/* Auth Mode Toggle */}
          <View style={[styles.modeToggle, { backgroundColor: themeColors.backgroundElement }]}>
            <TouchableOpacity
              onPress={() => setAuthMode('otp')}
              style={[
                styles.modeBtn,
                authMode === 'otp' && { backgroundColor: themeColors.secondary },
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.modeBtnText,
                  { color: authMode === 'otp' ? '#FFFFFF' : themeColors.textSecondary },
                ]}
              >
                OTP Sign In
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setAuthMode('password')}
              style={[
                styles.modeBtn,
                authMode === 'password' && { backgroundColor: themeColors.secondary },
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.modeBtnText,
                  { color: authMode === 'password' ? '#FFFFFF' : themeColors.textSecondary },
                ]}
              >
                Password
              </Text>
            </TouchableOpacity>
          </View>

          {error ? (
            <View style={[styles.errorBanner, { backgroundColor: themeColors.dangerLight }]}>
              <Ionicons name="alert-circle" size={16} color={themeColors.danger} />
              <Text style={[styles.errorText, { color: themeColors.danger }]}>{error}</Text>
            </View>
          ) : null}

          <AppInput
            label="Email or Employee ID"
            placeholder="you@company.com"
            value={identifier}
            onChangeText={setIdentifier}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Ionicons name="mail-outline" size={18} color={themeColors.textMuted} />}
          />

          <AppInput
            label={authMode === 'otp' ? 'Enter OTP' : 'Password'}
            placeholder={authMode === 'otp' ? '6-digit OTP' : 'Enter password'}
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            secureTextEntry={authMode === 'password'}
            leftIcon={<Ionicons name="key-outline" size={18} color={themeColors.textMuted} />}
          />

          <TouchableOpacity style={styles.forgotBtn} activeOpacity={0.7}>
            <Text style={[styles.forgotText, { color: themeColors.secondary }]}>
              Forgot {authMode === 'otp' ? 'OTP' : 'Password'}?
            </Text>
          </TouchableOpacity>

          <AppButton
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            size="lg"
          />
        </View>
      </KeyboardAvoidingView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 32,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  brand: {
    color: '#FFFFFF',
    fontSize: Typography.fontSizes.hero,
    fontWeight: Typography.weights.bold as any,
    letterSpacing: -0.5,
  },
  tagline: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: Typography.fontSizes.sm,
    marginTop: 4,
  },
  card: {
    flex: 1,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: 24,
    paddingTop: 32,
  },
  cardTitle: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.weights.bold as any,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: Typography.fontSizes.md,
    marginBottom: 24,
  },
  modeToggle: {
    flexDirection: 'row',
    borderRadius: BorderRadius.md,
    padding: 4,
    marginBottom: 20,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  modeBtnText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold as any,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: BorderRadius.sm,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    fontSize: Typography.fontSizes.sm,
    flex: 1,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.medium as any,
  },
});
