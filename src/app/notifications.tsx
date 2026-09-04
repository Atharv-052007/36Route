import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { Header } from '@/components/ui/Header';
import { Badge } from '@/components/ui/Badge';

export default function NotificationsScreen() {
  const router = useRouter();
  const { alerts, resolveAlert, setSelectedTripId, isDarkMode } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const handleAction = (alert: any) => {
    if (alert.tripId) {
      setSelectedTripId(alert.tripId);
      if (alert.type === 'driver_required') {
        router.push('/dispatch');
      } else {
        router.push('/trip-details');
      }
    } else {
      router.push('/(tabs)/people');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.cardBackground}
      />

      <Header title="Operational Alerts" subtitle="Real-time Dispatch Notices" showBack />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {alerts.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Ionicons name="notifications-off-outline" size={40} color={theme.textMuted} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No operational notifications right now.
            </Text>
          </View>
        ) : (
          alerts.map((alert) => {
            const isResolved = alert.resolved;
            return (
              <View
                key={alert.id}
                style={[
                  styles.alertCard,
                  {
                    backgroundColor: isResolved
                      ? theme.cardBackground
                      : alert.type === 'vehicle_unavailable'
                      ? theme.dangerLight
                      : theme.warningLight,
                    borderColor: isResolved
                      ? theme.border
                      : alert.type === 'vehicle_unavailable'
                      ? theme.dangerBorder
                      : theme.warningBorder,
                    opacity: isResolved ? 0.6 : 1,
                  },
                ]}
              >
                <View style={styles.alertHeader}>
                  <View style={styles.alertLeft}>
                    <Ionicons
                      name={
                        isResolved
                          ? 'checkmark-circle'
                          : alert.type === 'vehicle_unavailable'
                          ? 'alert-circle'
                          : 'warning'
                      }
                      size={20}
                      color={
                        isResolved
                          ? theme.available
                          : alert.type === 'vehicle_unavailable'
                          ? theme.danger
                          : theme.warning
                      }
                    />
                    <Text style={[styles.alertTitle, { color: theme.text }]}>
                      {alert.title}
                    </Text>
                  </View>
                  <Text style={[styles.alertTime, { color: theme.textMuted }]}>
                    {alert.time}
                  </Text>
                </View>

                <Text style={[styles.alertSubtitle, { color: theme.textSecondary }]}>
                  {alert.subtitle}
                </Text>

                <View style={styles.alertActionsRow}>
                  {!isResolved && (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => handleAction(alert)}
                      style={[
                        styles.actionBtn,
                        {
                          backgroundColor:
                            alert.type === 'vehicle_unavailable'
                              ? theme.danger
                              : theme.primary,
                        },
                      ]}
                    >
                      <Text style={styles.actionBtnText}>Take Action</Text>
                      <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
                    </TouchableOpacity>
                  )}

                  {!isResolved ? (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => resolveAlert(alert.id)}
                      style={[
                        styles.dismissBtn,
                        {
                          backgroundColor: theme.cardBackground,
                          borderColor: theme.border,
                        },
                      ]}
                    >
                      <Text style={[styles.dismissText, { color: theme.textSecondary }]}>
                        Dismiss
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <Badge status="Completed" label="Resolved" size="sm" />
                  )}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    padding: Spacing.base,
    paddingBottom: Spacing.xxl,
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: Spacing.sm,
  },
  emptyText: {
    fontSize: Typography.fontSizes.sm,
  },
  alertCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  alertLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  alertTitle: {
    fontSize: Typography.fontSizes.base,
    fontWeight: Typography.weights.bold,
  },
  alertTime: {
    fontSize: Typography.fontSizes.xs,
  },
  alertSubtitle: {
    fontSize: Typography.fontSizes.sm,
    marginBottom: Spacing.md,
  },
  alertActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: BorderRadius.sm,
    gap: 6,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: Typography.fontSizes.xs + 1,
    fontWeight: Typography.weights.bold,
  },
  dismissBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  dismissText: {
    fontSize: Typography.fontSizes.xs + 1,
  },
});
