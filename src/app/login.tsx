import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isDarkMode } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const [identifier, setIdentifier] = useState('govind@36route.com');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignIn = async () => {
    if (!identifier.trim()) {
      setErrorMsg('Please enter your Supervisor ID or Email');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    try {
      await login(identifier, password);
      router.replace('/(tabs)');
    } catch (e) {
      setErrorMsg('Invalid supervisor credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.cardBackground }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.cardBackground}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.inner}>
          {/* Brand Header */}
          <View style={styles.brandContainer}>
            <Text style={[styles.brandWordmark, { color: theme.text }]}>
              36ROUTE
            </Text>
            <Text style={[styles.tagline, { color: theme.textSecondary }]}>
              Transportation, simplified.
            </Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {errorMsg ? (
              <View
                style={[
                  styles.errorBox,
                  { backgroundColor: theme.dangerLight, borderColor: theme.dangerBorder },
                ]}
              >
                <Text style={[styles.errorText, { color: theme.danger }]}>
                  {errorMsg}
                </Text>
              </View>
            ) : null}

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>
                Supervisor ID / Email
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.backgroundElement,
                    borderColor: theme.border,
                    color: theme.text,
                  },
                ]}
                placeholder="e.g. SUP-001 or email"
                placeholderTextColor={theme.textMuted}
                value={identifier}
                onChangeText={(t) => {
                  setIdentifier(t);
                  setErrorMsg('');
                }}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>
                Password
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.backgroundElement,
                    borderColor: theme.border,
                    color: theme.text,
                  },
                ]}
                placeholder="Enter password"
                placeholderTextColor={theme.textMuted}
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  setErrorMsg('');
                }}
                secureTextEntry
              />
            </View>

            {/* Primary Sign In Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSignIn}
              disabled={loading}
              style={[
                styles.primaryBtn,
                {
                  backgroundColor: theme.primary,
                },
              ]}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.primaryBtnText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Secondary: Forgot password? */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                alert('Contact central operations IT support at ops-support@36route.com');
              }}
              style={styles.forgotBtn}
            >
              <Text style={[styles.forgotText, { color: theme.textSecondary }]}>
                Forgot password?
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  inner: {
    paddingHorizontal: Spacing.xl,
    maxWidth: 420,
    width: '100%',
    alignSelf: 'center',
  },
  brandContainer: {
    marginBottom: Spacing.xxl,
  },
  brandWordmark: {
    fontSize: Typography.fontSizes.hero,
    fontWeight: Typography.weights.bold,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: Typography.fontSizes.base,
    marginTop: 4,
    fontWeight: Typography.weights.regular,
  },
  formContainer: {
    width: '100%',
  },
  errorBox: {
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  errorText: {
    fontSize: Typography.fontSizes.sm,
  },
  inputGroup: {
    marginBottom: Spacing.base,
  },
  label: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.medium,
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    fontSize: Typography.fontSizes.base,
  },
  primaryBtn: {
    height: 48,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: Typography.fontSizes.base,
    fontWeight: Typography.weights.semibold,
    letterSpacing: 0.2,
  },
  forgotBtn: {
    alignSelf: 'center',
    marginTop: Spacing.base,
    padding: Spacing.xs,
  },
  forgotText: {
    fontSize: Typography.fontSizes.sm,
  },
});
