import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { cn } from '@/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label?: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
  textClassName?: string;
  testID?: string;
}

const variantClasses: Record<ButtonVariant, { container: string; text: string }> = {
  primary: { container: 'bg-primary active:bg-primary-dark', text: 'text-white' },
  secondary: { container: 'bg-slate-100 active:bg-slate-200', text: 'text-ink' },
  outline: { container: 'border border-line bg-white active:bg-slate-50', text: 'text-ink' },
  ghost: { container: 'bg-transparent active:bg-primary-soft', text: 'text-primary' },
  danger: { container: 'bg-danger active:bg-red-600', text: 'text-white' },
  success: { container: 'bg-success active:bg-green-600', text: 'text-white' },
};

const sizeClasses: Record<ButtonSize, { container: string; text: string; icon: string }> = {
  sm: { container: 'h-10 px-4 rounded-xl', text: 'text-[14px] font-semibold', icon: 'h-4 w-4' },
  md: { container: 'h-[50px] px-5 rounded-xl', text: 'text-[15px] font-semibold', icon: 'h-5 w-5' },
  lg: { container: 'h-[54px] px-6 rounded-2xl', text: 'text-base font-bold', icon: 'h-5 w-5' },
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className,
  textClassName,
  testID,
}: ButtonProps) {
  const variantStyle = variantClasses[variant];
  const sizeStyle = sizeClasses[size];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      className={cn(
        'flex-row items-center justify-center gap-2',
        variantStyle.container,
        sizeStyle.container,
        fullWidth && 'w-full',
        isDisabled && 'opacity-50',
        className,
      )}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variant === 'outline' || variant === 'ghost' ? '#F97316' : '#FFFFFF'} />
      ) : (
        <>
          {leftIcon}
          {label ? (
            <Text className={cn(variantStyle.text, sizeStyle.text, textClassName)}>{label}</Text>
          ) : null}
          {rightIcon}
        </>
      )}
    </Pressable>
  );
}
