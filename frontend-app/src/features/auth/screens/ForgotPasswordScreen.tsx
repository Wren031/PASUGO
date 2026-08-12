import { Text, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AuthLayout } from '../components/AuthLayout';
import { PhoneInput } from '@/components/inputs/PhoneInput';
import { Button } from '@/components/buttons/Button';
import { forgotPasswordSchema, normalizePhone } from '../validation/auth-schema';
import { authService } from '../services/auth-service';
import { showToast } from '@/store/toast-store';
import type { ForgotPasswordFormValues } from '../types';
import React from 'react';

export function ForgotPasswordScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { phone: '' },
  });

  const reset = useMutation({
    mutationFn: (phone: string) => authService.forgotPassword(phone),
    onSuccess: () => {
      showToast('success', 'Reset link sent', 'Check your SMS for password reset instructions.');
    },
    onError: (error: Error) => {
      showToast('error', 'Reset failed', error.message);
    },
  });

  const onSubmit = handleSubmit((values) => reset.mutate(normalizePhone(values.phone)));

  return (
    <AuthLayout
      title="Reset password"
      subtitle="Enter your registered mobile number and we will send you a reset link."
    >
      <View className="gap-5">
        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <PhoneInput label="Mobile number" value={field.value} onChangeText={field.onChange} error={errors.phone?.message} />
          )}
        />
        <Button label="Send Reset Link" size="lg" fullWidth loading={reset.isPending} onPress={onSubmit} />
        <Text className="text-center text-[13px] leading-5 text-ink-muted">
          For security reasons, the reset link expires after 15 minutes.
        </Text>
      </View>
    </AuthLayout>
  );
}
