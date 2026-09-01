export const Colors = {
  light: {
    primary: '#1E3A8A', // Deep Blue / Indigo
    primaryLight: '#EFF6FF',
    primaryHover: '#1D4ED8',
    secondary: '#3B82F6', // Vibrant Indigo/Blue
    secondaryLight: '#DBEAFE',
    accent: '#10B981', // Emerald Emerald accent
    accentLight: '#D1FAE5',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    danger: '#EF4444',
    dangerLight: '#FEE2E2',
    background: '#F8FAFC',
    cardBackground: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    text: '#0F172A',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    shadowColor: '#0F172A',
    statusBar: 'dark' as 'dark' | 'light',
    backgroundElement: '#F1F5F9',
    backgroundSelected: '#DBEAFE',
  },
  dark: {
    primary: '#3B82F6',
    primaryLight: 'rgba(59, 130, 246, 0.15)',
    primaryHover: '#60A5FA',
    secondary: '#60A5FA',
    secondaryLight: 'rgba(96, 165, 250, 0.15)',
    accent: '#34D399',
    accentLight: 'rgba(52, 211, 153, 0.15)',
    warning: '#FBBF24',
    warningLight: 'rgba(251, 191, 36, 0.15)',
    danger: '#F87171',
    dangerLight: 'rgba(248, 113, 113, 0.15)',
    background: '#000000', // Pure AMOLED Black
    cardBackground: '#121212', // Deep Pitch Black Surface
    surfaceElevated: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#A1A1AA',
    textMuted: '#71717A',
    border: '#27272A',
    borderLight: '#18181B',
    shadowColor: '#000000',
    statusBar: 'light' as 'dark' | 'light',
    backgroundElement: '#18181B',
    backgroundSelected: '#27272A',
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
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const Fonts = {
  regular: 'System',
  medium: 'System',
  semibold: 'System',
  bold: 'System',
  mono: 'System',
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

export const Shadows = {
  small: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  large: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 8,
  },
};
