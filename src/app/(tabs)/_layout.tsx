import React from 'react';
import { View, StyleSheet, ColorValue, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TAB_ICONS: Record<string, { focused: string; unfocused: string }> = {
  index: { focused: 'home', unfocused: 'home-outline' },
  rides: { focused: 'calendar', unfocused: 'calendar-outline' },
  track: { focused: 'navigate', unfocused: 'navigate-outline' },
  notifications: { focused: 'notifications', unfocused: 'notifications-outline' },
  profile: { focused: 'person', unfocused: 'person-outline' },
};

const TAB_LABELS: Record<string, string> = {
  index: 'Home',
  rides: 'Rides',
  track: 'Track',
  notifications: 'Updates',
  profile: 'Profile',
};

function AnimatedTabIcon({
  name,
  color,
  size,
  focused,
}: {
  name: string;
  color: ColorValue;
  size: number;
  focused: boolean;
}) {
  return (
    <View style={styles.iconContainer}>
      <Ionicons name={name as any} size={size} color={color} />
      {focused && <View style={[styles.indicator, { backgroundColor: Colors.light.primary }]} />}
    </View>
  );
}

export default function TabLayout() {
  const { themeColors, unreadNotificationCount } = useApp();
  const insets = useSafeAreaInsets();

  const bottomInset = insets.bottom;
  const tabHeight = 60 + (bottomInset > 0 ? bottomInset : 4);
  const tabPaddingBottom = bottomInset > 0 ? bottomInset : 8;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.light.primary,
        tabBarInactiveTintColor: themeColors.textMuted,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: themeColors.cardBackground,
          borderTopWidth: 1,
          borderTopColor: themeColors.border,
          height: tabHeight,
          paddingBottom: tabPaddingBottom,
          paddingTop: 8,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.06,
              shadowRadius: 12,
            },
            android: {
              elevation: 12,
            },
          }),
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 2,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: Typography.weights.semibold as any,
          fontFamily: 'Inter',
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: TAB_LABELS.index,
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon
              name={focused ? TAB_ICONS.index.focused : TAB_ICONS.index.unfocused}
              color={color}
              size={size}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="rides"
        options={{
          title: TAB_LABELS.rides,
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon
              name={focused ? TAB_ICONS.rides.focused : TAB_ICONS.rides.unfocused}
              color={color}
              size={size}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="track"
        options={{
          title: TAB_LABELS.track,
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon
              name={focused ? TAB_ICONS.track.focused : TAB_ICONS.track.unfocused}
              color={color}
              size={size}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: TAB_LABELS.notifications,
          tabBarBadge: unreadNotificationCount > 0 ? unreadNotificationCount : undefined,
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon
              name={focused ? TAB_ICONS.notifications.focused : TAB_ICONS.notifications.unfocused}
              color={color}
              size={size}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: TAB_LABELS.profile,
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon
              name={focused ? TAB_ICONS.profile.focused : TAB_ICONS.profile.unfocused}
              color={color}
              size={size}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
  },
  indicator: {
    position: 'absolute',
    bottom: -6,
    width: 20,
    height: 3,
    borderRadius: BorderRadius.full,
  },
});
