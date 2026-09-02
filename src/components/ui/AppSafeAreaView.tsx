import React from 'react';
import { View, StyleSheet, Platform, StatusBar, ViewProps } from 'react-native';
import { useSafeAreaInsets, Edge } from 'react-native-safe-area-context';

export interface AppSafeAreaViewProps extends ViewProps {
  children?: React.ReactNode;
  edges?: Edge[];
}

export function AppSafeAreaView({
  children,
  style,
  edges = ['top', 'bottom'],
  ...rest
}: AppSafeAreaViewProps) {
  const insets = useSafeAreaInsets();

  // On Android, if insets.top is 0 due to non-edge-to-edge windowing, fall back to StatusBar.currentHeight
  const statusBarHeight = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0;
  const top = edges.includes('top') ? Math.max(insets.top, statusBarHeight) : 0;
  const bottom = edges.includes('bottom') ? insets.bottom : 0;
  const left = edges.includes('left') ? insets.left : 0;
  const right = edges.includes('right') ? insets.right : 0;

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: top,
          paddingBottom: bottom,
          paddingLeft: left,
          paddingRight: right,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AppSafeAreaView;
