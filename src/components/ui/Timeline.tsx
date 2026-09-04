import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Colors, Typography, BorderRadius, Spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { RouteStop, TripTimelineEvent } from '@/types';

interface RouteTimelineProps {
  stops: RouteStop[];
  style?: ViewStyle;
}

export const RouteTimeline: React.FC<RouteTimelineProps> = ({ stops, style }) => {
  const { isDarkMode } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  return (
    <View style={[styles.container, style]}>
      {stops.map((stop, index) => {
        const isFirst = index === 0;
        const isLast = index === stops.length - 1;

        return (
          <View key={stop.id || index.toString()} style={styles.row}>
            <View style={styles.indicatorCol}>
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor: isFirst
                      ? theme.accent
                      : isLast
                      ? theme.available
                      : theme.textSecondary,
                    width: isFirst || isLast ? 10 : 8,
                    height: isFirst || isLast ? 10 : 8,
                  },
                ]}
              />
              {!isLast && (
                <View style={[styles.line, { backgroundColor: theme.border }]} />
              )}
            </View>
            <View style={styles.contentCol}>
              <View style={styles.stopInfo}>
                <Text style={[styles.stopName, { color: theme.text }]}>
                  {stop.name}
                </Text>
                {stop.time && (
                  <Text style={[styles.stopTime, { color: theme.textSecondary }]}>
                    {stop.time}
                  </Text>
                )}
              </View>
              {stop.pickupCount !== undefined && stop.pickupCount > 0 && (
                <Text style={[styles.stopMeta, { color: theme.textMuted }]}>
                  {stop.pickupCount} passengers pickup
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};

interface EventTimelineProps {
  events: TripTimelineEvent[];
  style?: ViewStyle;
}

export const EventTimeline: React.FC<EventTimelineProps> = ({ events, style }) => {
  const { isDarkMode } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  return (
    <View style={[styles.container, style]}>
      {events.map((event, index) => {
        const isLast = index === events.length - 1;

        let dotColor = theme.accent;
        if (event.type === 'success') dotColor = theme.available;
        if (event.type === 'warning') dotColor = theme.warning;
        if (event.type === 'error') dotColor = theme.danger;

        return (
          <View key={event.id || index.toString()} style={styles.row}>
            <View style={styles.timeCol}>
              <Text style={[styles.eventTime, { color: theme.textSecondary }]}>
                {event.time}
              </Text>
            </View>
            <View style={styles.indicatorCol}>
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor: dotColor,
                    width: 7,
                    height: 7,
                  },
                ]}
              />
              {!isLast && (
                <View style={[styles.line, { backgroundColor: theme.border }]} />
              )}
            </View>
            <View style={styles.contentCol}>
              <Text style={[styles.eventTitle, { color: theme.text }]}>
                {event.title}
              </Text>
              {event.detail && (
                <Text style={[styles.eventDetail, { color: theme.textMuted }]}>
                  {event.detail}
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timeCol: {
    width: 48,
    paddingTop: 1,
  },
  eventTime: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.medium,
  },
  indicatorCol: {
    width: 20,
    alignItems: 'center',
    paddingTop: 5,
  },
  dot: {
    borderRadius: BorderRadius.full,
    zIndex: 2,
  },
  line: {
    position: 'absolute',
    top: 10,
    bottom: -10,
    width: 2,
    zIndex: 1,
  },
  contentCol: {
    flex: 1,
    paddingBottom: Spacing.md,
    paddingLeft: Spacing.xs,
  },
  stopInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stopName: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  stopTime: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.medium,
  },
  stopMeta: {
    fontSize: Typography.fontSizes.xs,
    marginTop: 2,
  },
  eventTitle: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.medium,
  },
  eventDetail: {
    fontSize: Typography.fontSizes.xs,
    marginTop: 2,
  },
});
