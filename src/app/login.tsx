import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { AppSafeAreaView } from '@/components/ui/AppSafeAreaView';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { Typography, BorderRadius, Shadows, Spacing } from '@/constants/theme';
import { AppInput } from '@/components/ui/AppInput';
import { AppButton } from '@/components/ui/AppButton';

export default function LoginScreen() {
  const router = useRouter();
  const { login, themeColors } = useApp();
  const [authMode, setAuthMode] = useState<'otp' | 'password'>('otp');
  const [identifier, setIdentifier] = useState('');
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

  const handleDemoLogin = async () => {
    setIdentifier('aayush.sharma@corptech.com');
    setCode('123456');
    setError('');
    setLoading(true);
    try {
      await login('aayush.sharma@corptech.com', '123456');
      router.replace('/(tabs)');
    } catch (e: any) {
      setError(e.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppSafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Logo & Branding */}
          <View style={styles.brandingSection}>
            <View style={[styles.logoCircle, { backgroundColor: themeColors.primaryLight }]}>
              <Ionicons name="bus" size={36} color={themeColors.primary} />
            </View>
            <Text style={[styles.brandTitle, { color: themeColors.text }]}>36Route</Text>
            <Text style={[styles.brandSubtitle, { color: themeColors.textSecondary }]}>
              Corporate Commute Portal
            </Text>
          </View>

          {/* Login Card */}
          <View style={[styles.card, { backgroundColor: themeColors.cardBackground }, Shadows.card]}>
            {/* Auth Mode Toggle */}
            <View style={[styles.modeToggle, { backgroundColor: themeColors.backgroundElement }]}>
              <View
                style={[
                  styles.modeIndicator,
                  {
                    backgroundColor: themeColors.primary,
                    left: authMode === 'otp' ? 2 : '50%',
                  },
                ]}
              />
              {(['otp', 'password'] as const).map((mode) => (
                <View
                  key={mode}
                  style={[styles.modeBtn, authMode === mode && styles.modeBtnActive]}
                >
                  <Text
                    onPress={() => { setAuthMode(mode); setError(''); }}
                    style={[
                      styles.modeBtnText,
                      { color: authMode === mode ? '#FFFFFF' : themeColors.textSecondary },
                    ]}
                  >
                    {mode === 'otp' ? 'OTP' : 'Password'}
                  </Text>
                </View>
              ))}
            </View>

            {/* Error */}
            {error ? (
              <View style={[styles.errorBanner, { backgroundColor: themeColors.dangerLight }]}>
                <Ionicons name="alert-circle" size={16} color={themeColors.danger} />
                <Text style={[styles.errorText, { color: themeColors.danger }]}>{error}</Text>
              </View>
            ) : null}

            {/* Email / Employee ID */}
            <AppInput
              label="Email or Employee ID"
              placeholder="name@company.com"
              value={identifier}
              onChangeText={setIdentifier}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Ionicons name="mail-outline" size={18} color={themeColors.textMuted} />}
            />

            {/* Password / OTP */}
            <AppInput
              label={authMode === 'otp' ? 'Verification Code' : 'Password'}
              placeholder={authMode === 'otp' ? 'Enter 6-digit code' : 'Enter password'}
              value={code}
              onChangeText={setCode}
              keyboardType={authMode === 'otp' ? 'number-pad' : 'default'}
              secureTextEntry={authMode === 'password' && !showPassword}
              leftIcon={<Ionicons name="lock-closed-outline" size={18} color={themeColors.textMuted} />}
              rightIcon={
                authMode === 'password' ? (
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color={themeColors.textMuted}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                ) : undefined
              }
            />

            {/* Helper Row */}
            <View style={styles.helperRow}>
              <Text style={[styles.hintText, { color: themeColors.textMuted }]}>
                {authMode === 'otp' ? 'Code: 123456' : ''}
              </Text>
              <Text
                onPress={() => {}}
                style={[styles.forgotText, { color: themeColors.primary }]}
              >
                {authMode === 'otp' ? 'Resend OTP' : 'Forgot Password?'}
              </Text>
            </View>

            {/* Sign In Button */}
            <AppButton
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              size="lg"
            />

            {/* Demo Login */}
            <AppButton
              title="Quick Demo Login"
              onPress={handleDemoLogin}
              variant="outline"
              size="md"
              icon={<Ionicons name="flash-outline" size={16} color={themeColors.primary} />}
              style={{ marginTop: Spacing.sm }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  brandingSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl + 4,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  brandTitle: {
    fontSize: Typography.fontSizes.hero,
    fontWeight: Typography.weights.bold as any,
    letterSpacing: -1,
  },
  brandSubtitle: {
    fontSize: Typography.fontSizes.sm,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  modeToggle: {
    flexDirection: 'row',
    borderRadius: BorderRadius.sm,
    padding: 3,
    marginBottom: Spacing.md,
    position: 'relative',
    overflow: 'hidden',
  },
  modeIndicator: {
    position: 'absolute',
    top: 3,
    bottom: 3,
    width: '48%',
    borderRadius: BorderRadius.xs,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  modeBtnActive: {},
  modeBtnText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold as any,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.md,
    gap: 8,
  },
  errorText: {
    fontSize: Typography.fontSizes.sm,
    flex: 1,
  },
  helperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    marginTop: -Spacing.xs,
  },
  hintText: {
    fontSize: Typography.fontSizes.xs,
  },
  forgotText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.semibold as any,
  },
});
