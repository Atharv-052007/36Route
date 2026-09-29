import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';
import { BorderRadius, Typography, Shadows, Spacing, Colors } from '@/constants/theme';
import { NotificationItem } from '@/types';

// ─── Loading State ───────────────────────────────────────────────

export const LoadingState: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => {
  const { isDarkMode } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;
  const pulseAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.5,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  return (
    <View style={styles.centered}>
      <Animated.View style={[styles.loadingRing, { opacity: pulseAnim }]}>
        <ActivityIndicator size="large" color={theme.secondary} />
      </Animated.View>
      <Text style={[styles.loadingText, { color: theme.textSecondary }]}>{message}</Text>
    </View>
  );
};

// ─── Empty State ─────────────────────────────────────────────────

interface EmptyStateProps {
  title: string;
  description?: string;
  actionTitle?: string;
  onAction?: () => void;
  icon?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionTitle,
  onAction,
  icon = 'bus-outline',
}) => {
  const { isDarkMode } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  return (
    <View style={styles.centered}>
      <View style={[styles.emptyIconCircle, { backgroundColor: theme.secondaryLight }]}>
        <Ionicons name={icon as any} size={44} color={theme.secondary} />
      </View>
      <Text style={[styles.emptyTitle, { color: theme.text }]}>{title}</Text>
      {description && (
        <Text style={[styles.emptyDesc, { color: theme.textSecondary }]}>{description}</Text>
      )}
      {actionTitle && onAction && (
        <TouchableOpacity
          onPress={onAction}
          style={[styles.emptyAction, { backgroundColor: theme.secondary }]}
          activeOpacity={0.7}
        >
          <Text style={[styles.emptyActionText, { color: theme.textInverse }]}>{actionTitle}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// ─── Error State ─────────────────────────────────────────────────

export const ErrorState: React.FC<{ message?: string; onRetry?: () => void }> = ({
  message = 'Something went wrong',
  onRetry,
}) => {
  const { isDarkMode } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  return (
    <View style={styles.centered}>
      <View style={[styles.emptyIconCircle, { backgroundColor: theme.dangerLight }]}>
        <Ionicons name="alert-circle-outline" size={44} color={theme.danger} />
      </View>
      <Text style={[styles.emptyTitle, { color: theme.text }]}>{message}</Text>
      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          style={[styles.emptyAction, { backgroundColor: theme.secondary }]}
          activeOpacity={0.7}
        >
          <Text style={[styles.emptyActionText, { color: theme.textInverse }]}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// ─── Section Header ──────────────────────────────────────────────

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: string;
  onAction?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  action,
  onAction,
}) => {
  const { isDarkMode } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  return (
    <View style={styles.sectionHeader}>
      <View>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
        )}
      </View>
      {action && onAction && (
        <TouchableOpacity onPress={onAction} activeOpacity={0.7}>
          <Text style={[styles.sectionAction, { color: theme.secondary }]}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// ─── Notification Card ───────────────────────────────────────────

const NOTIFICATION_ICON_MAP: Record<string, string> = {
  VEHICLE_APPROACHING: 'car-sport',
  DRIVER_ASSIGNED: 'person-add',
  RIDE_REMINDER: 'alarm',
  RIDE_STARTED: 'play-circle',
  RIDE_COMPLETED: 'checkmark-circle',
  SCHEDULE_CHANGE: 'calendar',
  ANNOUNCEMENT: 'megaphone',
  ROUTE_DELAYED: 'time',
  SOS_ALERT: 'alert-circle',
  BOOKING_CONFIRMED: 'checkmark-done',
  CHECK_IN_REMINDER: 'finger-print',
};

export const NotificationCard: React.FC<{
  notification: NotificationItem;
  onPress: () => void;
}> = ({ notification, onPress }) => {
  const { isDarkMode } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;
  const iconName = NOTIFICATION_ICON_MAP[notification.type] || 'notifications';
  const isUnread = !notification.read;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.notifCard,
        {
          backgroundColor: isUnread ? theme.secondaryLight : theme.cardBackground,
          borderLeftColor: isUnread ? theme.secondary : theme.border,
        },
      ]}
    >
      <View style={[styles.notifIconCircle, { backgroundColor: theme.backgroundElement }]}>
        <Ionicons name={iconName as any} size={18} color={theme.secondary} />
      </View>
      <View style={styles.notifContent}>
        <Text style={[styles.notifTitle, { color: theme.text }]}>{notification.title}</Text>
        <Text style={[styles.notifMessage, { color: theme.textSecondary }]} numberOfLines={2}>
          {notification.message}
        </Text>
        <Text style={[styles.notifTime, { color: theme.textMuted }]}>{notification.timestamp}</Text>
      </View>
      {isUnread && (
        <View style={[styles.notifDot, { backgroundColor: theme.secondary }]} />
      )}
    </TouchableOpacity>
  );
};

// ─── Confirmation Modal ──────────────────────────────────────────

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'primary' | 'danger';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'primary',
}) => {
  const { isDarkMode } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;
  const confirmBg = variant === 'danger' ? theme.danger : theme.secondary;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.modalTitle, { color: theme.text }]}>{title}</Text>
          <Text style={[styles.modalMessage, { color: theme.textSecondary }]}>{message}</Text>
          <View style={styles.modalActions}>
            <TouchableOpacity
              onPress={onCancel}
              style={[styles.modalBtn, { backgroundColor: theme.backgroundElement }]}
              activeOpacity={0.7}
            >
              <Text style={[styles.modalBtnText, { color: theme.textSecondary }]}>{cancelText}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              style={[styles.modalBtn, { backgroundColor: confirmBg }]}
              activeOpacity={0.7}
            >
              <Text style={[styles.modalBtnText, { color: theme.textInverse }]}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ─── Status Badge ────────────────────────────────────────────────

const LIVE_STATUSES = ['IN_TRANSIT', 'BOARDING'];

export const StatusBadge: React.FC<{
  status: string;
  size?: 'sm' | 'md';
}> = ({ status, size = 'md' }) => {
  const { isDarkMode } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const isLive = LIVE_STATUSES.includes(status);

  useEffect(() => {
    if (!isLive) return;
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [isLive, pulseAnim]);

  const getStatusColor = () => {
    switch (status) {
      case 'IN_TRANSIT':
      case 'BOARDING':
        return { bg: theme.onTripLight, text: theme.onTrip, dot: theme.onTrip };
      case 'SCHEDULED':
        return { bg: theme.secondaryLight, text: theme.secondary, dot: theme.secondary };
      case 'COMPLETED':
      case 'ARRIVED':
        return { bg: theme.accentLight, text: theme.accent, dot: theme.accent };
      case 'CANCELLED':
        return { bg: theme.dangerLight, text: theme.danger, dot: theme.danger };
      case 'DELAYED':
        return { bg: theme.warningLight, text: theme.warning, dot: theme.warning };
      default:
        return { bg: theme.backgroundElement, text: theme.textMuted, dot: theme.textMuted };
    }
  };

  const colors = getStatusColor();
  const isSmall = size === 'sm';

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.bg,
        paddingHorizontal: isSmall ? 8 : 12,
        paddingVertical: isSmall ? 3 : 5,
        borderRadius: BorderRadius.full,
        borderWidth: 1,
        borderColor: `${colors.dot}30`,
      }}
    >
      <View style={{ position: 'relative', marginRight: 6, alignItems: 'center', justifyContent: 'center' }}>
        <View
          style={{
            width: isSmall ? 5 : 6,
            height: isSmall ? 5 : 6,
            borderRadius: BorderRadius.full,
            backgroundColor: colors.dot,
          }}
        />
        {isLive && (
          <Animated.View
            style={{
              position: 'absolute',
              width: isSmall ? 5 : 6,
              height: isSmall ? 5 : 6,
              borderRadius: BorderRadius.full,
              backgroundColor: colors.dot,
              opacity: pulseAnim,
            }}
          />
        )}
      </View>
      <Text
        style={{
          fontSize: 11,
          fontWeight: Typography.weights.semibold as any,
          color: colors.text,
          textTransform: 'capitalize',
          letterSpacing: 0.2,
        }}
      >
        {status.replace(/_/g, ' ').toLowerCase()}
      </Text>
    </View>
  );
};

// ─── Styles ──────────────────────────────────────────────────────

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  loadingRing: {
    marginBottom: 16,
  },
  loadingText: {
    marginTop: 4,
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.medium,
  },
  emptyIconCircle: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.weights.semibold,
    textAlign: 'center',
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: Typography.fontSizes.sm,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    maxWidth: 280,
  },
  emptyAction: {
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: BorderRadius.full,
  },
  emptyActionText: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.semibold,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  sectionSubtitle: {
    fontSize: Typography.fontSizes.sm,
    marginTop: 2,
    textTransform: 'none',
    letterSpacing: 0,
  },
  sectionAction: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    borderRadius: BorderRadius.lg,
    borderLeftWidth: 3,
    marginBottom: 10,
    ...Shadows.subtle,
  },
  notifIconCircle: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notifContent: {
    flex: 1,
  },
  notifTitle: {
    fontSize: Typography.fontSizes.sm + 1,
    fontWeight: Typography.weights.semibold,
    marginBottom: 2,
  },
  notifMessage: {
    fontSize: Typography.fontSizes.xs + 1,
    lineHeight: 18,
    marginBottom: 4,
  },
  notifTime: {
    fontSize: Typography.fontSizes.xs,
  },
  notifDot: {
    width: 7,
    height: 7,
    borderRadius: BorderRadius.full,
    marginLeft: 8,
    marginTop: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 380,
    borderRadius: BorderRadius.xl,
    padding: 28,
    ...Shadows.large,
  },
  modalTitle: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.weights.bold,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: Typography.fontSizes.md,
    lineHeight: 23,
    marginBottom: 28,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  modalBtnText: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.semibold,
  },
});
