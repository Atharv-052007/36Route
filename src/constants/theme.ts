export const Colors = {
  light: {
    // Primary - Deep Navy (headers, navbar, sidebar)
    primary: '#0B1220',
    primaryLight: '#1A2744',
    primaryHover: '#162036',

    // Accent - Route Blue (buttons, active nav, route lines, links)
    secondary: '#2563EB',
    secondaryLight: '#EFF6FF',

    // Success - Green (active, completed, available, safe)
    accent: '#22C55E',
    accentLight: '#DCFCE7',

    // Warning - Amber (delayed, warning, pending)
    warning: '#F59E0B',
    warningLight: '#FEF3C7',

    // Danger - Red (SOS, emergency, cancel, critical alerts ONLY)
    danger: '#EF4444',
    dangerLight: '#FEE2E2',

    // Background & Surface
    background: '#F8FAFC',
    cardBackground: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    backgroundElement: '#F1F5F9',
    backgroundSelected: '#DBEAFE',

    // Text
    text: '#0F172A',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',

    // Border
    border: '#E2E8F0',
    borderLight: '#F1F5F9',

    // Misc
    shadowColor: '#0F172A',
    statusBar: 'dark' as 'dark' | 'light',

    // Extra semantic colors
    onTrip: '#2563EB',
    onTripLight: '#EFF6FF',
    available: '#22C55E',
    availableLight: '#DCFCE7',
    maintenance: '#F59E0B',
    maintenanceLight: '#FEF3C7',
    offline: '#94A3B8',
    offlineLight: '#F1F5F9',
    sosRed: '#EF4444',
  },
  dark: {
    // Primary - Deep Navy (lighter for dark mode)
    primary: '#3B82F6',
    primaryLight: 'rgba(59, 130, 246, 0.15)',
    primaryHover: '#60A5FA',

    // Accent - Route Blue
    secondary: '#60A5FA',
    secondaryLight: 'rgba(96, 165, 250, 0.15)',

    // Success
    accent: '#4ADE80',
    accentLight: 'rgba(74, 222, 128, 0.15)',

    // Warning
    warning: '#FBBF24',
    warningLight: 'rgba(251, 191, 36, 0.15)',

    // Danger
    danger: '#F87171',
    dangerLight: 'rgba(248, 113, 113, 0.15)',

    // Background & Surface
    background: '#000000',
    cardBackground: '#121212',
    surfaceElevated: '#1E1E1E',
    backgroundElement: '#18181B',
    backgroundSelected: '#27272A',

    // Text
    text: '#FFFFFF',
    textSecondary: '#A1A1AA',
    textMuted: '#71717A',

    // Border
    border: '#27272A',
    borderLight: '#18181B',

    // Misc
    shadowColor: '#000000',
    statusBar: 'light' as 'dark' | 'light',

    // Extra semantic colors
    onTrip: '#60A5FA',
    onTripLight: 'rgba(96, 165, 250, 0.15)',
    available: '#4ADE80',
    availableLight: 'rgba(74, 222, 128, 0.15)',
    maintenance: '#FBBF24',
    maintenanceLight: 'rgba(251, 191, 36, 0.15)',
    offline: '#71717A',
    offlineLight: 'rgba(113, 113, 122, 0.15)',
    sosRed: '#F87171',
  },
};

export type ThemeColor = keyof typeof Colors.light;

export const Typography = {
  fontSizes: {
    xs: 12,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 22,
    xxl: 28,
    hero: 32,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const Fonts = {
  regular: 'Inter',
  medium: 'Inter',
  semibold: 'Inter',
  bold: 'Inter',
  mono: 'Inter',
};

export const Spacing = {
  half: 4,
  one: 8,
  two: 16,
  three: 24,
  four: 32,
  five: 40,
  six: 48,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const BottomTabInset = 60;
export const MaxContentWidth = 600;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const Shadows = {
  small: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  large: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 8,
  },
};
