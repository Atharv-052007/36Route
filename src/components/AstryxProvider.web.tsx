import type {ReactNode} from 'react';
import {Theme} from '@astryxdesign/core';
import {neutralTheme} from '@/themes/neutral/neutralTheme';

// Web-only Astryx provider (Metro resolves *.web.tsx on web, so the native
// bundle never imports @astryxdesign/core). Uses the editable local neutral
// copy at src/themes/neutral — edit neutralTheme.ts to make it your own.
// Source-theme import uses runtime style injection: no build step needed.
// For the pre-built CSS fast path, also import the stylesheets on web:
//   import '@astryxdesign/core/reset.css';
//   import '@astryxdesign/core/astryx.css';
//   import '@astryxdesign/theme-neutral/theme.css';
export function AstryxProvider({children}: {children: ReactNode}) {
  return <Theme theme={neutralTheme}>{children}</Theme>;
}
