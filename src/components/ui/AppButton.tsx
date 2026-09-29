import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View, ViewStyle, TextStyle } from 'react-native';
import { useApp } from '../../context/AppContext';
import { BorderRadius, Typography, Gradient } from '../../constants/theme';

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
      case 'primary': return 'transparent';
      case 'secondary': return themeColors.primaryLight;
      case 'outline': return 'transparent';
      case 'danger': return themeColors.danger;
      case 'ghost': return 'transparent';
    }
  };

  const getTextColor = () => {
    if (disabled) return themeColors.textMuted;
    switch (variant) {
      case 'primary': return '#FFFFFF';
      case 'secondary': return themeColors.primary;
      case 'outline': return themeColors.primary;
      case 'danger': return '#FFFFFF';
      case 'ghost': return themeColors.textSecondary;
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'sm': return { paddingVertical: 8, paddingHorizontal: 16 };
      case 'md': return { paddingVertical: 12, paddingHorizontal: 20 };
      case 'lg': return { paddingVertical: 14, paddingHorizontal: 28 };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'sm': return Typography.fontSizes.sm;
      case 'md': return Typography.fontSizes.md;
      case 'lg': return Typography.fontSizes.lg;
    }
  };

  const isPrimary = variant === 'primary' && !disabled;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        {
          borderRadius: BorderRadius.md,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          opacity: disabled ? 0.5 : 1,
          borderWidth: variant === 'outline' ? 1.5 : 0,
          borderColor: variant === 'outline' ? (disabled ? themeColors.border : themeColors.primary) : 'transparent',
          minHeight: size === 'lg' ? 52 : size === 'md' ? 46 : 38,
          overflow: 'hidden',
        },
        fullWidth && { width: '100%' },
        getPadding(),
        style,
      ]}
    >
      {isPrimary && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: Gradient.brand[0],
          }}
        />
      )}
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {icon}
          <Text
            style={[
              {
                color: getTextColor(),
                fontSize: getFontSize(),
                fontWeight: Typography.weights.semibold as any,
                marginLeft: icon ? 8 : 0,
                letterSpacing: 0.2,
                position: isPrimary ? 'relative' : 'relative',
                zIndex: 1,
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
