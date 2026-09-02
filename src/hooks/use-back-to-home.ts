import { useCallback, useEffect, useRef } from 'react';
import { BackHandler, Platform } from 'react-native';
import { useRouter, useSegments } from 'expo-router';

const HOME_SEGMENTS: string[][] = [
  [],
  ['(tabs)'],
  ['(tabs)', 'index'],
];

// Screens where the back action should behave natively (e.g. exit app),
// not redirect to Home.
const NATIVE_BACK_SEGMENTS: string[][] = [['login']];

function isHome(segments: string[]): boolean {
  const clean = segments.filter(Boolean);
  return HOME_SEGMENTS.some(
    (h) => h.length === clean.length && h.every((seg, i) => clean[i] === seg)
  );
}

function isNativeBack(segments: string[]): boolean {
  const clean = segments.filter(Boolean);
  return NATIVE_BACK_SEGMENTS.some(
    (h) => h.length === clean.length && h.every((seg, i) => clean[i] === seg)
  );
}

/**
 * Redirects every "back" action (hardware back / swipe gesture /
 * header back) to the Home dashboard. Returns true if consumption
 * is handled, false otherwise (e.g. already on Home -> allow exit).
 */
export function useBackToHome() {
  const router = useRouter();
  const segments = useSegments();
  const lastHandledRef = useRef(0);

  const goHome = useCallback((): boolean => {
    if (isHome(segments) || isNativeBack(segments)) return false;

    const now = Date.now();
    if (now - lastHandledRef.current < 400) return true; // debounce gestures
    lastHandledRef.current = now;

    router.dismissTo('/(tabs)');
    return true;
  }, [segments, router]);

  // Android hardware back button
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const sub = BackHandler.addEventListener('hardwareBackPress', goHome);
    return () => sub.remove();
  }, [goHome]);

  return goHome;
}