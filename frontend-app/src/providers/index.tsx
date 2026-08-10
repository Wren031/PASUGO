import type { ReactNode } from 'react';
import { NavigationContainer, type Theme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { queryClient } from '@/services/query-client';
import { colors } from '@/constants/theme';
import { RootNavigator } from '../navigation/RootNavigator';import { ToastHost } from '@/components/app/ToastHost';

const navigationTheme: Theme = {
  dark: false,
  colors: {
    primary: colors.primary,
    background: colors.surface,
    card: '#FFFFFF',
    text: colors.ink,
    border: '#E2E8F0',
    notification: colors.primary,
  },
  fonts: {
    regular: { fontFamily: 'System', fontWeight: '400' },
    medium: { fontFamily: 'System', fontWeight: '500' },
    bold: { fontFamily: 'System', fontWeight: '700' },
    heavy: { fontFamily: 'System', fontWeight: '800' },
  },
};

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="dark" />
          <NavigationContainer theme={navigationTheme}>{children}</NavigationContainer>
          <ToastHost />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export function AppRoot() {
  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
}
