import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { Typography, Shadows } from '../../constants/theme';
import { Ride } from '../../types';

interface MapViewProps {
  ride: Ride;
  onRefresh?: () => void;
}

export const MapViewAbstraction: React.FC<MapViewProps> = ({ ride, onRefresh }) => {
  const { themeColors, isDarkMode } = useApp();

  return (
    <View style={styles.container}>
      {/* Visual Canvas Representation of Map */}
      <View style={[styles.mapCanvas, { backgroundColor: isDarkMode ? '#0F172A' : '#E2E8F0' }]}>
        {/* Map Grid Roads Visualization */}
        <View style={styles.gridLinesHorizontal} />
        <View style={styles.gridLinesVertical} />
        <View style={[styles.mainRoad, { backgroundColor: isDarkMode ? '#334155' : '#CBD5E1' }]} />
        <View style={[styles.routeLine, { borderColor: themeColors.primary }]} />

        {/* Pickup Pin */}
        <View style={[styles.pinContainer, { top: '25%', left: '20%' }]}>
          <View style={[styles.pinBadge, { backgroundColor: themeColors.accent }]}>
            <Text style={styles.pinText}>Pickup</Text>
          </View>
          <View style={[styles.pinDot, { backgroundColor: themeColors.accent }]} />
        </View>

        {/* Moving Vehicle Marker */}
        <View style={[styles.vehicleMarker, { top: '48%', left: '48%', backgroundColor: themeColors.primary }, Shadows.medium]}>
          <Ionicons name="car-sport" size={20} color="#FFFFFF" />
        </View>

        {/* Drop Destination Pin */}
        <View style={[styles.pinContainer, { top: '70%', left: '75%' }]}>
          <View style={[styles.pinBadge, { backgroundColor: themeColors.danger }]}>
            <Text style={styles.pinText}>Drop</Text>
          </View>
          <View style={[styles.pinDot, { backgroundColor: themeColors.danger }]} />
        </View>

        {/* Map Overlay Floating Info Pill */}
        <View style={[styles.etaPill, { backgroundColor: themeColors.cardBackground }, Shadows.medium]}>
          <Ionicons name="time-outline" size={16} color={themeColors.primary} />
          <Text style={[styles.etaPillText, { color: themeColors.text }]}>
            ETA: <Text style={{ color: themeColors.primary, fontWeight: '700' }}>{ride.eta || '12 mins'}</Text>
          </Text>
        </View>

        {/* Map Controls */}
        {onRefresh && (
          <TouchableOpacity
            style={[styles.refreshBtn, { backgroundColor: themeColors.cardBackground }, Shadows.medium]}
            onPress={onRefresh}
          >
            <Ionicons name="refresh-outline" size={20} color={themeColors.text} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 320,
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
  },
  mapCanvas: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridLinesHorizontal: {
    position: 'absolute',
    top: '35%',
    left: 0,
    right: 0,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  gridLinesVertical: {
    position: 'absolute',
    left: '45%',
    top: 0,
    bottom: 0,
    width: 24,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  mainRoad: {
    position: 'absolute',
    width: '90%',
    height: 60,
    transform: [{ rotate: '-25deg' }],
    borderRadius: 30,
  },
  routeLine: {
    position: 'absolute',
    width: '80%',
    height: 120,
    borderWidth: 4,
    borderStyle: 'dashed',
    borderRadius: 60,
    transform: [{ rotate: '-20deg' }],
  },
  pinContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  pinBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  pinText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: Typography.weights.bold as any,
  },
  pinDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 2,
  },
  vehicleMarker: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  etaPill: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  etaPillText: {
    fontSize: Typography.fontSizes.xs,
    marginLeft: 6,
    fontWeight: Typography.weights.semibold as any,
  },
  refreshBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
