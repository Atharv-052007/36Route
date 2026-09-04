import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, BorderRadius, Spacing } from '@/constants/theme';
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
  const bg = isDanger ? theme.dangerLight : theme.warningLight;
  const borderColor = isDanger ? theme.dangerBorder : theme.warningBorder;
  const iconColor = isDanger ? theme.danger : theme.warning;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: bg,
          borderColor: borderColor,
        },
        style,
      ]}
    >
      <View style={styles.leftRow}>
        <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : '#FFFFFF' }]}>
          <Ionicons
            name={isDanger ? 'alert-circle' : 'warning-outline'}
            size={18}
            color={iconColor}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {subtitle}
          </Text>
        </View>
      </View>
      <View style={styles.rightArrow}>
        <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.md,
  },
  iconContainer: {
    width: 32,
    height: 32,
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
    marginBottom: 2,
  },
  subtitle: {
    fontSize: Typography.fontSizes.xs + 1,
    fontWeight: Typography.weights.regular,
  },
  rightArrow: {
    marginLeft: Spacing.sm,
  },
});
