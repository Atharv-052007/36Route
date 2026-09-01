import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useApp } from '../../context/AppContext';
import { Typography } from '../../constants/theme';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
}) => {
  const { themeColors } = useApp();

  const getBackgroundColor = () => {
    if (disabled) return themeColors.border;
    switch (variant) {
      case 'primary':
        return themeColors.primary;
      case 'secondary':
        return themeColors.secondaryLight;
      case 'danger':
        return themeColors.danger;
      case 'outline':
      case 'ghost':
        return 'transparent';
      default:
        return themeColors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return themeColors.textMuted;
    switch (variant) {
      case 'primary':
      case 'danger':
        return '#FFFFFF';
      case 'secondary':
        return themeColors.primary;
      case 'outline':
        return themeColors.primary;
      case 'ghost':
        return themeColors.textSecondary;
      default:
        return '#FFFFFF';
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'sm':
        return { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 };
      case 'lg':
        return { paddingVertical: 16, paddingHorizontal: 24, borderRadius: 14 };
      case 'md':
      default:
        return { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 12 };
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        getPadding(),
        {
          backgroundColor: getBackgroundColor(),
          borderColor: variant === 'outline' ? themeColors.primary : 'transparent',
          borderWidth: variant === 'outline' ? 1.5 : 0,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.text,
              {
                color: getTextColor(),
                marginLeft: icon ? 8 : 0,
                fontSize: size === 'sm' ? 13 : size === 'lg' ? 16 : 14,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: Typography.weights.semibold as any,
  },
});
