import { Text, View } from 'react-native';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Logo } from '@/components/ui/Logo';
import { IconButton } from '@/components/buttons/IconButton';
import { KeyboardDismissButton } from '@/components/ui/KeyboardDismissButton';
import React from 'react';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  onBack?: () => void;
}

export function AuthLayout({ title, subtitle, children, onBack }: AuthLayoutProps) {
  return (
    <SafeAreaView className="flex-1 bg-surface-muted">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <View className="flex-1 px-6 pb-8 pt-12">
          {onBack ? (
            <IconButton
              icon={<Feather name="arrow-left" size={22} color="#0F172A" />}
              onPress={onBack}
              accessibilityLabel="Go back"
              className="mb-6 -ml-3"
            />
          ) : null}
          <Logo size="md" className="mb-9" />
          <Text className="text-[30px] font-extrabold leading-9 tracking-tight text-ink">{title}</Text>
          <Text className="mt-2 text-[15px] leading-6 text-ink-secondary">{subtitle}</Text>
          <View className="mt-8 flex-1">{children}</View>
        </View>
      </KeyboardAvoidingView>
      <KeyboardDismissButton />
    </SafeAreaView>
  );
}
