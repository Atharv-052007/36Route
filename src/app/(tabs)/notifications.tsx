import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useApp } from '../../context/AppContext';
import { Typography } from '../../constants/theme';
import { NotificationCard, EmptyState, SectionHeader } from '../../components/ui/AppStates';

export default function NotificationsScreen() {
  const { notifications, unreadNotificationCount, markNotificationRead, markAllNotificationsRead, themeColors } = useApp();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: themeColors.text }]}>Notifications</Text>
          {unreadNotificationCount > 0 && (
            <Text style={[styles.unreadText, { color: themeColors.secondary }]} onPress={markAllNotificationsRead}>
              Mark all read ({unreadNotificationCount})
            </Text>
          )}
        </View>

        {notifications.length === 0 ? (
          <EmptyState title="No Notifications" description="You're all caught up!" icon="notifications-off-outline" />
        ) : (
          notifications.map((n) => (
            <NotificationCard
              key={n.id}
              notification={n}
              onPress={() => markNotificationRead(n.id)}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 18, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.weights.bold as any,
  },
  unreadText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold as any,
  },
});
