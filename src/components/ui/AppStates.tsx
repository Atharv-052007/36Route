import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { Typography, Shadows } from '../../constants/theme';
import { AppButton } from './AppButton';
import { NotificationItem } from '../../types';

// 1. LoadingState Component
export const LoadingState: React.FC<{ message?: string }> = ({ message = 'Loading 36Route details...' }) => {
  const { themeColors } = useApp();
  return (
    <View style={[styles.centerState, { backgroundColor: themeColors.background }]}>
      <ActivityIndicator size="large" color={themeColors.primary} />
      <Text style={[styles.stateText, { color: themeColors.textSecondary }]}>{message}</Text>
    </View>
  );
};

// 2. EmptyState Component
export const EmptyState: React.FC<{
  title: string;
  description: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  actionTitle?: string;
  onAction?: () => void;
}> = ({ title, description, iconName = 'bus-outline', actionTitle, onAction }) => {
  const { themeColors } = useApp();
  return (
    <View style={styles.centerState}>
      <View style={[styles.iconCircle, { backgroundColor: themeColors.primaryLight }]}>
        <Ionicons name={iconName} size={36} color={themeColors.primary} />
      </View>
      <Text style={[styles.emptyTitle, { color: themeColors.text }]}>{title}</Text>
      <Text style={[styles.emptyDesc, { color: themeColors.textSecondary }]}>{description}</Text>
      {actionTitle && onAction && (
        <AppButton title={actionTitle} onPress={onAction} style={{ marginTop: 16 }} />
      )}
    </View>
  );
};

// 3. ErrorState Component
export const ErrorState: React.FC<{ message: string; onRetry?: () => void }> = ({
  message,
  onRetry,
}) => {
  const { themeColors } = useApp();
  return (
    <View style={styles.centerState}>
      <Ionicons name="alert-circle-outline" size={48} color={themeColors.danger} />
      <Text style={[styles.emptyTitle, { color: themeColors.text }]}>Oops! Something went wrong</Text>
      <Text style={[styles.emptyDesc, { color: themeColors.danger }]}>{message}</Text>
      {onRetry && <AppButton title="Try Again" onPress={onRetry} variant="outline" style={{ marginTop: 16 }} />}
    </View>
  );
};

// 4. SectionHeader Component
export const SectionHeader: React.FC<{
  title: string;
  subtitle?: string;
  actionTitle?: string;
  onAction?: () => void;
}> = ({ title, subtitle, actionTitle, onAction }) => {
  const { themeColors } = useApp();
  return (
    <View style={styles.sectionHeader}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.sectionSub, { color: themeColors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {actionTitle && onAction && (
        <TouchableOpacity onPress={onAction}>
          <Text style={[styles.actionText, { color: themeColors.primary }]}>{actionTitle}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// 5. NotificationCard Component
export const NotificationCard: React.FC<{
  notification: NotificationItem;
  onPress: () => void;
}> = ({ notification, onPress }) => {
  const { themeColors } = useApp();

  const getIcon = () => {
    switch (notification.type) {
      case 'VEHICLE_APPROACHING':
        return 'car-sport-outline';
      case 'DRIVER_ASSIGNED':
        return 'person-add-outline';
      case 'RIDE_REMINDER':
        return 'alarm-outline';
      case 'ANNOUNCEMENT':
        return 'megaphone-outline';
      default:
        return 'notifications-outline';
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.notifCard,
        {
          backgroundColor: notification.read ? themeColors.cardBackground : themeColors.primaryLight,
          borderColor: themeColors.border,
        },
        Shadows.small,
      ]}
    >
      <View
        style={[
          styles.notifIcon,
          {
            backgroundColor: notification.read ? themeColors.borderLight : themeColors.secondaryLight,
          },
        ]}
      >
        <Ionicons name={getIcon()} size={20} color={themeColors.primary} />
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <View style={styles.notifTitleRow}>
          <Text
            style={[
              styles.notifTitle,
              { color: themeColors.text, fontWeight: notification.read ? '600' : '700' },
            ]}
          >
            {notification.title}
          </Text>
          {!notification.read && <View style={[styles.unreadDot, { backgroundColor: themeColors.primary }]} />}
        </View>
        <Text style={[styles.notifMsg, { color: themeColors.textSecondary }]} numberOfLines={2}>
          {notification.message}
        </Text>
        <Text style={[styles.notifTime, { color: themeColors.textMuted }]}>
          {notification.timestamp}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// 6. ConfirmationModal Component
export const ConfirmationModal: React.FC<{
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDanger?: boolean;
}> = ({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isDanger = false,
}) => {
  const { themeColors } = useApp();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: themeColors.cardBackground },
            Shadows.large,
          ]}
        >
          <Text style={[styles.modalTitle, { color: themeColors.text }]}>{title}</Text>
          <Text style={[styles.modalMessage, { color: themeColors.textSecondary }]}>
            {message}
          </Text>
          <View style={styles.modalButtons}>
            <AppButton
              title={cancelText}
              onPress={onCancel}
              variant="ghost"
              style={{ flex: 1, marginRight: 8 }}
            />
            <AppButton
              title={confirmText}
              onPress={onConfirm}
              variant={isDanger ? 'danger' : 'primary'}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centerState: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stateText: {
    marginTop: 12,
    fontSize: Typography.fontSizes.sm,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.weights.bold as any,
    textAlign: 'center',
  },
  emptyDesc: {
    fontSize: Typography.fontSizes.sm,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.weights.bold as any,
  },
  sectionSub: {
    fontSize: Typography.fontSizes.xs,
    marginTop: 2,
  },
  actionText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold as any,
  },
  notifCard: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  notifIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notifTitle: {
    fontSize: Typography.fontSizes.sm,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  notifMsg: {
    fontSize: Typography.fontSizes.xs,
    marginTop: 3,
    lineHeight: 18,
  },
  notifTime: {
    fontSize: 10,
    marginTop: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.weights.bold as any,
  },
  modalMessage: {
    fontSize: Typography.fontSizes.sm,
    marginTop: 8,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 20,
  },
});
