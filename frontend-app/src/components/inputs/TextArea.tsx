import { forwardRef } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';
import { cn } from '@/utils/cn';

interface TextAreaProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export const TextArea = forwardRef<TextInput, TextAreaProps>(function TextArea(
  { label, error, containerClassName, className, ...props },
  ref,
) {
  return (
    <View className={cn('gap-2', containerClassName)}>
      {label ? <Text className="px-1 text-[14px] font-semibold text-ink">{label}</Text> : null}
      <View
        className={cn(
          'rounded-2xl border bg-white px-4 py-3',
          error ? 'border-danger' : 'border-line',
        )}
      >
        <TextInput
          ref={ref}
          placeholderTextColor="#94A3B8"
          multiline
          className={cn('min-h-[96px] text-[16px] leading-6 text-ink', className)}
          {...props}
        />
      </View>
      {error ? <Text className="px-1 text-[12.5px] leading-4 text-danger">{error}</Text> : null}
    </View>
  );
});
