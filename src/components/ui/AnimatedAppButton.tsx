import React, { useEffect } from 'react';
import { Pressable, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
  useDerivedValue,
} from 'react-native-reanimated';
import { useApp } from '../../context/AppContext';
import { BorderRadius, Typography } from '../../constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface AnimatedAppButtonProps {
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

export const AnimatedAppButton: React.FC<AnimatedAppButtonProps> = ({
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
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 400 });
    opacity.value = withTiming(0.85, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    opacity.value = withTiming(1, { duration: 150 });
  };

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
      case 'primary': return '#FFFFFF';
      case 'secondary': return themeColors.secondary;
      case 'outline': return themeColors.secondary;
      case 'danger': return '#FFFFFF';
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
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        {
          backgroundColor: getBgColor(),
          borderRadius: BorderRadius.md,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          borderWidth: variant === 'outline' ? 1.5 : 0,
          borderColor: variant === 'outline' ? themeColors.secondary : 'transparent',
          minHeight: size === 'lg' ? 52 : size === 'md' ? 46 : 38,
        },
        fullWidth && { width: '100%' },
        getPadding(),
        animatedStyle,
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
    </AnimatedPressable>
  );
};
