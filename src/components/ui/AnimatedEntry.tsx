import React, { useEffect } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  FadeIn,
  FadeInUp,
  FadeInDown,
  SlideInRight,
  Layout,
} from 'react-native-reanimated';

type AnimationType = 'fadeIn' | 'fadeInUp' | 'fadeInDown' | 'slideInRight';

interface AnimatedEntryProps {
  children: React.ReactNode;
  delay?: number;
  animation?: AnimationType;
  style?: ViewStyle;
  duration?: number;
}

const ANIMATION_MAP: Record<AnimationType, any> = {
  fadeIn: FadeIn,
  fadeInUp: FadeInUp,
  fadeInDown: FadeInDown,
  slideInRight: SlideInRight,
};

export const AnimatedEntry: React.FC<AnimatedEntryProps> = ({
  children,
  delay = 0,
  animation = 'fadeInUp',
  style,
  duration = 500,
}) => {
  const entering = ANIMATION_MAP[animation].duration(duration).delay(delay);

  return (
    <Animated.View entering={entering} layout={Layout.springify()} style={style}>
      {children}
    </Animated.View>
  );
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
  staggerDelay = 80,
  animation = 'fadeInUp',
  style,
}) => {
  return (
    <Animated.View style={style}>
      {children.map((child, index) => (
        <AnimatedEntry
          key={index}
          delay={index * staggerDelay}
          animation={animation}
        >
          {child}
        </AnimatedEntry>
      ))}
    </Animated.View>
  );
};

// ─── Pulse Animation Wrapper ───────────────────────────────────

interface PulseProps {
  children: React.ReactNode;
  speed?: number;
  style?: ViewStyle;
}

export const Pulse: React.FC<PulseProps> = ({ children, speed = 1500, style }) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: speed / 2 }),
        withTiming(1, { duration: speed / 2 })
      ),
      -1,
      false
    );
  }, [speed]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

// ─── Floating Animation Wrapper ────────────────────────────────

interface FloatProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Float: React.FC<FloatProps> = ({ children, style }) => {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 1500 }),
        withTiming(0, { duration: 1500 })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
};
