import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider, useApp } from '@/context/AppContext';

function RootLayoutNav() {
  const { themeColors, isDarkMode } = useApp();

  return (
    <>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <Stack
        initialRouteName="(tabs)"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: themeColors.background },
          animation: 'fade_from_bottom',
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="login" />
        <Stack.Screen name="book-ride" />
        <Stack.Screen name="ride-details" />
        <Stack.Screen name="route-details" />
        <Stack.Screen name="sos" />
        <Stack.Screen name="help" />
        <Stack.Screen name="edit-profile" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <RootLayoutNav />
      </AppProvider>
    </SafeAreaProvider>
  );
}
