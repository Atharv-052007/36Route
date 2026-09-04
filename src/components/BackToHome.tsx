import React, { useCallback, useMemo } from 'react';
import { View, Pressable, StyleSheet, Platform, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  SharedValue,
  runOnJS,
} from 'react-native-reanimated';
import { useSegments } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { useBackToHome } from '@/hooks/use-back-to-home';
import { Typography, BorderRadius, Shadows } from '@/constants/theme';

const HOME_SEGMENTS: string[][] = [
  [],
  ['(tabs)'],
  ['(tabs)', 'index'],
  ['(driver)'],
  ['(driver)', 'index'],
];

const HIDDEN_SEGMENTS: string[][] = [['login']];

function isHome(segments: string[]): boolean {
  const clean = segments.filter(Boolean);
  return HOME_SEGMENTS.some(
    (h) => h.length === clean.length && h.every((seg, i) => clean[i] === seg)
  );
}

function isHidden(segments: string[]): boolean {
  const clean = segments.filter(Boolean);
  return HIDDEN_SEGMENTS.some(
    (h) => h.length === clean.length && h.every((seg, i) => clean[i] === seg)
  );
}

interface EdgeSwipeZoneProps {
  onSwipe: () => void;
  progress: SharedValue<number>;
  style: any;
  icon: string;
}

function EdgeSwipeZone({ onSwipe, progress, style, icon }: EdgeSwipeZoneProps) {
  const zoneStyle = useAnimatedStyle(
    () => ({ opacity: progress.value }),
    [progress]
  );

  const gesture = Gesture.Pan()
    .minDistance(40)
    .activeOffsetX([-25, 25])
    .onStart(() => {
      progress.value = withTiming(1, { duration: 80 });
    })
    .onEnd((e) => {
      const isSwipe =
        Math.abs(e.translationX) > 60 || Math.abs(e.velocityX) > 500;
      if (isSwipe) {
        runOnJS(onSwipe)();
      } else {
        progress.value = withSpring(0, { damping: 16, stiffness: 200, mass: 0.6 });
      }
    })
    .onFinalize(() => {});

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[style, zoneStyle]}>
        <Ionicons name={icon as any} size={22} color="rgba(255,255,255,0.9)" />
      </Animated.View>
    </GestureDetector>
  );
}

/**
 * Global "Back to Home" overlay.
 * - Android hardware back -> Home dashboard.
 * - Swipe from left/right edges -> Home dashboard.
 * - Floating Home button on every non-Home passenger page for one-tap return.
 */
export function BackToHome() {
  const { themeColors } = useApp();
  const goHome = useBackToHome();
  const segments = useSegments();
  const progress = useSharedValue(0);

  const isDriver = (segments as readonly string[]).includes('(driver)');
  const isAdmin = (segments as readonly string[]).includes('(admin)');
  const inTabs = (segments as readonly string[]).includes('(tabs)') || isDriver || isAdmin;
  const onHome = !isHome(segments) && !isHidden(segments);

  const animateHome = useCallback(() => {
    progress.value = withSpring(0, { damping: 16, stiffness: 200, mass: 0.6 });
    goHome();
  }, [goHome, progress]);

  const buttonStyle = useAnimatedStyle(() => {
    const s =
      1 + progress.value * 0.12;
    const r = `${progress.value * -180}deg`;
    return {
      transform: [{ scale: s }, { rotate: r }],
    };
  }, [progress]);

  const themed = useMemo(
    () => [styles.edgeLeft, styles.edgeRight],
    []
  );

  if (!onHome || isDriver || inTabs) return null;

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      {/* Left edge swipe -> Home */}
      <EdgeSwipeZone
        onSwipe={animateHome}
        progress={progress}
        style={themed[0]}
        icon="chevron-forward"
      />
      {/* Right edge swipe -> Home */}
      <EdgeSwipeZone
        onSwipe={animateHome}
        progress={progress}
        style={themed[1]}
        icon="chevron-back"
      />

      {/* Floating Home button */}
      <Animated.View
        style={[
          styles.homeBtnContainer,
          buttonStyle,
          Platform.OS === 'android' ? { bottom: 72 } : { bottom: 24 },
        ]}
      >
        <Pressable
          onPress={animateHome}
          style={[
            styles.homeBtn,
            { backgroundColor: themeColors.secondary, ...Shadows.medium },
          ]}
          android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
          hitSlop={8}
        >
          <Ionicons name="home" size={20} color="#FFFFFF" />
          <Text style={styles.homeBtnLabel}>Home</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 1000,
    elevation: 1000,
  },
  edgeLeft: {
    position: 'absolute',
    left: 0,
    top: '20%',
    bottom: '20%',
    width: 38,
    borderRadius: 6,
    backgroundColor: 'rgba(37, 99, 235, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  edgeRight: {
    position: 'absolute',
    right: 0,
    top: '20%',
    bottom: '20%',
    width: 38,
    borderRadius: 6,
    backgroundColor: 'rgba(37, 99, 235, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  edgeBottom: {
    position: 'absolute',
    left: '30%',
    right: '30%',
    bottom: 0,
    height: 42,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: 'rgba(37, 99, 235, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeBtnContainer: {
    position: 'absolute',
    right: 16,
    zIndex: 1001,
  },
  homeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
    gap: 8,
  },
  homeBtnLabel: {
    color: '#FFFFFF',
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold as any,
  },
});
