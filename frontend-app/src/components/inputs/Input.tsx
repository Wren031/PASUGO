import { forwardRef } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';
import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightElement?: ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<TextInput, InputProps>(function Input(
  { label, error, leftIcon, rightElement, containerClassName, className, ...props },
  ref,
) {
  return (
    <View className={cn('gap-2', containerClassName)}>
      {label ? <Text className="px-1 text-[14px] font-semibold text-ink">{label}</Text> : null}
      <View
        className={cn(
          'min-h-[52px] flex-row items-center gap-2.5 rounded-2xl border bg-white px-4',
          error ? 'border-danger' : 'border-line',
        )}
      >
        {leftIcon}
        <TextInput
          ref={ref}
          placeholderTextColor="#94A3B8"
          className={cn('flex-1 py-0 text-[16px] text-ink', className)}
          {...props}
        />
        {rightElement}
      </View>
      {error ? <Text className="px-1 text-[12.5px] leading-4 text-danger">{error}</Text> : null}
    </View>
  );
});
