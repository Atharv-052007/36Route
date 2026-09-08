import React, { useCallback, useMemo } from 'react';
import { View, Pressable, StyleSheet, Platform, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
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
  style: any;
  icon: string;
}

function EdgeSwipeZone({ onSwipe, style, icon }: EdgeSwipeZoneProps) {
  const gesture = Gesture.Pan()
    .minDistance(40)
    .activeOffsetX([-25, 25])
    .onEnd((e) => {
      const isSwipe =
        Math.abs(e.translationX) > 60 || Math.abs(e.velocityX) > 500;
      if (isSwipe) {
        onSwipe();
      }
    })
    .onFinalize(() => {});

  return (
    <GestureDetector gesture={gesture}>
      <View style={style}>
        <Ionicons name={icon as any} size={22} color="rgba(255,255,255,0.9)" />
      </View>
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

  const isDriver = (segments as readonly string[]).includes('(driver)');
  const isAdmin = (segments as readonly string[]).includes('(admin)');
  const inTabs = (segments as readonly string[]).includes('(tabs)') || isDriver || isAdmin;
  const onHome = !isHome(segments) && !isHidden(segments);

  const animateHome = useCallback(() => {
    goHome();
  }, [goHome]);

  const themed = useMemo(
    () => [
      [styles.edgeLeft, { backgroundColor: themeColors.secondary }],
      [styles.edgeRight, { backgroundColor: themeColors.secondary }],
    ],
    [themeColors.secondary]
  );

  if (!onHome || isDriver || inTabs) return null;

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      {/* Left edge swipe -> Home */}
      <EdgeSwipeZone
        onSwipe={animateHome}
        style={themed[0]}
        icon="chevron-forward"
      />
      {/* Right edge swipe -> Home */}
      <EdgeSwipeZone
        onSwipe={animateHome}
        style={themed[1]}
        icon="chevron-back"
      />

      {/* Floating Home button */}
      <View
        style={[
          styles.homeBtnContainer,
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
          <Ionicons name="home" size={20} color={themeColors.textInverse} />
          <Text style={[styles.homeBtnLabel, { color: themeColors.textInverse }]}>Home</Text>
        </Pressable>
      </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  edgeRight: {
    position: 'absolute',
    right: 0,
    top: '20%',
    bottom: '20%',
    width: 38,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  edgeBottom: {
    position: 'absolute',
    left: '30%',
    right: '30%',
    bottom: 0,
    height: 42,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
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
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold as any,
  },
});
