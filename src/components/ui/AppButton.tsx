import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { useApp } from '../../context/AppContext';
import { BorderRadius, Typography } from '../../constants/theme';

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
  fullWidth?: boolean;
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
  fullWidth = true,
}) => {
  const { themeColors } = useApp();

  const getBgColor = () => {
    if (disabled) return themeColors.border;
    switch (variant) {
      case 'primary': return themeColors.secondary;
      case 'secondary': return themeColors.secondaryLight;
      case 'outline': return 'transparent';
      case 'danger': return themeColors.danger;
      case 'ghost': return 'transparent';
    }
  };

  const getTextColor = () => {
    if (disabled) return themeColors.textMuted;
    switch (variant) {
      case 'primary': return themeColors.textInverse;
      case 'secondary': return themeColors.secondary;
      case 'outline': return themeColors.secondary;
      case 'danger': return themeColors.textInverse;
      case 'ghost': return themeColors.textSecondary;
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'sm': return { paddingVertical: 8, paddingHorizontal: 16 };
      case 'md': return { paddingVertical: 12, paddingHorizontal: 20 };
      case 'lg': return { paddingVertical: 16, paddingHorizontal: 28 };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'sm': return Typography.fontSizes.sm;
      case 'md': return Typography.fontSizes.md;
      case 'lg': return Typography.fontSizes.lg;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        {
          backgroundColor: getBgColor(),
          borderRadius: BorderRadius.md,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          opacity: disabled ? 0.6 : 1,
          borderWidth: variant === 'outline' ? 1.5 : 0,
          borderColor: variant === 'outline' ? themeColors.secondary : 'transparent',
          minHeight: size === 'lg' ? 52 : size === 'md' ? 46 : 38,
        },
        fullWidth && { width: '100%' },
        getPadding(),
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {icon}
          <Text
            style={{
              color: getTextColor(),
              fontSize: getFontSize(),
              fontWeight: Typography.weights.semibold as any,
              marginLeft: icon ? 8 : 0,
            }}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};
