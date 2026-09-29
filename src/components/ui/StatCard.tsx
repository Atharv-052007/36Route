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
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subValue,
  highlightColor,
  onPress,
  style,
  badge,
  icon,
  trend,
  trendValue,
}) => {
  const { isDarkMode } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const trendColor = trend === 'up' ? '#10B981' : trend === 'down' ? '#EF4444' : theme.textMuted;
  const trendIcon = trend === 'up' ? 'trending-up' : trend === 'down' ? 'trending-down' : 'remove';

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
        <View style={styles.labelRow}>
          {icon && (
            <View style={[styles.iconWrap, { backgroundColor: theme.primaryLight }]}>
              <Text style={styles.iconText}>{icon}</Text>
            </View>
          )}
          <Text style={[styles.label, { color: theme.textSecondary }]}>
            {label}
          </Text>
        </View>
        {badge && (
          <View style={[styles.badge, { backgroundColor: theme.primaryLight }]}>
            <Text style={[styles.badgeText, { color: theme.primary }]}>{badge}</Text>
          </View>
        )}
      </View>

      <View style={styles.valueRow}>
        <Text
          style={[
            styles.value,
            { color: highlightColor || theme.text },
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

      {(trend || trendValue) && (
        <View style={styles.trendRow}>
          <View style={[styles.trendBadge, { backgroundColor: `${trendColor}15` }]}>
            <Text style={[styles.trendIcon, { color: trendColor }]}>{trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}</Text>
            {trendValue && (
              <Text style={[styles.trendText, { color: trendColor }]}>{trendValue}</Text>
            )}
          </View>
        </View>
      )}
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
    paddingVertical: Spacing.md - 2,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    ...Shadows.subtle,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconWrap: {
    width: 24,
    height: 24,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 12,
  },
  label: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.medium,
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: Typography.weights.semibold,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  value: {
    fontSize: Typography.fontSizes.xxl + 2,
    fontWeight: Typography.weights.bold,
    letterSpacing: -0.8,
  },
  subValue: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.regular,
  },
  trendRow: {
    marginTop: 8,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    gap: 3,
  },
  trendIcon: {
    fontSize: 11,
    fontWeight: Typography.weights.bold,
  },
  trendText: {
    fontSize: 11,
    fontWeight: Typography.weights.semibold,
  },
});
