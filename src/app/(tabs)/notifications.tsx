import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { AppSafeAreaView } from '@/components/ui/AppSafeAreaView';
import { Header } from '@/components/ui/Header';
import { useApp } from '../../context/AppContext';
import { Typography, BorderRadius, Spacing, Shadows } from '../../constants/theme';
import { NotificationCard, EmptyState } from '../../components/ui/AppStates';

function groupByDate(notifications: any[]) {
  const now = new Date();
  const todayStr = now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  const groups: { title: string; data: any[] }[] = [
    { title: 'Today', data: [] },
    { title: 'Yesterday', data: [] },
    { title: 'Earlier', data: [] },
  ];

  for (const n of notifications) {
    const d = new Date(n.timestamp);
    const ds = d.toDateString();
    if (ds === todayStr) {
      groups[0].data.push(n);
    } else if (ds === yesterdayStr) {
      groups[1].data.push(n);
    } else {
      groups[2].data.push(n);
    }
  }

  return groups.filter((g) => g.data.length > 0);
}

export default function NotificationsScreen() {
  const { notifications, unreadNotificationCount, markNotificationRead, markAllNotificationsRead, themeColors } = useApp();

  const grouped = useMemo(() => groupByDate(notifications), [notifications]);

  const markAllButton = unreadNotificationCount > 0 ? (
    <TouchableOpacity onPress={markAllNotificationsRead} activeOpacity={0.7}>
      <Text style={[styles.markAllText, { color: themeColors.secondary }]}>
        Mark all read
      </Text>
    </TouchableOpacity>
  ) : undefined;

  return (
    <AppSafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <Header
        title="Notifications"
        subtitle={unreadNotificationCount > 0 ? `${unreadNotificationCount} unread` : undefined}
        rightAction={markAllButton}
      />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {notifications.length === 0 ? (
          <View style={styles.emptyWrap}>
            <EmptyState
              title="No Notifications"
              description="You're all caught up!"
              icon="notifications-off-outline"
            />
          </View>
        ) : (
          grouped.map((group) => (
            <View key={group.title} style={styles.group}>
              <Text style={[styles.groupTitle, { color: themeColors.textMuted }]}>
                {group.title}
              </Text>
              <View style={[styles.groupCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }, Shadows.subtle]}>
                {group.data.map((n, i) => (
                  <View
                    key={n.id}
                    style={i < group.data.length - 1 ? [styles.notifSeparator, { borderBottomColor: themeColors.borderLight }] : undefined}
                  >
                    <NotificationCard
                      notification={n}
                      onPress={() => markNotificationRead(n.id)}
                    />
                  </View>
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    padding: Spacing.base,
    paddingBottom: Spacing.xxl,
  },
  emptyWrap: {
    marginTop: 80,
  },
  group: {
    marginBottom: Spacing.lg,
  },
  groupTitle: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  groupCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  notifSeparator: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  markAllText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold,
  },
});
