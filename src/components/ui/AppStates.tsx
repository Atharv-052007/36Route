import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { BorderRadius, Typography, Shadows } from '../../constants/theme';
import { NotificationItem } from '../../types';

// ─── Loading State ───────────────────────────────────────────────

export const LoadingState: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => {
  const { themeColors } = useApp();
  return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color={themeColors.secondary} />
      <Text style={[styles.loadingText, { color: themeColors.textSecondary }]}>{message}</Text>
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
  const { themeColors } = useApp();
  return (
    <View style={styles.centered}>
      <View style={[styles.emptyIconCircle, { backgroundColor: themeColors.secondaryLight }]}>
        <Ionicons name={icon as any} size={40} color={themeColors.secondary} />
      </View>
      <Text style={[styles.emptyTitle, { color: themeColors.text }]}>{title}</Text>
      {description && (
        <Text style={[styles.emptyDesc, { color: themeColors.textSecondary }]}>{description}</Text>
      )}
      {actionTitle && onAction && (
        <TouchableOpacity
          onPress={onAction}
          style={[styles.emptyAction, { backgroundColor: themeColors.secondary }]}
          activeOpacity={0.7}
        >
          <Text style={styles.emptyActionText}>{actionTitle}</Text>
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
  const { themeColors } = useApp();
  return (
    <View style={styles.centered}>
      <View style={[styles.emptyIconCircle, { backgroundColor: themeColors.dangerLight }]}>
        <Ionicons name="alert-circle-outline" size={40} color={themeColors.danger} />
      </View>
      <Text style={[styles.emptyTitle, { color: themeColors.text }]}>{message}</Text>
      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          style={[styles.emptyAction, { backgroundColor: themeColors.secondary }]}
          activeOpacity={0.7}
        >
          <Text style={styles.emptyActionText}>Retry</Text>
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
  const { themeColors } = useApp();
  return (
    <View style={styles.sectionHeader}>
      <View>
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.sectionSubtitle, { color: themeColors.textSecondary }]}>{subtitle}</Text>
        )}
      </View>
      {action && onAction && (
        <TouchableOpacity onPress={onAction} activeOpacity={0.7}>
          <Text style={[styles.sectionAction, { color: themeColors.secondary }]}>{action}</Text>
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
  const { themeColors } = useApp();
  const iconName = NOTIFICATION_ICON_MAP[notification.type] || 'notifications';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.notifCard,
        {
          backgroundColor: notification.read ? themeColors.cardBackground : themeColors.secondaryLight,
          borderColor: themeColors.border,
        },
      ]}
    >
      <View style={[styles.notifIconCircle, { backgroundColor: themeColors.secondaryLight }]}>
        <Ionicons name={iconName as any} size={20} color={themeColors.secondary} />
      </View>
      <View style={styles.notifContent}>
        <Text style={[styles.notifTitle, { color: themeColors.text }]}>{notification.title}</Text>
        <Text style={[styles.notifMessage, { color: themeColors.textSecondary }]} numberOfLines={2}>
          {notification.message}
        </Text>
        <Text style={[styles.notifTime, { color: themeColors.textMuted }]}>{notification.timestamp}</Text>
      </View>
      {!notification.read && (
        <View style={[styles.notifDot, { backgroundColor: themeColors.secondary }]} />
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
  const { themeColors } = useApp();
  const confirmBg = variant === 'danger' ? themeColors.danger : themeColors.secondary;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { backgroundColor: themeColors.cardBackground }]}>
          <Text style={[styles.modalTitle, { color: themeColors.text }]}>{title}</Text>
          <Text style={[styles.modalMessage, { color: themeColors.textSecondary }]}>{message}</Text>
          <View style={styles.modalActions}>
            <TouchableOpacity
              onPress={onCancel}
              style={[styles.modalBtn, { backgroundColor: themeColors.backgroundElement }]}
              activeOpacity={0.7}
            >
              <Text style={[styles.modalBtnText, { color: themeColors.textSecondary }]}>{cancelText}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              style={[styles.modalBtn, { backgroundColor: confirmBg }]}
              activeOpacity={0.7}
            >
              <Text style={[styles.modalBtnText, { color: '#FFFFFF' }]}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ─── Status Badge ────────────────────────────────────────────────

export const StatusBadge: React.FC<{
  status: string;
  size?: 'sm' | 'md';
}> = ({ status, size = 'md' }) => {
  const { themeColors } = useApp();

  const getStatusColor = () => {
    switch (status) {
      case 'IN_TRANSIT': return { bg: themeColors.onTripLight, text: themeColors.onTrip, dot: themeColors.onTrip };
      case 'BOARDING': return { bg: themeColors.onTripLight, text: themeColors.onTrip, dot: themeColors.onTrip };
      case 'SCHEDULED': return { bg: themeColors.secondaryLight, text: themeColors.secondary, dot: themeColors.secondary };
      case 'COMPLETED': return { bg: themeColors.accentLight, text: themeColors.accent, dot: themeColors.accent };
      case 'ARRIVED': return { bg: themeColors.accentLight, text: themeColors.accent, dot: themeColors.accent };
      case 'CANCELLED': return { bg: themeColors.dangerLight, text: themeColors.danger, dot: themeColors.danger };
      case 'DELAYED': return { bg: themeColors.warningLight, text: themeColors.warning, dot: themeColors.warning };
      default: return { bg: themeColors.backgroundElement, text: themeColors.textMuted, dot: themeColors.textMuted };
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
        paddingVertical: isSmall ? 4 : 6,
        borderRadius: BorderRadius.full,
      }}
    >
      <View
        style={{
          width: isSmall ? 6 : 8,
          height: isSmall ? 6 : 8,
          borderRadius: isSmall ? 3 : 4,
          backgroundColor: colors.dot,
          marginRight: 6,
        }}
      />
      <Text
        style={{
          fontSize: isSmall ? Typography.fontSizes.xs : Typography.fontSizes.sm,
          fontWeight: Typography.weights.semibold as any,
          color: colors.text,
          textTransform: 'capitalize',
        }}
      >
        {status.replace(/_/g, ' ').toLowerCase()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: Typography.fontSizes.md,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.weights.semibold as any,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: Typography.fontSizes.sm,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  emptyAction: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
  },
  emptyActionText: {
    color: '#FFFFFF',
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.semibold as any,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.weights.semibold as any,
  },
  sectionSubtitle: {
    fontSize: Typography.fontSizes.sm,
    marginTop: 2,
  },
  sectionAction: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold as any,
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: 10,
  },
  notifIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notifContent: {
    flex: 1,
  },
  notifTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.semibold as any,
    marginBottom: 2,
  },
  notifMessage: {
    fontSize: Typography.fontSizes.sm,
    lineHeight: 18,
    marginBottom: 4,
  },
  notifTime: {
    fontSize: Typography.fontSizes.xs,
  },
  notifDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    width: '100%',
    borderRadius: BorderRadius.lg,
    padding: 24,
    ...Shadows.medium,
  },
  modalTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.weights.bold as any,
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: Typography.fontSizes.md,
    lineHeight: 22,
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  modalBtnText: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.weights.semibold as any,
  },
});
