import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, BorderRadius, Spacing, Shadows } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

interface AlertCardProps {
  title: string;
  subtitle: string;
  onPress: () => void;
  severity?: 'warning' | 'danger' | 'info';
  style?: ViewStyle;
}

export const AlertCard: React.FC<AlertCardProps> = ({
  title,
  subtitle,
  onPress,
  severity = 'warning',
  style,
}) => {
  const { isDarkMode } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const isDanger = severity === 'danger';
  const isInfo = severity === 'info';

  const accentColor = isDanger ? theme.danger : isInfo ? theme.primary : theme.warning;
  const bg = isDanger
    ? theme.dangerLight
    : isInfo
    ? theme.primaryLight
    : theme.warningLight;
  const icon = isDanger ? 'alert-circle' : isInfo ? 'information-circle' : 'warning-outline';

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: bg,
          borderLeftColor: accentColor,
        },
        style,
      ]}
    >
      <View style={styles.leftRow}>
        <View style={[styles.iconContainer, { backgroundColor: theme.backgroundElement }]}>
          <Ionicons name={icon as any} size={16} color={accentColor} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
            {title}
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]} numberOfLines={2}>
            {subtitle}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={15} color={theme.textMuted} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md - 2,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderLeftWidth: 3,
    marginBottom: Spacing.sm,
    ...Shadows.subtle,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.sm + 4,
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: Typography.fontSizes.sm + 1,
    fontWeight: Typography.weights.semibold,
    marginBottom: 1,
  },
  subtitle: {
    fontSize: Typography.fontSizes.xs + 1,
    fontWeight: Typography.weights.regular,
    lineHeight: 16,
  },
});
