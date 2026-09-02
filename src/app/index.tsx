import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';

export default function IndexScreen() {
  const router = useRouter();
  const { isLoggedIn, themeColors } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace(isLoggedIn ? '/(tabs)' : '/login');
    }, 100);
    return () => clearTimeout(timer);
  }, [isLoggedIn]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ActivityIndicator size="large" color={themeColors.primary} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

