import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { Typography } from '../../constants/theme';
import { NotificationCard } from '../../components/ui/AppStates';
import { EmptyState } from '../../components/ui/AppStates';

export default function NotificationsScreen() {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    themeColors,
    unreadNotificationCount,
  } = useApp();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: themeColors.text }]}>Notification Center</Text>
            <Text style={[styles.subTitle, { color: themeColors.textSecondary }]}>
              {unreadNotificationCount} unread commute updates
            </Text>
          </View>

          {unreadNotificationCount > 0 && (
            <TouchableOpacity onPress={markAllNotificationsRead}>
              <Text style={[styles.markAllText, { color: themeColors.primary }]}>
                Mark all read
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Notifications list */}
        {notifications.length > 0 ? (
          notifications.map((item) => (
            <NotificationCard
              key={item.id}
              notification={item}
              onPress={() => markNotificationRead(item.id)}
            />
          ))
        ) : (
          <EmptyState
            title="No Notifications"
            description="You are all caught up! Commute reminders and updates will appear here."
            iconName="notifications-off-outline"
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    padding: 18,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  title: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.weights.bold as any,
  },
  subTitle: {
    fontSize: Typography.fontSizes.xs,
    marginTop: 2,
  },
  markAllText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.semibold as any,
  },
});
