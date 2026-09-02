import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProvider, useApp } from '@/context/AppContext';
import { BackToHome } from '@/components/BackToHome';
import { Platform } from 'react-native';

function RootLayoutNav() {
  const { themeColors, isDarkMode } = useApp();

  return (
    <>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <Stack
        initialRouteName="index"
        screenOptions={{
          headerShown: false,
          gestureEnabled: Platform.OS !== 'ios' ? true : false,
          contentStyle: { backgroundColor: themeColors.background },
          animation: 'fade_from_bottom',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="book-ride" />
        <Stack.Screen name="ride-details" />
        <Stack.Screen name="route-details" />
        <Stack.Screen name="sos" />
        <Stack.Screen name="help" />
        <Stack.Screen name="edit-profile" />
      </Stack>
      <BackToHome />
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <AppProvider>
          <RootLayoutNav />
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}