import React from 'react';
import { Tabs } from 'expo-router';
import { View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ACTIVE_COLOR = Colors.light.primary;

export default function TabLayout() {
  const { isDarkMode, alerts } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();

  const unresolvedAlertCount = alerts.filter((a) => !a.resolved).length;

  const bottomInset = insets.bottom;
  const tabHeight = 62 + (bottomInset > 0 ? bottomInset : 4);
  const tabPaddingBottom = bottomInset > 0 ? bottomInset : 8;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E7EB',
          borderTopWidth: 1,
          height: tabHeight,
          paddingBottom: tabPaddingBottom,
          paddingTop: 6,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 12,
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 2,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: Typography.weights.semibold,
          fontFamily: 'Inter-SemiBold',
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
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Ionicons
                name={focused ? 'grid' : 'grid-outline'}
                size={22}
                color={focused ? ACTIVE_COLOR : color}
              />
              {focused && (
                <View
                  style={{
                    width: 16,
                    height: 3,
                    borderRadius: 1.5,
                    backgroundColor: ACTIVE_COLOR,
                    marginTop: 3,
                  }}
                />
              )}
            </View>
          ),
          tabBarBadge: unresolvedAlertCount > 0 ? unresolvedAlertCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: theme.warning,
            color: '#FFFFFF',
            fontSize: 10,
            fontWeight: '700',
          },
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: 'Trips',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Ionicons
                name={focused ? 'bus' : 'bus-outline'}
                size={22}
                color={focused ? ACTIVE_COLOR : color}
              />
              {focused && (
                <View
                  style={{
                    width: 16,
                    height: 3,
                    borderRadius: 1.5,
                    backgroundColor: ACTIVE_COLOR,
                    marginTop: 3,
                  }}
                />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="people"
        options={{
          title: 'People',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Ionicons
                name={focused ? 'people' : 'people-outline'}
                size={22}
                color={focused ? ACTIVE_COLOR : color}
              />
              {focused && (
                <View
                  style={{
                    width: 16,
                    height: 3,
                    borderRadius: 1.5,
                    backgroundColor: ACTIVE_COLOR,
                    marginTop: 3,
                  }}
                />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Ionicons
                name={focused ? 'person' : 'person-outline'}
                size={22}
                color={focused ? ACTIVE_COLOR : color}
              />
              {focused && (
                <View
                  style={{
                    width: 16,
                    height: 3,
                    borderRadius: 1.5,
                    backgroundColor: ACTIVE_COLOR,
                    marginTop: 3,
                  }}
                />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Ionicons
                name={
                  focused
                    ? 'ellipsis-horizontal-circle'
                    : 'ellipsis-horizontal-circle-outline'
                }
                size={22}
                color={focused ? ACTIVE_COLOR : color}
              />
              {focused && (
                <View
                  style={{
                    width: 16,
                    height: 3,
                    borderRadius: 1.5,
                    backgroundColor: ACTIVE_COLOR,
                    marginTop: 3,
                  }}
                />
              )}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
