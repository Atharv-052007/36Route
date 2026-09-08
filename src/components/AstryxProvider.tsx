import type {ReactNode} from 'react';

// Native Astryx provider: Astryx renders web DOM and must never load in a
// native bundle, so on iOS/Android this is a plain passthrough. The web build
// resolves AstryxProvider.web.tsx instead, which mounts the real Theme.
export function AstryxProvider({children}: {children: ReactNode}) {
  return <>{children}</>;
}
