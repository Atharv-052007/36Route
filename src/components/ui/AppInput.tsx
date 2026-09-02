import React from 'react';
import { View, Text, TextInput, TextInputProps, ViewStyle } from 'react-native';
import { useApp } from '../../context/AppContext';
import { BorderRadius, Typography } from '../../constants/theme';

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export const AppInput: React.FC<AppInputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  multiline,
  ...props
}) => {
  const { themeColors } = useApp();

  return (
    <View style={[{ marginBottom: 16 }, containerStyle]}>
      {label && (
        <Text
          style={{
            fontSize: Typography.fontSizes.sm,
            fontWeight: Typography.weights.medium as any,
            color: themeColors.textSecondary,
            marginBottom: 6,
          }}
        >
          {label}
        </Text>
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: multiline ? 'flex-start' : 'center',
          backgroundColor: themeColors.cardBackground,
          borderWidth: 1,
          borderColor: error ? themeColors.danger : themeColors.border,
          borderRadius: BorderRadius.md,
          paddingHorizontal: 14,
          minHeight: multiline ? 100 : 50,
          paddingVertical: multiline ? 12 : 0,
        }}
      >
        {leftIcon && (
          <View style={{ marginRight: 10, marginTop: multiline ? 4 : 0 }}>
            {leftIcon}
          </View>
        )}
        <TextInput
          style={{
            flex: 1,
            fontSize: Typography.fontSizes.md,
            color: themeColors.text,
            paddingVertical: 12,
            textAlignVertical: multiline ? 'top' : 'center',
          }}
          placeholderTextColor={themeColors.textMuted}
          multiline={multiline}
          {...props}
        />
        {rightIcon && (
          <View style={{ marginLeft: 10, marginTop: multiline ? 4 : 0 }}>
            {rightIcon}
          </View>
        )}
      </View>
      {error && (
        <Text
          style={{
            fontSize: Typography.fontSizes.xs,
            color: themeColors.danger,
            marginTop: 4,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
};
