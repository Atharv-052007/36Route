import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Colors, Typography, BorderRadius, Spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
  style?: ViewStyle;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  stepLabels,
  style,
}) => {
  const { isDarkMode } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.headerRow}>
        <Text style={[styles.stepCounter, { color: theme.accent }]}>
          STEP {currentStep} OF {totalSteps}
        </Text>
        <Text style={[styles.stepName, { color: theme.text }]}>
          {stepLabels[currentStep - 1]}
        </Text>
      </View>
      <View style={styles.barContainer}>
        {Array.from({ length: totalSteps }).map((_, i) => {
          const stepNum = i + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          let fill = theme.border;
          if (isCompleted) fill = theme.available;
          else if (isCurrent) fill = theme.accent;

          return (
            <View
              key={i}
              style={[
                styles.segment,
                {
                  backgroundColor: fill,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  stepCounter: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.5,
  },
  stepName: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  barContainer: {
    flexDirection: 'row',
    gap: 4,
    height: 4,
  },
  segment: {
    flex: 1,
    height: '100%',
    borderRadius: BorderRadius.full,
  },
});
