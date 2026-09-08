import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { BorderRadius, Typography, Shadows } from '../../constants/theme';

interface MapViewAbstractionProps {
  eta?: string;
  onRefresh?: () => void;
}

export const MapViewAbstraction: React.FC<MapViewAbstractionProps> = ({
  eta,
  onRefresh,
}) => {
  const { themeColors, isDarkMode } = useApp();
  const isDark = isDarkMode;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? themeColors.cardBackground : themeColors.backgroundElement,
          borderRadius: BorderRadius.lg,
        },
      ]}
    >
      {/* Grid lines */}
      <View style={[styles.gridH, { top: '25%', backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}]} />
      <View style={[styles.gridH, { top: '50%', backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}]} />
      <View style={[styles.gridH, { top: '75%', backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}]} />
      <View style={[styles.gridV, { left: '25%', backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}]} />
      <View style={[styles.gridV, { left: '50%', backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}]} />
      <View style={[styles.gridV, { left: '75%', backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}]} />

      {/* Main road */}
      <View
        style={[
          styles.road,
          {
            backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
          },
        ]}
      />

      {/* Route line */}
      <View style={[styles.routeLine, { borderColor: themeColors.secondary }]} />

      {/* Pickup pin */}
      <View style={[styles.pin, { top: '25%', left: '20%', backgroundColor: themeColors.accent }]}>
        <Ionicons name="location" size={16} color={themeColors.textInverse} />
      </View>
      <View style={[styles.pinLabel, { top: '19%', left: '14%', backgroundColor: themeColors.accentLight }]}>
        <Text style={[styles.pinLabelText, { color: themeColors.accent }]}>Pickup</Text>
      </View>

      {/* Vehicle marker with static halo */}
      <View style={[styles.vehicleWrap, { top: '48%', left: '48%' }]}>
        <View style={[styles.vehiclePulse, { backgroundColor: themeColors.secondary, opacity: 0.3 }]} />
        <View style={[styles.vehicleMarker, { backgroundColor: themeColors.secondary }]}>
          <Ionicons name="car-sport" size={18} color={themeColors.textInverse} />
        </View>
      </View>

      {/* Drop pin */}
      <View style={[styles.pin, { top: '70%', left: '75%', backgroundColor: themeColors.secondary }]}>
        <Ionicons name="flag" size={14} color={themeColors.textInverse} />
      </View>
      <View style={[styles.pinLabel, { top: '64%', left: '68%', backgroundColor: themeColors.secondaryLight }]}>
        <Text style={[styles.pinLabelText, { color: themeColors.secondary }]}>Drop</Text>
      </View>

      {/* ETA pill */}
      {eta && (
        <View style={[styles.etaPill, { backgroundColor: themeColors.cardBackground, ...Shadows.small }]}>
          <Ionicons name="time" size={14} color={themeColors.secondary} />
          <Text style={[styles.etaText, { color: themeColors.text }]}>{eta}</Text>
        </View>
      )}

      {/* Refresh button */}
      {onRefresh && (
        <TouchableOpacity
          onPress={onRefresh}
          style={[styles.refreshBtn, { backgroundColor: themeColors.cardBackground, ...Shadows.small }]}
          activeOpacity={0.7}
        >
          <Ionicons name="refresh" size={18} color={themeColors.textSecondary} />
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
    top: '40%',
    left: '-10%',
    width: '120%',
    height: 60,
    transform: [{ rotate: '-25deg' }],
    borderRadius: 8,
  },
  routeLine: {
    position: 'absolute',
    top: '30%',
    left: '25%',
    width: '55%',
    height: 0,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 1,
    transform: [{ rotate: '35deg' }],
  },
  pin: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.small,
  },
  pinLabel: {
    position: 'absolute',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  pinLabelText: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.weights.semibold as any,
  },
  vehicleWrap: {
    position: 'absolute',
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehiclePulse: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
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
  },
});
