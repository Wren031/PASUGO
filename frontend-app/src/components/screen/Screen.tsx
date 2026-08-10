import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { cn } from '@/utils/cn';
import { KeyboardDismissButton } from '@/components/ui/KeyboardDismissButton';

interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  edges?: Edge[];
  bgClassName?: string;
  contentClassName?: string;
  keyboardAvoiding?: boolean;
}

export function Screen({
  children,
  scroll = false,
  edges = ['top'],
  bgClassName = 'bg-surface-muted',
  contentClassName,
  keyboardAvoiding = false,
}: ScreenProps) {
  const content = scroll ? (
    <ScrollView
      className={cn('flex-1', contentClassName)}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
    >
      {children}
    </ScrollView>
  ) : (
    <View className={cn('flex-1', contentClassName)}>{children}</View>
  );

  return (
    <SafeAreaView edges={edges} className={cn('flex-1', bgClassName)}>
      {keyboardAvoiding ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          {content}
        </KeyboardAvoidingView>
      ) : (
        content
      )}
      <KeyboardDismissButton />
    </SafeAreaView>
  );
}
