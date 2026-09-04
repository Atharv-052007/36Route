export const Colors = {
  light: {
    // Primary - Soft Lime (headers, navbar, sidebar, active nav, buttons)
    primary: '#A8C63A',
    primaryLight: 'rgba(168, 198, 58, 0.14)',
    primaryHover: '#94AF2F',

    // Secondary - Live/Active Muted Green (route lines, links, accents, live)
    secondary: '#5F9F63',
    secondaryLight: 'rgba(95, 159, 99, 0.14)',

    // Success - Green (active, completed, available, safe)
    accent: '#5F9F63',
    accentLight: 'rgba(95, 159, 99, 0.14)',

    // Warning - Soft Amber (delayed, warning, pending)
    warning: '#D99A2B',
    warningLight: 'rgba(217, 154, 43, 0.16)',

    // Danger - Soft Red (SOS, emergency, cancel, critical alerts ONLY)
    danger: '#D9534F',
    dangerLight: 'rgba(217, 83, 79, 0.12)',

    // Background & Surface
    background: '#F7F8F6',
    cardBackground: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    backgroundElement: '#EDF0EB',
    backgroundSelected: 'rgba(168, 198, 58, 0.10)',

    // Text
    text: '#20251F',
    textSecondary: '#697169',
    textMuted: '#9AA29B',
    textInverse: '#FFFFFF',

    // Border
    border: '#E5E8E3',
    borderLight: '#EDF0EB',

    // Misc
    shadowColor: '#20251F',
    statusBar: 'dark' as 'dark' | 'light',

    // Extra semantic colors
    onTrip: '#5F9F63',
    onTripLight: 'rgba(95, 159, 99, 0.14)',
    onTripBorder: 'rgba(95, 159, 99, 0.3)',
    available: '#5F9F63',
    availableLight: 'rgba(95, 159, 99, 0.14)',
    availableBorder: 'rgba(95, 159, 99, 0.3)',
    assigned: '#3B82F6',
    assignedLight: 'rgba(59, 130, 246, 0.14)',
    assignedBorder: 'rgba(59, 130, 246, 0.3)',
    upcoming: '#8B5CF6',
    upcomingLight: 'rgba(139, 92, 246, 0.14)',
    upcomingBorder: 'rgba(139, 92, 246, 0.3)',
    completed: '#10B981',
    completedLight: 'rgba(16, 185, 129, 0.14)',
    completedBorder: 'rgba(16, 185, 129, 0.3)',
    warningBorder: 'rgba(217, 154, 43, 0.3)',
    dangerBorder: 'rgba(217, 83, 79, 0.3)',
    unavailable: '#6B7280',
    unavailableLight: 'rgba(107, 114, 128, 0.14)',
    unavailableBorder: 'rgba(107, 114, 128, 0.3)',
    maintenance: '#D99A2B',
    maintenanceLight: 'rgba(217, 154, 43, 0.16)',
    offline: '#9AA29B',
    offlineLight: '#EDF0EB',
    sosRed: '#D9534F',
  },
  dark: {
    // Primary - Soft Lime (slightly brighter for dark mode)
    primary: '#C3D65A',
    primaryLight: 'rgba(195, 214, 90, 0.16)',
    primaryHover: '#A8C63A',

    // Secondary - Muted Green (brighter for dark mode)
    secondary: '#7CB581',
    secondaryLight: 'rgba(124, 181, 129, 0.16)',

    // Success
    accent: '#7CB581',
    accentLight: 'rgba(124, 181, 129, 0.16)',

    // Warning
    warning: '#E0A941',
    warningLight: 'rgba(224, 169, 65, 0.16)',

    // Danger
    danger: '#DF6360',
    dangerLight: 'rgba(223, 99, 96, 0.14)',

    // Background & Surface - Dark Charcoal
    background: '#20251F',
    cardBackground: '#2A3029',
    surfaceElevated: '#323A32',
    backgroundElement: '#2A3029',
    backgroundSelected: 'rgba(195, 214, 90, 0.12)',

    // Text
    text: '#F2F4F1',
    textSecondary: '#B7BFB8',
    textMuted: '#7C857E',
    textInverse: '#20251F',

    // Border
    border: '#3A423A',
    borderLight: '#2A3029',

    // Misc
    shadowColor: '#000000',
    statusBar: 'light' as 'dark' | 'light',

    // Extra semantic colors
    onTrip: '#7CB581',
    onTripLight: 'rgba(124, 181, 129, 0.16)',
    onTripBorder: 'rgba(124, 181, 129, 0.3)',
    available: '#7CB581',
    availableLight: 'rgba(124, 181, 129, 0.16)',
    availableBorder: 'rgba(124, 181, 129, 0.3)',
    assigned: '#60A5FA',
    assignedLight: 'rgba(96, 165, 250, 0.16)',
    assignedBorder: 'rgba(96, 165, 250, 0.3)',
    upcoming: '#A78BFA',
    upcomingLight: 'rgba(167, 139, 250, 0.16)',
    upcomingBorder: 'rgba(139, 92, 246, 0.3)',
    completed: '#34D399',
    completedLight: 'rgba(52, 211, 153, 0.16)',
    completedBorder: 'rgba(52, 211, 153, 0.3)',
    warningBorder: 'rgba(224, 169, 65, 0.3)',
    dangerBorder: 'rgba(223, 99, 96, 0.3)',
    unavailable: '#9CA3AF',
    unavailableLight: 'rgba(156, 163, 175, 0.16)',
    unavailableBorder: 'rgba(156, 163, 175, 0.3)',
    maintenance: '#E0A941',
    maintenanceLight: 'rgba(224, 169, 65, 0.16)',
    offline: '#7C857E',
    offlineLight: 'rgba(124, 133, 126, 0.16)',
    sosRed: '#DF6360',
  },
};

export type ThemeColor = keyof typeof Colors.light;

export const Typography = {
  fontSizes: {
    xs: 12,
    sm: 13,
    md: 15,
    base: 15,
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
  base: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BottomTabInset = 60;
export const MaxContentWidth = 600;

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const Shadows = {
  subtle: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
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
