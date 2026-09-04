import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { AppSafeAreaView } from '@/components/ui/AppSafeAreaView';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image as ExpoImage } from 'expo-image';
import { useApp } from '@/context/AppContext';
import { Typography, BorderRadius, Shadows } from '@/constants/theme';
import { AppInput } from '@/components/ui/AppInput';
import { AnimatedAppButton } from '@/components/ui/AnimatedAppButton';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  FadeInDown,
  FadeInUp,
  SlideInRight,
} from 'react-native-reanimated';

export default function LoginScreen() {
  const router = useRouter();
  const { login, themeColors } = useApp();
  const [authMode, setAuthMode] = useState<'otp' | 'password'>('otp');
  const [identifier, setIdentifier] = useState('aayush.sharma@corptech.com');
  const [code, setCode] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const logoScale = useSharedValue(0);
  const logoRotate = useSharedValue(0);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    logoScale.value = withSpring(1, { damping: 12, stiffness: 100 });
    logoRotate.value = withRepeat(
      withSequence(
        withTiming(3, { duration: 4000 }),
        withTiming(-3, { duration: 4000 }),
        withTiming(0, { duration: 2000 })
      ),
      -1,
      false
    );
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 2000 }),
        withTiming(0.2, { duration: 2000 })
      ),
      -1,
      false
    );
  }, []);

  const logoAnimStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: logoScale.value },
      { rotate: `${logoRotate.value}deg` },
    ],
  }));

  const glowAnimStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: 1 + glowOpacity.value * 0.3 }],
  }));

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
    <AppSafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: themeColors.secondary }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Header Branding with Animated Logo */}
          <View style={styles.header}>
            {/* Animated Glow */}
            <Animated.View style={[styles.logoGlow, glowAnimStyle]} />

            {/* Animated Logo Circle */}
            <Animated.View style={[styles.logoCircle, logoAnimStyle, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
              <ExpoImage source={require('@/assets/images/logo.png')} style={styles.logoImage} />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(200).duration(600)}>
              <Text style={styles.brand}>36Route</Text>
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(400).duration(600)}>
              <Text style={styles.tagline}>Corporate Commute & Transit Portal</Text>
            </Animated.View>
          </View>

          {/* Login Card with Slide-in */}
          <Animated.View
            entering={SlideInRight.delay(300).duration(500).springify()}
            style={[styles.card, { backgroundColor: themeColors.cardBackground }, Shadows.medium]}
          >
            <Text style={[styles.cardTitle, { color: themeColors.text }]}>Welcome Back</Text>
            <Text style={[styles.cardSubtitle, { color: themeColors.textSecondary }]}>
              Sign in to manage and track your employee commute
            </Text>

            {/* Auth Mode Toggle */}
            <View style={[styles.modeToggle, { backgroundColor: themeColors.backgroundElement }]}>
              <TouchableOpacity
                onPress={() => {
                  setAuthMode('otp');
                  setError('');
                }}
                style={[
                  styles.modeBtn,
                  authMode === 'otp' && { backgroundColor: themeColors.secondary },
                ]}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="shield-checkmark-outline"
                  size={16}
                  color={authMode === 'otp' ? '#FFFFFF' : themeColors.textSecondary}
                  style={{ marginRight: 6 }}
                />
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
                onPress={() => {
                  setAuthMode('password');
                  setError('');
                }}
                style={[
                  styles.modeBtn,
                  authMode === 'password' && { backgroundColor: themeColors.secondary },
                ]}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="key-outline"
                  size={16}
                  color={authMode === 'password' ? '#FFFFFF' : themeColors.textSecondary}
                  style={{ marginRight: 6 }}
                />
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
              <Animated.View entering={FadeInDown.duration(300)} style={[styles.errorBanner, { backgroundColor: themeColors.dangerLight }]}>
                <Ionicons name="alert-circle" size={16} color={themeColors.danger} />
                <Text style={[styles.errorText, { color: themeColors.danger }]}>{error}</Text>
              </Animated.View>
            ) : null}

            <AppInput
              label="Official Email or Employee ID"
              placeholder="e.g. name@corptech.com or EMP-1042"
              value={identifier}
              onChangeText={setIdentifier}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Ionicons name="mail-outline" size={18} color={themeColors.textMuted} />}
            />

            <AppInput
              label={authMode === 'otp' ? 'Verification OTP' : 'Account Password'}
              placeholder={authMode === 'otp' ? 'Enter 6-digit OTP' : 'Enter your password'}
              value={code}
              onChangeText={setCode}
              keyboardType={authMode === 'otp' ? 'number-pad' : 'default'}
              secureTextEntry={authMode === 'password'}
              leftIcon={<Ionicons name="lock-closed-outline" size={18} color={themeColors.textMuted} />}
            />

            <View style={styles.helperRow}>
              <Text style={[styles.demoHint, { color: themeColors.textMuted }]}>
                Default test code: <Text style={{ fontWeight: '700' }}>123456</Text>
              </Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={[styles.forgotText, { color: themeColors.secondary }]}>
                  Forgot {authMode === 'otp' ? 'OTP' : 'Password'}?
                </Text>
              </TouchableOpacity>
            </View>

            <AnimatedAppButton
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              size="lg"
            />

            {/* Quick Demo Login Shortcut */}
            <TouchableOpacity
              style={[styles.demoBtn, { borderColor: themeColors.border, backgroundColor: themeColors.backgroundElement }]}
              onPress={handleDemoLogin}
              activeOpacity={0.7}
            >
              <Ionicons name="flash-outline" size={16} color={themeColors.secondary} />
              <Text style={[styles.demoBtnText, { color: themeColors.secondary }]}>
                One-Tap Quick Demo Login
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 36,
    paddingBottom: 28,
    paddingHorizontal: 20,
    position: 'relative',
  },
  logoGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.15)',
    top: 36,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  brand: {
    color: '#FFFFFF',
    fontSize: Typography.fontSizes.hero,
    fontWeight: Typography.weights.bold as any,
    letterSpacing: -0.5,
  },
  tagline: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: Typography.fontSizes.sm,
    marginTop: 4,
    textAlign: 'center',
  },
  card: {
    flex: 1,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: 24,
    paddingTop: 28,
    paddingBottom: 40,
  },
  cardTitle: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: Typography.weights.bold as any,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: Typography.fontSizes.sm,
    lineHeight: 20,
    marginBottom: 20,
  },
  modeToggle: {
    flexDirection: 'row',
    borderRadius: BorderRadius.md,
    padding: 4,
    marginBottom: 20,
  },
  modeBtn: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
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
  helperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 4,
  },
  demoHint: {
    fontSize: Typography.fontSizes.xs,
  },
  forgotText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.semibold as any,
  },
  demoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginTop: 14,
    gap: 8,
  },
  demoBtnText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold as any,
  },
});
