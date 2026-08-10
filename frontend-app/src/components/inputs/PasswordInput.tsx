import { forwardRef, useState } from 'react';
import { TextInput, type TextInputProps } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Input } from './Input';
import { IconButton } from '@/components/buttons/IconButton';

interface PasswordInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export const PasswordInput = forwardRef<TextInput, PasswordInputProps>(function PasswordInput(
  { label, error, containerClassName, ...props },
  ref,
) {
  const [visible, setVisible] = useState(false);
  return (
    <Input
      ref={ref}
      label={label}
      error={error}
      secureTextEntry={!visible}
      autoCapitalize="none"
      containerClassName={containerClassName}
      leftIcon={<Feather name="lock" size={20} color="#94A3B8" />}
      rightElement={
        <IconButton
          icon={<Feather name={visible ? 'eye-off' : 'eye'} size={20} color="#94A3B8" />}
          onPress={() => setVisible((v) => !v)}
          accessibilityLabel={visible ? 'Hide password' : 'Show password'}
        />
      }
      {...props}
    />
  );
});
