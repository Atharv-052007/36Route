import React, { useEffect } from 'react';
import { Platform, ColorValue } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';
import { Typography } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

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
  const scale = useSharedValue(focused ? 1.12 : 1);

  useEffect(() => {
    scale.value = withSpring(focused ? 1.12 : 1, { damping: 14, stiffness: 300 });
  }, [focused]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animStyle} pointerEvents="none">
      <Ionicons name={name as any} size={size} color={color} />
    </Animated.View>
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
        tabBarActiveTintColor: themeColors.secondary,
        tabBarInactiveTintColor: themeColors.textMuted,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: themeColors.cardBackground,
          borderTopColor: themeColors.border,
          height: tabHeight,
          paddingBottom: tabPaddingBottom,
          paddingTop: 8,
          borderTopWidth: 1,
          elevation: 8,
          shadowColor: themeColors.shadowColor,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
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
