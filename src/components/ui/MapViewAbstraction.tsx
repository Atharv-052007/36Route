import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';
import { BorderRadius, Typography, Shadows, Colors } from '@/constants/theme';

interface MapViewAbstractionProps {
  eta?: string;
  onRefresh?: () => void;
}

export const MapViewAbstraction: React.FC<MapViewAbstractionProps> = ({
  eta,
  onRefresh,
}) => {
  const { isDarkMode } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;
  const radarAnim = useRef(new Animated.Value(0)).current;
  const radarAnim2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop1 = Animated.loop(
      Animated.sequence([
        Animated.timing(radarAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(radarAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );
    const loop2 = Animated.loop(
      Animated.sequence([
        Animated.delay(666),
        Animated.timing(radarAnim2, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(radarAnim2, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );
    loop1.start();
    loop2.start();
    return () => {
      loop1.stop();
      loop2.stop();
    };
  }, [radarAnim, radarAnim2]);

  const radarScale1 = radarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2.8],
  });
  const radarOpacity1 = radarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0],
  });
  const radarScale2 = radarAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2.8],
  });
  const radarOpacity2 = radarAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0],
  });

  const gridColor = isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)';
  const roadColor = isDarkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode ? theme.cardBackground : theme.backgroundElement,
          borderRadius: BorderRadius.lg,
        },
      ]}
    >
      {/* Grid lines */}
      <View style={[styles.gridH, { top: '25%', backgroundColor: gridColor }]} />
      <View style={[styles.gridH, { top: '50%', backgroundColor: gridColor }]} />
      <View style={[styles.gridH, { top: '75%', backgroundColor: gridColor }]} />
      <View style={[styles.gridV, { left: '25%', backgroundColor: gridColor }]} />
      <View style={[styles.gridV, { left: '50%', backgroundColor: gridColor }]} />
      <View style={[styles.gridV, { left: '75%', backgroundColor: gridColor }]} />

      {/* Main road */}
      <View style={[styles.road, { backgroundColor: roadColor }]} />

      {/* Route line - solid */}
      <View style={[styles.routeLine, { backgroundColor: theme.secondary }]} />

      {/* Pickup pin */}
      <View style={[styles.pinWrap, { top: '22%', left: '17%' }]}>
        <View style={[styles.pinShadow, { backgroundColor: theme.accent, opacity: 0.15 }]} />
        <View style={[styles.pin, { backgroundColor: theme.accent }]}>
          <Ionicons name="location" size={14} color={theme.textInverse} />
        </View>
      </View>
      <View style={[styles.pinLabel, { top: '15%', left: '10%', backgroundColor: theme.accentLight }]}>
        <Text style={[styles.pinLabelText, { color: theme.accent }]}>Pickup</Text>
      </View>

      {/* Vehicle marker with pulsing radar */}
      <View style={[styles.vehicleWrap, { top: '46%', left: '46%' }]}>
        <Animated.View
          style={[
            styles.radarRing,
            {
              borderColor: theme.secondary,
              transform: [{ scale: radarScale1 }],
              opacity: radarOpacity1,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.radarRing,
            {
              borderColor: theme.secondary,
              transform: [{ scale: radarScale2 }],
              opacity: radarOpacity2,
            },
          ]}
        />
        <View style={[styles.vehicleMarker, { backgroundColor: theme.secondary }]}>
          <Ionicons name="car-sport" size={16} color={theme.textInverse} />
        </View>
      </View>

      {/* Drop pin */}
      <View style={[styles.pinWrap, { top: '72%', left: '76%' }]}>
        <View style={[styles.pinShadow, { backgroundColor: theme.primary, opacity: 0.15 }]} />
        <View style={[styles.pin, { backgroundColor: theme.primary }]}>
          <Ionicons name="flag" size={13} color={theme.textInverse} />
        </View>
      </View>
      <View style={[styles.pinLabel, { top: '65%', left: '68%', backgroundColor: theme.primaryLight }]}>
        <Text style={[styles.pinLabelText, { color: theme.primary }]}>Drop</Text>
      </View>

      {/* ETA pill */}
      {eta && (
        <View style={[styles.etaPill, { backgroundColor: `${theme.cardBackground}E6` }]}>
          <Ionicons name="time" size={13} color={theme.secondary} />
          <Text style={[styles.etaText, { color: theme.text }]}>{eta}</Text>
        </View>
      )}

      {/* Refresh button */}
      {onRefresh && (
        <TouchableOpacity
          onPress={onRefresh}
          style={[styles.refreshBtn, { backgroundColor: `${theme.cardBackground}E6` }]}
          activeOpacity={0.7}
        >
          <Ionicons name="refresh" size={17} color={theme.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 320,
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  gridH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
  },
  gridV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
  },
  road: {
    position: 'absolute',
    top: '38%',
    left: '-10%',
    width: '120%',
    height: 56,
    transform: [{ rotate: '-25deg' }],
    borderRadius: BorderRadius.sm,
  },
  routeLine: {
    position: 'absolute',
    top: '28%',
    left: '23%',
    width: '57%',
    height: 2.5,
    borderRadius: 2,
    transform: [{ rotate: '35deg' }],
  },
  pinWrap: {
    position: 'absolute',
  },
  pin: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.medium,
  },
  pinShadow: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    top: 4,
    left: 2,
  },
  pinLabel: {
    position: 'absolute',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  pinLabelText: {
    fontSize: 10,
    fontWeight: Typography.weights.semibold as any,
    letterSpacing: 0.3,
  },
  vehicleWrap: {
    position: 'absolute',
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radarRing: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
  },
  vehicleMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.medium,
  },
  etaPill: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    gap: 6,
    ...Shadows.small,
  },
  etaText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.weights.semibold as any,
  },
  refreshBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.small,
  },
});
