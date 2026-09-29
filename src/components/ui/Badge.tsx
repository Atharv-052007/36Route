import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Colors, Typography, BorderRadius } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export type StatusType =
  | 'Available'
  | 'On Trip'
  | 'Upcoming'
  | 'Assigned'
  | 'Ongoing'
  | 'Completed'
  | 'Cancelled'
  | 'Needs Attention'
  | 'Maintenance'
  | 'Unavailable'
  | 'Boarded'
  | 'Waiting'
  | 'No-show'
  | 'Driver required'
  | string;

interface BadgeProps {
  status: StatusType;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
  style?: ViewStyle;
}

const LIVE_STATUSES = ['on trip', 'ongoing'];

export const Badge: React.FC<BadgeProps> = ({
  status,
  label,
  size = 'md',
  showDot = true,
  style,
}) => {
  const { isDarkMode } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const displayLabel = label || status;
  const normalized = status.toLowerCase();
  const isLive = LIVE_STATUSES.includes(normalized);

  useEffect(() => {
    if (!isLive) return;
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [isLive, pulseAnim]);

  let bg = theme.unavailableLight;
  let text = theme.unavailable;
  let border = theme.unavailableBorder;
  let dotColor = theme.unavailable;

  if (normalized === 'available' || normalized === 'boarded') {
    bg = theme.availableLight;
    text = theme.available;
    border = theme.availableBorder;
    dotColor = theme.available;
  } else if (normalized === 'on trip' || normalized === 'ongoing') {
    bg = theme.onTripLight;
    text = theme.onTrip;
    border = theme.onTripBorder;
    dotColor = theme.onTrip;
  } else if (normalized === 'assigned') {
    bg = theme.assignedLight;
    text = theme.assigned;
    border = theme.assignedBorder;
    dotColor = theme.assigned;
  } else if (normalized === 'upcoming' || normalized === 'waiting') {
    bg = theme.upcomingLight;
    text = theme.upcoming;
    border = theme.upcomingBorder;
    dotColor = theme.upcoming;
  } else if (normalized === 'completed') {
    bg = theme.completedLight;
    text = theme.completed;
    border = theme.completedBorder;
    dotColor = theme.completed;
  } else if (
    normalized === 'needs attention' ||
    normalized === 'driver required' ||
    normalized === 'attention' ||
    normalized === 'maintenance'
  ) {
    bg = theme.warningLight;
    text = theme.warning;
    border = theme.warningBorder;
    dotColor = theme.warning;
  } else if (
    normalized === 'cancelled' ||
    normalized === 'no-show' ||
    normalized === 'urgent'
  ) {
    bg = theme.dangerLight;
    text = theme.danger;
    border = theme.dangerBorder;
    dotColor = theme.danger;
  } else if (normalized === 'unavailable') {
    bg = theme.unavailableLight;
    text = theme.unavailable;
    border = theme.unavailableBorder;
    dotColor = theme.unavailable;
  }

  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: bg,
          borderColor: border,
          paddingVertical: isSmall ? 1.5 : isLarge ? 4 : 2.5,
          paddingHorizontal: isSmall ? 6 : isLarge ? 10 : 8,
        },
        style,
      ]}
    >
      {showDot && (
        <View style={styles.dotRow}>
          <View
            style={[
              styles.dot,
              {
                backgroundColor: dotColor,
                width: isSmall ? 5 : 6,
                height: isSmall ? 5 : 6,
              },
            ]}
          />
          {isLive && (
            <Animated.View
              style={[
                styles.dotPulse,
                {
                  backgroundColor: dotColor,
                  width: isSmall ? 5 : 6,
                  height: isSmall ? 5 : 6,
                  opacity: pulseAnim,
                },
              ]}
            />
          )}
        </View>
      )}
      <Text
        style={[
          styles.text,
          {
            color: text,
            fontSize: 11,
            fontWeight: Typography.weights.semibold,
          },
        ]}
      >
        {displayLabel}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  dotRow: {
    marginRight: 5,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    borderRadius: BorderRadius.full,
  },
  dotPulse: {
    position: 'absolute',
    borderRadius: BorderRadius.full,
  },
  text: {
    textTransform: 'capitalize',
    letterSpacing: 0.2,
  },
});
