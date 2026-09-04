import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { AppSafeAreaView } from '@/components/ui/AppSafeAreaView';
import { useApp } from '../../context/AppContext';
import { Typography } from '../../constants/theme';
import { NotificationCard, EmptyState, SectionHeader } from '../../components/ui/AppStates';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeIn,
  Layout,
} from 'react-native-reanimated';

export default function NotificationsScreen() {
  const { notifications, unreadNotificationCount, markNotificationRead, markAllNotificationsRead, themeColors } = useApp();

  return (
    <AppSafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <Text style={[styles.headerTitle, { color: themeColors.text }]}>Notifications</Text>
          {unreadNotificationCount > 0 && (
            <Text style={[styles.unreadText, { color: themeColors.secondary }]} onPress={markAllNotificationsRead}>
              Mark all read ({unreadNotificationCount})
            </Text>
          )}
        </Animated.View>

        {notifications.length === 0 ? (
          <Animated.View entering={FadeIn.duration(400)}>
            <EmptyState title="No Notifications" description="You're all caught up!" icon="notifications-off-outline" />
          </Animated.View>
        ) : (
          notifications.map((n, index) => (
            <Animated.View
              key={n.id}
              entering={FadeInUp.delay(index * 80).duration(400).springify()}
              layout={Layout.springify()}
            >
              <NotificationCard
                notification={n}
                onPress={() => markNotificationRead(n.id)}
              />
            </Animated.View>
          ))
        )}
      </ScrollView>
    </AppSafeAreaView>
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
