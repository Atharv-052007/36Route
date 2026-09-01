import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../context/AppContext';
import { AppInput } from '../components/ui/AppInput';
import { AppButton } from '../components/ui/AppButton';
import { Typography, Shadows } from '../constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const { login, themeColors } = useApp();

  const [authMode, setAuthMode] = useState<'PASSWORD' | 'OTP'>('OTP');
  const [identifier, setIdentifier] = useState('ananya.sharma@corptech.com');
  const [passOrOtp, setPassOrOtp] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    if (!identifier) {
      setError('Please enter your mobile number or corporate email');
      return;
    }
    if (!passOrOtp) {
      setError('Please enter password or OTP');
      return;
    }

    try {
      setLoading(true);
      await login(identifier, passOrOtp);
      router.replace('/(tabs)' as any);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          {/* Header Brand Badge */}
          <View style={styles.header}>
            <View style={[styles.logoContainer, { backgroundColor: themeColors.primary }, Shadows.medium]}>
              <Ionicons name="bus-outline" size={36} color="#FFFFFF" />
            </View>
            <Text style={[styles.brandTitle, { color: themeColors.text }]}>36Route</Text>
            <Text style={[styles.brandSubtitle, { color: themeColors.textSecondary }]}>
              Corporate Commute & Mobility Engine
            </Text>
          </View>

          {/* Form Box */}
          <View
            style={[
              styles.card,
              { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border },
              Shadows.large,
            ]}
          >
            <Text style={[styles.welcomeTitle, { color: themeColors.text }]}>Welcome Back</Text>
            <Text style={[styles.welcomeSub, { color: themeColors.textSecondary }]}>
              Sign in with your company credentials
            </Text>

            {/* Auth Mode Toggle */}
            <View style={[styles.toggleContainer, { backgroundColor: themeColors.borderLight }]}>
              <TouchableOpacity
                style={[
                  styles.toggleTab,
                  authMode === 'OTP' && { backgroundColor: themeColors.cardBackground },
                ]}
                onPress={() => setAuthMode('OTP')}
              >
                <Text
                  style={[
                    styles.toggleText,
                    { color: authMode === 'OTP' ? themeColors.primary : themeColors.textSecondary },
                  ]}
                >
                  OTP Sign In
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleTab,
                  authMode === 'PASSWORD' && { backgroundColor: themeColors.cardBackground },
                ]}
                onPress={() => setAuthMode('PASSWORD')}
              >
                <Text
                  style={[
                    styles.toggleText,
                    {
                      color:
                        authMode === 'PASSWORD' ? themeColors.primary : themeColors.textSecondary,
                    },
                  ]}
                >
                  Password
                </Text>
              </TouchableOpacity>
            </View>

            {/* Error banner */}
            {error ? (
              <View style={[styles.errorBanner, { backgroundColor: themeColors.dangerLight }]}>
                <Ionicons name="alert-circle" size={16} color={themeColors.danger} />
                <Text style={[styles.errorText, { color: themeColors.danger }]}>{error}</Text>
              </View>
            ) : null}

            <AppInput
              label="Corporate Email or Mobile"
              placeholder="e.g. employee@company.com"
              value={identifier}
              onChangeText={setIdentifier}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Ionicons name="mail-outline" size={20} color={themeColors.textMuted} />}
            />

            <AppInput
              label={authMode === 'OTP' ? 'Enter 6-digit OTP' : 'Password'}
              placeholder={authMode === 'OTP' ? '1 2 3 4 5 6' : '••••••••'}
              value={passOrOtp}
              onChangeText={setPassOrOtp}
              secureTextEntry={authMode === 'PASSWORD'}
              keyboardType={authMode === 'OTP' ? 'number-pad' : 'default'}
              leftIcon={
                <Ionicons
                  name={authMode === 'OTP' ? 'key-outline' : 'lock-closed-outline'}
                  size={20}
                  color={themeColors.textMuted}
                />
              }
            />

            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={[styles.forgotText, { color: themeColors.primary }]}>
                {authMode === 'OTP' ? 'Resend OTP?' : 'Forgot Password?'}
              </Text>
            </TouchableOpacity>

            <AppButton
              title="Continue to 36Route"
              onPress={handleLogin}
              loading={loading}
              size="lg"
              style={{ marginTop: 12 }}
            />
          </View>

          {/* Footer note */}
          <Text style={[styles.footerText, { color: themeColors.textMuted }]}>
            Protected by 36Route Corporate Security Policy
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContainer: {
    padding: 24,
    justifyContent: 'center',
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  brandTitle: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: Typography.weights.bold as any,
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: Typography.fontSizes.sm,
    marginTop: 4,
  },
  card: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
  },
  welcomeTitle: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.weights.bold as any,
  },
  welcomeSub: {
    fontSize: Typography.fontSizes.sm,
    marginTop: 4,
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  toggleTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.semibold as any,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
  },
  errorText: {
    fontSize: Typography.fontSizes.xs,
    marginLeft: 6,
    flex: 1,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  forgotText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.semibold as any,
  },
  footerText: {
    textAlign: 'center',
    fontSize: Typography.fontSizes.xs,
    marginTop: 24,
  },
});
