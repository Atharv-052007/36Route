import React from 'react';
import { ColorValue, View, useColorScheme } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';
import { Colors, Typography } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TAB_ICONS: Record<string, { focused: string; unfocused: string }> = {
  index: { focused: 'speedometer', unfocused: 'speedometer-outline' },
  trips: { focused: 'calendar', unfocused: 'calendar-outline' },
  'active-trip': { focused: 'navigate', unfocused: 'navigate-outline' },
  vehicle: { focused: 'bus', unfocused: 'bus-outline' },
  profile: { focused: 'person', unfocused: 'person-outline' },
};

const TAB_LABELS: Record<string, string> = {
  index: 'Dashboard',
  trips: 'Trips',
  'active-trip': 'Active',
  vehicle: 'Vehicle',
  profile: 'Profile',
};

function TabIcon({
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
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons name={name as any} size={size} color={color} />
      {focused && (
        <View
          style={{
            width: 18,
            height: 3,
            borderRadius: 1.5,
            backgroundColor: Colors.light.primary,
            marginTop: 4,
          }}
        />
      )}
    </View>
  );
}

export default function DriverTabLayout() {
  const { themeColors } = useApp();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const activeTint = Colors[colorScheme === 'dark' ? 'dark' : 'light'].primary;

  const bottomInset = insets.bottom;
  const tabHeight = 60 + (bottomInset > 0 ? bottomInset : 4);
  const tabPaddingBottom = bottomInset > 0 ? bottomInset : 8;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeTint,
        tabBarInactiveTintColor: themeColors.textMuted,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: themeColors.border,
          borderTopWidth: 1,
          height: tabHeight,
          paddingBottom: tabPaddingBottom,
          paddingTop: 8,
          elevation: 12,
          shadowColor: themeColors.shadowColor,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 16,
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
            <TabIcon
              name={focused ? TAB_ICONS.index.focused : TAB_ICONS.index.unfocused}
              color={color}
              size={size}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: TAB_LABELS.trips,
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              name={focused ? TAB_ICONS.trips.focused : TAB_ICONS.trips.unfocused}
              color={color}
              size={size}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="active-trip"
        options={{
          title: TAB_LABELS['active-trip'],
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              name={focused ? TAB_ICONS['active-trip'].focused : TAB_ICONS['active-trip'].unfocused}
              color={color}
              size={size}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="vehicle"
        options={{
          title: TAB_LABELS.vehicle,
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              name={focused ? TAB_ICONS.vehicle.focused : TAB_ICONS.vehicle.unfocused}
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
            <TabIcon
              name={focused ? TAB_ICONS.profile.focused : TAB_ICONS.profile.unfocused}
              color={color}
              size={size}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="passengers"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="routes"
        options={{ href: null }}
      />
    </Tabs>
  );
}
