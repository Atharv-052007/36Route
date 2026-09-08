export const Colors = {
  light: {
    // Primary - Neutral accent (neutral.light[15]); was Soft Lime. Tracks
    // Astryx neutral --color-accent so native matches the web theme.
    primary: '#262626',
    primaryLight: 'rgba(38, 38, 38, 0.08)',
    primaryHover: '#111111',

    // Secondary - Neutral text-secondary (neutral.light[35])
    secondary: '#525252',
    secondaryLight: 'rgba(82, 82, 82, 0.10)',

    // Success - status green (neutral theme keeps standard status hues)
    accent: '#198100',
    accentLight: 'rgba(25, 129, 0, 0.10)',

    // Warning - Soft Amber (delayed, warning, pending)
    warning: '#D99A2B',
    warningLight: 'rgba(217, 154, 43, 0.16)',

    // Danger - Soft Red (SOS, emergency, cancel, critical alerts ONLY)
    danger: '#C9303A',
    dangerLight: 'rgba(201, 48, 58, 0.10)',

    // Background & Surface - neutral ramp (95 body, 100 cards)
    background: '#F1F1F1',
    cardBackground: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    backgroundElement: '#E2E2E2',
    backgroundSelected: 'rgba(0, 0, 0, 0.05)',

    // Text - neutral ramp (5 / 35 / 65)
    text: '#111111',
    textSecondary: '#525252',
    textMuted: '#9E9E9E',
    textInverse: '#FFFFFF',

    // Border
    border: '#D4D4D4',
    borderLight: '#E2E2E2',

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
    // Primary - Neutral accent for dark (neutral.dark[95]); was lime.
    primary: '#F1F1F1',
    primaryLight: 'rgba(241, 241, 241, 0.12)',
    primaryHover: '#FFFFFF',

    // Secondary - neutral.dark[65]
    secondary: '#9E9E9E',
    secondaryLight: 'rgba(158, 158, 158, 0.14)',

    // Success
    accent: '#64AF4C',
    accentLight: 'rgba(100, 175, 76, 0.14)',

    // Warning
    warning: '#E0A941',
    warningLight: 'rgba(224, 169, 65, 0.16)',

    // Danger
    danger: '#FF705D',
    dangerLight: 'rgba(255, 112, 93, 0.14)',

    // Background & Surface - neutral dark ramp (10 body, 15/20 surfaces)
    background: '#1B1B1B',
    cardBackground: '#262626',
    surfaceElevated: '#303030',
    backgroundElement: '#262626',
    backgroundSelected: 'rgba(255, 255, 255, 0.08)',

    // Text - neutral dark ramp (100 / 75 / 55)
    text: '#FAFAFA',
    textSecondary: '#B9B9B9',
    textMuted: '#848484',
    textInverse: '#111111',

    // Border
    border: '#3B3B3B',
    borderLight: '#262626',

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
