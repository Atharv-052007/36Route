import React from 'react';
import { View, ViewStyle } from 'react-native';

// Static, animation-free entry wrappers. The app intentionally ships without
// motion effects; these keep the original component APIs so screens need no
// changes, but render plain static views. The animation-related props
// (delay, animation, duration, speed, staggerDelay) are accepted and ignored.

type AnimationType = 'fadeIn' | 'fadeInUp' | 'fadeInDown' | 'slideInRight';

interface AnimatedEntryProps {
  children: React.ReactNode;
  delay?: number;
  animation?: AnimationType;
  style?: ViewStyle;
  duration?: number;
}

export const AnimatedEntry: React.FC<AnimatedEntryProps> = ({
  children,
  style,
}) => {
  return <View style={style}>{children}</View>;
};

// ─── Staggered List Wrapper ────────────────────────────────────

interface StaggeredListProps {
  children: React.ReactNode[];
  staggerDelay?: number;
  animation?: AnimationType;
  style?: ViewStyle;
}

export const StaggeredList: React.FC<StaggeredListProps> = ({
  children,
  style,
}) => {
  return (
    <View style={style}>
      {children.map((child, index) => (
        <View key={index}>{child}</View>
      ))}
    </View>
  );
};

// ─── Pulse Animation Wrapper (static) ──────────────────────────

interface PulseProps {
  children: React.ReactNode;
  speed?: number;
  style?: ViewStyle;
}

export const Pulse: React.FC<PulseProps> = ({ children, style }) => {
  return <View style={style}>{children}</View>;
};

// ─── Floating Animation Wrapper (static) ───────────────────────

interface FloatProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Float: React.FC<FloatProps> = ({ children, style }) => {
  return <View style={style}>{children}</View>;
};
