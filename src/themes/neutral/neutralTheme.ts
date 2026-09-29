import {
  defineTheme,
  defineSyntaxTheme,
  type TokenValue,
} from '@astryxdesign/core/theme';
import {neutralIconRegistry} from './icons';
import {neutralPaletteRefs} from './neutralPaletteRefs.generated';

const {blue, cyan, green, neutral, orange, pink, purple, red, teal, yellow} =
  neutralPaletteRefs;
const withAlpha = (color: string, alpha: string) => `${color}${alpha}`;

const neutralSyntax = defineSyntaxTheme({
  name: 'astryx-neutral',
  tokens: {
    keyword: [purple.light[30], purple.light[80]],
    string: [green.light[30], green.light[80]],
    comment: [neutral.light[45], neutral.dark[65]],
    number: [orange.light[30], orange.dark[80]],
    function: [blue.light[30], blue.dark[80]],
    type: [purple.light[30], purple.light[80]],
    variable: [neutral.light[5], neutral.dark[90]],
    operator: [neutral.light[45], neutral.dark[65]],
    constant: [orange.light[30], orange.dark[80]],
    tag: [red.light[30], red.dark[80]],
    attribute: [yellow.light[30], yellow.light[80]],
    property: [teal.light[30], teal.light[80]],
    punctuation: [neutral.light[45], neutral.dark[65]],
    background: [neutral.light[100], neutral.dark[5]],
  },
});

const neutralLocalTokens: Record<string, TokenValue> = {
  // Brand: Electric Blue primary, Cyan accent, Emerald success,
  // Amber warning, Red error (matches the 36Route brand palette).
  '--astryx-theme-neutral-color-status-fill-accent': ['#2563eb', '#60a5fa'],
  '--astryx-theme-neutral-color-status-fill-success': ['#10b981', '#34d399'],
  '--astryx-theme-neutral-color-status-fill-warning': '#f59e0b',
  '--astryx-theme-neutral-color-status-fill-error': ['#ef4444', '#f87171'],
  '--astryx-theme-neutral-color-status-muted-accent': [
    blue.light[85],
    withAlpha(blue.dark[75], '3D'),
  ],
  '--astryx-theme-neutral-color-on-tint-neutral': ['#fafafa4D', '#0a0a0a4D'],
  '--astryx-theme-neutral-color-on-tint-overlay-hover': [
    '#fafafa1A',
    '#0a0a0a1A',
  ],
  '--astryx-theme-neutral-color-on-tint-overlay-pressed': [
    '#fafafa33',
    '#0a0a0a33',
  ],
  '--astryx-theme-neutral-color-destructive-overlay-hover': [
    withAlpha(red.light[70], '0D'),
    withAlpha(red.dark[65], '0D'),
  ],
  '--astryx-theme-neutral-color-destructive-overlay-pressed': [
    withAlpha(red.light[70], '1A'),
    withAlpha(red.dark[65], '1A'),
  ],
};

const statusFill = {
  accent: 'var(--astryx-theme-neutral-color-status-fill-accent)',
  success: 'var(--astryx-theme-neutral-color-status-fill-success)',
  warning: 'var(--astryx-theme-neutral-color-status-fill-warning)',
  error: 'var(--astryx-theme-neutral-color-status-fill-error)',
} as const;

export const neutralTheme = defineTheme({
  name: 'neutral',
  localTokens: neutralLocalTokens,

  // Typography: Figtree across body, heading, and display sizes (display
  // size tokens inherit from heading.family). Monospace stays as the
  // platform default for code.
  // Scale: base=14, ratio=1.2. Bold weights on h3/h4 for subsection hierarchy.
  typography: {
    scale: {base: 14, ratio: 1.2},
    body: {
      family: 'Figtree',
      fallbacks:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    },
    heading: {
      family: 'Figtree',
      fallbacks:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      weights: {3: 'bold', 4: 'bold'},
    },
    code: {
      family: 'ui-monospace',
      fallbacks:
        '"SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
  },

  // Motion: snappier than default to match shadcn/Tailwind conventions.
  // Produces: fast-min=95ms, fast=125ms, fast-max=165ms,
  //           medium-min=225ms, medium=300ms, medium-max=400ms.
  motion: {fast: 125, medium: 300, slow: 700, ratio: 0.75},

  syntax: neutralSyntax,

  tokens: {
    '--color-background-surface': ['#ffffff', '#1e293b'],
    '--color-background-body': ['#f8fafc', '#0f172a'],
    '--color-background-card': ['#ffffff', '#1e293b'],
    '--color-background-popover': ['#ffffff', '#1e293b'],
    '--color-background-muted': ['#f1f5f9', '#1e293b'],

    // Brand accent: Electric Blue primary, Indigo deep accent, Cyan highlight.
    '--color-accent': ['#2563eb', '#60a5fa'],
    '--color-accent-muted': ['#4f46e5', '#818cf8'],
    '--color-neutral': [
      withAlpha(neutral.light[0], '0F'),
      withAlpha(neutral.dark[100], '1A'),
    ],

    // Overlays (modal scrims, hover/pressed tints)
    '--color-overlay': [
      withAlpha(neutral.light[0], '80'),
      withAlpha(neutral.dark[0], 'CC'),
    ],
    '--color-overlay-hover': [
      withAlpha(neutral.light[0], '0D'),
      withAlpha(neutral.dark[100], '0D'),
    ],
    '--color-overlay-pressed': [
      withAlpha(neutral.light[0], '1A'),
      withAlpha(neutral.dark[100], '1A'),
    ],

    // Text
    '--color-text-primary': ['#0f172a', '#f8fafc'],
    '--color-text-secondary': ['#64748b', '#cbd5e1'],
    '--color-text-disabled': ['#94a3b8', '#64748b'],
    '--color-text-accent': ['#2563eb', '#60a5fa'],
    '--color-on-dark': '#ffffff',
    '--color-on-light': '#0f172a',
    '--color-on-accent': '#ffffff',
    '--color-on-success': '#ffffff',
    '--color-on-error': '#ffffff',
    '--color-on-warning': '#0f172a',

    // Icon
    '--color-icon-accent': ['#2563eb', '#60a5fa'],
    '--color-icon-primary': ['#0f172a', '#f8fafc'],
    '--color-icon-secondary': ['#64748b', '#94a3b8'],
    '--color-icon-disabled': ['#94a3b8', '#64748b'],

    '--color-success': ['#10b981', '#34d399'],
    '--color-error': ['#ef4444', '#f87171'],
    '--color-warning': ['#f59e0b', '#fbbf24'],
    '--color-success-muted': [green.dark[85], withAlpha(green.light[75], '3D')],
    '--color-error-muted': [red.light[85], withAlpha(red.dark[75], '3D')],
    '--color-warning-muted': [
      yellow.dark[90],
      withAlpha(yellow.light[75], '3D'),
    ],

    '--color-border': ['#e2e8f0', '#334155'],
    '--color-border-emphasized': ['#cbd5e1', '#475569'],

    // Effects
    '--color-skeleton': ['#e2e8f0', '#475569'],
    '--color-shadow': [
      withAlpha('#0f172a', '1A'),
      withAlpha(neutral.dark[0], '4D'),
    ],
    '--color-tint-hover': ['black', 'white'],

    '--color-background-red': [red.light[85], red.dark[25]],
    '--color-border-red': [red.light[80], red.light[65]],
    '--color-icon-red': [red.light[30], red.dark[75]],
    '--color-text-red': [red.light[30], red.dark[80]],

    '--color-background-orange': [orange.light[85], orange.dark[25]],
    '--color-border-orange': [orange.light[85], orange.dark[65]],
    '--color-icon-orange': [orange.light[30], orange.light[75]],
    '--color-text-orange': [orange.light[30], orange.dark[80]],

    '--color-background-yellow': [yellow.dark[90], yellow.dark[25]],
    '--color-border-yellow': [yellow.dark[80], yellow.light[65]],
    '--color-icon-yellow': [yellow.light[30], yellow.light[75]],
    '--color-text-yellow': [yellow.light[30], yellow.light[80]],

    '--color-background-green': [green.dark[85], green.dark[25]],
    '--color-border-green': [green.dark[80], green.light[65]],
    '--color-icon-green': [green.light[30], green.light[75]],
    '--color-text-green': [green.light[30], green.light[75]],

    '--color-background-teal': [teal.light[85], teal.dark[25]],
    '--color-border-teal': [teal.light[80], teal.dark[65]],
    '--color-icon-teal': [teal.light[30], teal.dark[75]],
    '--color-text-teal': [teal.light[30], teal.light[80]],

    '--color-background-cyan': [cyan.dark[85], cyan.dark[25]],
    '--color-border-cyan': [cyan.dark[80], cyan.dark[65]],
    '--color-icon-cyan': [cyan.light[30], cyan.dark[75]],
    '--color-text-cyan': [cyan.light[30], cyan.dark[80]],

    '--color-background-blue': [blue.light[85], blue.dark[25]],
    '--color-border-blue': [blue.light[80], blue.dark[65]],
    '--color-icon-blue': [blue.light[30], blue.dark[75]],
    '--color-text-blue': [blue.light[30], blue.dark[80]],

    '--color-background-purple': [purple.light[90], purple.dark[25]],
    '--color-border-purple': [purple.light[85], purple.light[70]],
    '--color-icon-purple': [purple.light[30], purple.light[75]],
    '--color-text-purple': [purple.light[30], purple.dark[80]],

    '--color-background-pink': [pink.light[85], pink.dark[25]],
    '--color-border-pink': [pink.light[85], pink.light[70]],
    '--color-icon-pink': [pink.light[30], pink.dark[75]],
    '--color-text-pink': [pink.light[30], pink.dark[80]],

    '--color-background-gray': ['#f1f5f9', '#334155'],
    '--color-border-gray': ['#e2e8f0', '#475569'],
    '--color-icon-gray': ['#64748b', '#94a3b8'],
    '--color-text-gray': ['#0f172a', '#e2e8f0'],

    // =========================================================================
    // Radius — slightly larger than default (kept as-is)
    // --radius-none and --radius-full are always fixed and must never be
    // scaled by a theme (see defineTheme's radius config docs) — 0 and
    // 9999px respectively, matching @astryxdesign/core's own defaults.
    // =========================================================================
    '--radius-none': '0px',
    '--radius-inner': '0.375rem',
    '--radius-element': '0.625rem',
    '--radius-container': '0.75rem',
    '--radius-page': '1.75rem',
    '--radius-full': '9999px',

    // =========================================================================
    // Shadows
    //
    // Light mode: matches origin/main exactly (5%/10% low+med, 10%/15% high).
    // Subtle drops; light surfaces don't need rim highlights.
    //
    // Dark mode: deepened drops + an all-around 1px white inset that wraps
    // every edge ("Figma-style bezel"). The inset mimics ambient light
    // catching the surface's rim on every side, giving cards/popovers/modals
    // a substantial "lit from above" feel that drop shadows alone can't
    // achieve against a dark canvas.
    //   low  :  drops 25%/40% + 8%  white all-around inset
    //   med  :  drops 35%/50% + 12% white all-around inset
    //   high :  drops 50%/70% + 15% white all-around inset
    //
    // The inset layer uses light-dark(transparent, ...) so light mode is
    // unaffected — main's exact light values are preserved.
    // =========================================================================
    '--shadow-low':
      '0 2px 4px light-dark(oklch(0 0 0 / 5%), oklch(0 0 0 / 25%)), ' +
      '0 4px 8px light-dark(oklch(0 0 0 / 10%), oklch(0 0 0 / 40%)), ' +
      'inset 0 0 0 1px light-dark(transparent, oklch(1 0 0 / 8%))',
    '--shadow-med':
      '0 2px 4px light-dark(oklch(0 0 0 / 5%), oklch(0 0 0 / 35%)), ' +
      '0 4px 12px light-dark(oklch(0 0 0 / 10%), oklch(0 0 0 / 50%)), ' +
      'inset 0 0 0 1px light-dark(transparent, oklch(1 0 0 / 12%))',
    '--shadow-high':
      '0 4px 6px light-dark(oklch(0 0 0 / 10%), oklch(0 0 0 / 50%)), ' +
      '0 12px 24px light-dark(oklch(0 0 0 / 15%), oklch(0 0 0 / 70%)), ' +
      'inset 0 0 0 1px light-dark(transparent, oklch(1 0 0 / 15%))',
    '--shadow-inset-hover': `inset 0px 0px 0px 2px ${withAlpha('#2563eb', '4D')}`,
    '--shadow-inset-selected': `inset 0px 0px 0px 2px ${withAlpha('#2563eb', '80')}`,
    '--shadow-inset-success': `inset 0px 0px 0px 2px ${withAlpha('#10b981', '4D')}`,
    '--shadow-inset-warning': `inset 0px 0px 0px 2px ${withAlpha('#f59e0b', '4D')}`,
    '--shadow-inset-error': `inset 0px 0px 0px 2px ${withAlpha('#ef4444', '4D')}`,
  },

  components: {
    button: {
      'variant:destructive': {
        backgroundColor: 'var(--color-error-muted)',
        color: 'var(--color-error)',
        '--color-overlay-hover':
          'var(--astryx-theme-neutral-color-destructive-overlay-hover)',
        '--color-overlay-pressed':
          'var(--astryx-theme-neutral-color-destructive-overlay-pressed)',
      },
    },

    badge: {
      'variant:info': {
        backgroundColor: statusFill.accent,
        color: 'var(--color-on-accent)',
      },
      'variant:neutral': {
        backgroundColor: 'var(--color-background-gray)',
        color: 'var(--color-text-gray)',
      },
      'variant:success': {
        backgroundColor: statusFill.success,
        color: 'var(--color-on-success)',
      },
      'variant:warning': {
        backgroundColor: statusFill.warning,
        color: 'var(--color-on-warning)',
      },
      'variant:error': {
        backgroundColor: statusFill.error,
        color: 'var(--color-on-error)',
      },

      'variant:red': {
        backgroundColor: 'var(--color-background-red)',
        color: 'var(--color-text-red)',
      },
      'variant:orange': {
        backgroundColor: 'var(--color-background-orange)',
        color: 'var(--color-text-orange)',
      },
      'variant:yellow': {
        backgroundColor: 'var(--color-background-yellow)',
        color: 'var(--color-text-yellow)',
      },
      'variant:green': {
        backgroundColor: 'var(--color-background-green)',
        color: 'var(--color-text-green)',
      },
      'variant:teal': {
        backgroundColor: 'var(--color-background-teal)',
        color: 'var(--color-text-teal)',
      },
      'variant:cyan': {
        backgroundColor: 'var(--color-background-cyan)',
        color: 'var(--color-text-cyan)',
      },
      'variant:blue': {
        backgroundColor: 'var(--color-background-blue)',
        color: 'var(--color-text-blue)',
      },
      'variant:purple': {
        backgroundColor: 'var(--color-background-purple)',
        color: 'var(--color-text-purple)',
      },
      'variant:pink': {
        backgroundColor: 'var(--color-background-pink)',
        color: 'var(--color-text-pink)',
      },
      'variant:gray': {
        backgroundColor: 'var(--color-background-gray)',
        color: 'var(--color-text-gray)',
      },
    },

    statusdot: {
      'variant:success': {backgroundColor: statusFill.success},
      'variant:warning': {backgroundColor: statusFill.warning},
      'variant:error': {backgroundColor: statusFill.error},
      'variant:accent': {backgroundColor: statusFill.accent},
    },

    'avatar-status-dot': {
      'variant:success': {backgroundColor: statusFill.success},
      'variant:error': {backgroundColor: statusFill.error},
    },

    // Give the Neutral segmented control a roomier inset without changing its
    // outside height. The selected item stays flat against the tinted track.
    'segmented-control': {
      base: {
        padding: 'var(--spacing-1)',
      },
    },
    'segmented-control-item': {
      'size:sm': {
        height: 'calc(var(--size-element-sm) - 8px)',
      },
      'size:md': {
        height: 'calc(var(--size-element-md) - 8px)',
      },
      'size:lg': {
        height: 'calc(var(--size-element-lg) - 8px)',
      },
      selected: {
        boxShadow: 'none',
      },
    },

    banner: {
      base: {
        '--color-neutral': 'var(--astryx-theme-neutral-color-on-tint-neutral)',
        '--color-overlay-hover':
          'var(--astryx-theme-neutral-color-on-tint-overlay-hover)',
        '--color-overlay-pressed':
          'var(--astryx-theme-neutral-color-on-tint-overlay-pressed)',
      },
      'status:info': {
        '--color-accent-muted':
          'var(--astryx-theme-neutral-color-status-muted-accent)',
        '--color-text-primary': 'var(--color-text-blue)',
        '--color-text-secondary': 'var(--color-text-blue)',
        '--color-accent': 'var(--color-text-blue)',
      },
      'status:success': {
        '--color-text-primary': 'var(--color-text-green)',
        '--color-text-secondary': 'var(--color-text-green)',
        '--color-success': 'var(--color-text-green)',
      },
      'status:warning': {
        '--color-text-primary': 'var(--color-text-yellow)',
        '--color-text-secondary': 'var(--color-text-yellow)',
        '--color-warning': 'var(--color-text-yellow)',
      },
      'status:error': {
        '--color-text-primary': 'var(--color-text-red)',
        '--color-text-secondary': 'var(--color-text-red)',
        '--color-error': 'var(--color-text-red)',
      },
    },

    'step-indicator': {
      'status:accent': {'--color-accent': statusFill.accent},
      'status:success': {'--color-success': statusFill.success},
      'status:warning': {'--color-warning': statusFill.warning},
      'status:error': {'--color-error': statusFill.error},
    },

    switch: {
      base: {
        '--color-background-gray': 'var(--color-border-emphasized)',
      },
    },

    progressbar: {
      base: {
        '--color-background-muted': 'var(--color-border-emphasized)',
      },
      'variant:accent': {
        '--color-accent': statusFill.accent,
      },
      'variant:success': {
        '--color-success': statusFill.success,
      },
      'variant:warning': {
        '--color-warning': statusFill.warning,
      },
      'variant:error': {
        '--color-error': statusFill.error,
      },
    },

    card: {
      base: {
        padding: 'var(--spacing-3)',
      },
    },

    section: {
      base: {
        padding: 'var(--spacing-3)',
      },
    },

    // Heading and text component overrides are auto-generated by typography.scale.
    // h3/h4 bold weights come from typography.heading.weights above.
  },

  icons: neutralIconRegistry,
});
