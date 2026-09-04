import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ViewStyle } from 'react-native';
import { Colors, Typography, BorderRadius, Spacing, Shadows } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  highlightColor?: string;
  onPress?: () => void;
  style?: ViewStyle;
  badge?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subValue,
  highlightColor,
  onPress,
  style,
  badge,
}) => {
  const { isDarkMode } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const content = (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.cardBackground,
          borderColor: theme.border,
        },
        style,
      ]}
    >
      <View style={styles.headerRow}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>
          {label}
        </Text>
        {badge && (
          <View style={[styles.badge, { backgroundColor: theme.backgroundElement }]}>
            <Text style={[styles.badgeText, { color: theme.textMuted }]}>{badge}</Text>
          </View>
        )}
      </View>
      <View style={styles.valueRow}>
        <Text
          style={[
            styles.value,
            {
              color: highlightColor || theme.text,
            },
          ]}
        >
          {value}
        </Text>
        {subValue && (
          <Text style={[styles.subValue, { color: theme.textMuted }]}>
            {subValue}
          </Text>
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={{ flex: 1 }}>
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={{ flex: 1 }}>{content}</View>;
};

const styles = StyleSheet.create({
  card: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    ...Shadows.subtle,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.medium,
    letterSpacing: 0.1,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  badgeText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.medium,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  value: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: Typography.weights.bold,
    letterSpacing: -0.5,
  },
  subValue: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.regular,
  },
});
