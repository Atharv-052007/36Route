import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { useApp } from '../../context/AppContext';
import { Typography } from '../../constants/theme';

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const AppInput: React.FC<AppInputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  style,
  ...props
}) => {
  const { themeColors } = useApp();

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: themeColors.textSecondary }]}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: themeColors.cardBackground,
            borderColor: error ? themeColors.danger : themeColors.border,
          },
        ]}
      >
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
        <TextInput
          placeholderTextColor={themeColors.textMuted}
          style={[
            styles.input,
            { color: themeColors.text },
            leftIcon ? { paddingLeft: 4 } : null,
            rightIcon ? { paddingRight: 4 } : null,
            style,
          ]}
          {...props}
        />
        {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
      </View>
      {error ? (
        <Text style={[styles.errorText, { color: themeColors.danger }]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.medium as any,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: Typography.fontSizes.md,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  errorText: {
    fontSize: Typography.fontSizes.xs,
    marginTop: 4,
  },
});
