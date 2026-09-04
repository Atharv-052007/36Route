export const Colors = {
  light: {
    // 36Route Brand & Base
    brand: '#0F172A',         // 36Route deep slate base
    primary: '#0F172A',
    primaryLight: '#1E293B',
    primaryHover: '#334155',

    // Distinctive Brand Accent
    accent: '#2563EB',        // Clean professional route blue
    accentLight: '#EFF6FF',
    accentHover: '#1D4ED8',

    // Legacy aliases for backward compatibility
    secondary: '#2563EB',
    secondaryLight: '#EFF6FF',
    secondaryHover: '#1D4ED8',

    // Operational Status Semantics
    available: '#10B981',     // Available / Verified / Safe
    availableLight: '#ECFDF5',
    availableBorder: '#A7F3D0',

    onTrip: '#2563EB',        // On Trip / Active In-Transit
    onTripLight: '#EFF6FF',
    onTripBorder: '#BFDBFE',

    assigned: '#6366F1',      // Assigned / Driver Confirmed
    assignedLight: '#EEF2FF',
    assignedBorder: '#C7D2FE',

    upcoming: '#0284C7',      // Upcoming / Scheduled
    upcomingLight: '#F0F9FF',
    upcomingBorder: '#BAE6FD',

    completed: '#059669',     // Completed successfully
    completedLight: '#ECFDF5',
    completedBorder: '#A7F3D0',

    warning: '#F59E0B',       // Warning / Needs Attention
    warningLight: '#FFFBEB',
    warningBorder: '#FDE68A',

    danger: '#EF4444',        // Critical / Unavailable / Cancelled / Urgent
    dangerLight: '#FEF2F2',
    dangerBorder: '#FECACA',

    maintenance: '#D97706',   // Vehicle Maintenance
    maintenanceLight: '#FFFBEB',
    maintenanceBorder: '#FDE68A',

    unavailable: '#64748B',   // Driver / Vehicle Offline
    unavailableLight: '#F1F5F9',
    unavailableBorder: '#E2E8F0',

    offline: '#64748B',
    offlineLight: '#F1F5F9',
    sosRed: '#EF4444',

    // Background & Surfaces
    background: '#F8FAFC',
    cardBackground: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    backgroundElement: '#F1F5F9',
    backgroundSelected: '#E2E8F0',

    // Text Hierarchy
    text: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    textInverse: '#FFFFFF',

    // Borders & Dividers
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    borderDark: '#CBD5E1',

    // Misc
    shadowColor: '#0F172A',
    statusBar: 'dark' as 'dark' | 'light',
  },
  dark: {
    // 36Route Brand & Base
    brand: '#3B82F6',
    primary: '#F8FAFC',
    primaryLight: '#E2E8F0',
    primaryHover: '#CBD5E1',

    // Distinctive Brand Accent
    accent: '#3B82F6',
    accentLight: 'rgba(59, 130, 246, 0.15)',
    accentHover: '#60A5FA',

    // Legacy aliases
    secondary: '#3B82F6',
    secondaryLight: 'rgba(59, 130, 246, 0.15)',
    secondaryHover: '#60A5FA',

    // Operational Status Semantics
    available: '#34D399',
    availableLight: 'rgba(52, 211, 153, 0.15)',
    availableBorder: 'rgba(52, 211, 153, 0.3)',

    onTrip: '#60A5FA',
    onTripLight: 'rgba(96, 165, 250, 0.15)',
    onTripBorder: 'rgba(96, 165, 250, 0.3)',

    assigned: '#818CF8',
    assignedLight: 'rgba(129, 140, 248, 0.15)',
    assignedBorder: 'rgba(129, 140, 248, 0.3)',

    upcoming: '#38BDF8',
    upcomingLight: 'rgba(56, 189, 248, 0.15)',
    upcomingBorder: 'rgba(56, 189, 248, 0.3)',

    completed: '#34D399',
    completedLight: 'rgba(52, 211, 153, 0.15)',
    completedBorder: 'rgba(52, 211, 153, 0.3)',

    warning: '#FBBF24',
    warningLight: 'rgba(251, 191, 36, 0.15)',
    warningBorder: 'rgba(251, 191, 36, 0.3)',

    danger: '#F87171',
    dangerLight: 'rgba(248, 113, 113, 0.15)',
    dangerBorder: 'rgba(248, 113, 113, 0.3)',

    maintenance: '#FBBF24',
    maintenanceLight: 'rgba(251, 191, 36, 0.15)',
    maintenanceBorder: 'rgba(251, 191, 36, 0.3)',

    unavailable: '#94A3B8',
    unavailableLight: 'rgba(148, 163, 184, 0.15)',
    unavailableBorder: 'rgba(148, 163, 184, 0.3)',

    offline: '#94A3B8',
    offlineLight: 'rgba(148, 163, 184, 0.15)',
    sosRed: '#F87171',

    // Background & Surfaces
    background: '#090D16',
    cardBackground: '#131B2E',
    surfaceElevated: '#1E293B',
    backgroundElement: '#1A2338',
    backgroundSelected: '#25324D',

    // Text Hierarchy
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    textInverse: '#0F172A',

    // Borders & Dividers
    border: '#1E293B',
    borderLight: '#162032',
    borderDark: '#334155',

    // Misc
    shadowColor: '#000000',
    statusBar: 'light' as 'dark' | 'light',
  },
};

export type ThemeColor = keyof typeof Colors.light;

export const Typography = {
  fontSizes: {
    xs: 11,
    sm: 13,
    md: 14,
    base: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    hero: 30,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  // legacy aliases
  half: 4,
  one: 8,
  two: 16,
  three: 24,
  four: 32,
  five: 40,
  six: 48,
};

export const BorderRadius = {
  xs: 4,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  full: 9999,
};

export const Shadows = {
  subtle: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  card: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  elevated: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  // legacy aliases
  small: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  medium: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  large: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
};

export const Fonts = {
  regular: 'Inter',
  medium: 'Inter',
  semibold: 'Inter',
  bold: 'Inter',
  mono: 'Inter',
};


