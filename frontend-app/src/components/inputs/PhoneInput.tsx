import { forwardRef } from 'react';
import { Text, TextInput, type TextInputProps } from 'react-native';
import { Input } from './Input';

interface PhoneInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export const PhoneInput = forwardRef<TextInput, PhoneInputProps>(function PhoneInput(
  { label, error, containerClassName, ...props },
  ref,
) {
  return (
    <Input
      ref={ref}
      label={label}
      error={error}
      keyboardType="phone-pad"
      maxLength={11}
      leftIcon={
        <Text className="border-r border-line pr-2.5 text-[16px] font-semibold text-ink-secondary">+63</Text>
      }
      placeholder="917 123 4567"
      containerClassName={containerClassName}
      {...props}
    />
  );
});
